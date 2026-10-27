"""One place that talks to the model. Every call is logged with its token
usage and cost, so the price of a story is known."""

import json
import threading
import time
from pathlib import Path

# Claude Opus 5.5, per million tokens.
PRICES = {"input": 4.00, "output": 20.00, "cache_read": 0.20, "cache_write": 5.00}


class Refused(Exception):
    pass


class LLM:
    def __init__(self, model, log_path, dry_run=False):
        self.model = model
        self.log_path = Path(log_path)
        self.dry_run = dry_run
        self.lock = threading.Lock()
        self.cost = 0.0
        if not dry_run:
            import anthropic
            self.client = anthropic.Anthropic(max_retries=4)

    def call(self, system, messages, effort, label, max_tokens=64000):
        """Send one request and return (text, content blocks). Thinking is
        adaptive; effort sets how hard the model works. A refusal falls back
        server-side to another model."""
        if self.dry_run:
            return self._dry(system, messages, label)
        start = time.time()
        with self.client.beta.messages.stream(
            model=self.model,
            max_tokens=max_tokens,
            system=system,
            messages=messages,
            thinking={"type": "adaptive"},
            output_config={"effort": effort},
            cache_control={"type": "ephemeral"},
            betas=["server-side-fallback-2026-07-01"],
            fallbacks="default",
        ) as stream:
            msg = stream.get_final_message()
        if msg.stop_reason == "refusal":
            raise Refused(f"{label}: {msg.stop_details}")
        if msg.stop_reason == "max_tokens":
            raise RuntimeError(f"{label}: output hit max_tokens ({max_tokens})")
        text = "".join(b.text for b in msg.content if b.type == "text")
        self._log(label, effort, msg.usage, time.time() - start, msg.model)
        return text, msg.content

    def _log(self, label, effort, usage, seconds, served_by):
        cache_read = getattr(usage, "cache_read_input_tokens", 0) or 0
        cache_write = getattr(usage, "cache_creation_input_tokens", 0) or 0
        cost = (usage.input_tokens * PRICES["input"] + usage.output_tokens * PRICES["output"]
                + cache_read * PRICES["cache_read"] + cache_write * PRICES["cache_write"]) / 1e6
        row = {"call": label, "effort": effort, "model": served_by, "seconds": round(seconds),
               "input": usage.input_tokens, "cache_read": cache_read, "cache_write": cache_write,
               "output": usage.output_tokens, "usd": round(cost, 4)}
        with self.lock:
            self.cost += cost
            with self.log_path.open("a", encoding="utf-8") as f:
                f.write(json.dumps(row) + "\n")
        print(f"  {label}: {usage.output_tokens} out, ${cost:.2f} (story so far ${self.cost:.2f})", flush=True)

    def _dry(self, system, messages, label):
        """Dry run: save the exact request for inspection and return a stub."""
        from .stubs import stub
        size = len(system) + sum(len(json.dumps(m["content"], default=str)) for m in messages)
        with self.lock, self.log_path.open("a", encoding="utf-8") as f:
            f.write(json.dumps({"call": label, "approx_input_tokens": size // 4}) + "\n")
        dump = self.log_path.parent / "requests" / f"{label}.md"
        dump.parent.mkdir(exist_ok=True)
        last = messages[-1]["content"]
        dump.write_text(f"# SYSTEM\n\n{system}\n\n# USER (last turn)\n\n{last}\n", encoding="utf-8")
        text = stub(label)
        return text, [{"type": "text", "text": text}]
