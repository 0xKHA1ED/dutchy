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
            import os
            import anthropic
            # Cloud sessions keep ANTHROPIC_* names for their own use, so the
            # key can also come as DUTCHY_ANTHROPIC_KEY. The base URL is fixed
            # because the session's ANTHROPIC_BASE_URL points elsewhere.
            key = os.environ.get("DUTCHY_ANTHROPIC_KEY") or os.environ.get("ANTHROPIC_API_KEY")
            if not key:
                raise SystemExit("No API key: set DUTCHY_ANTHROPIC_KEY or ANTHROPIC_API_KEY.")
            self.client = anthropic.Anthropic(
                api_key=key, base_url="https://api.anthropic.com", max_retries=4)

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
            thinking={"type": "adaptive", "display": "summarized"},
            output_config={"effort": effort},
            cache_control={"type": "ephemeral"},
            betas=["server-side-fallback-2026-07-01"],
            fallbacks="default",
        ) as stream:
            msg = stream.get_final_message()
        self._record(label, system, messages, msg)
        if msg.stop_reason == "refusal":
            raise Refused(f"{label}: {msg.stop_details}")
        if msg.stop_reason == "max_tokens":
            self._log(label + " (hit max_tokens)", effort, msg.usage, time.time() - start, msg.model)
            raise RuntimeError(f"{label}: output hit max_tokens ({max_tokens})")
        text = "".join(b.text for b in msg.content if b.type == "text")
        self._log(label, effort, msg.usage, time.time() - start, msg.model)
        return text, msg.content

    def _record(self, label, system, messages, msg):
        """Keep the full request and the model's (summarised) thinking next to
        the call log, so any call can be inspected after a real run."""
        work = self.log_path.parent
        self._save_request(label, system, messages)
        thinking = "\n\n".join(b.thinking for b in msg.content if b.type == "thinking" and b.thinking)
        dump = work / "thinking" / f"{label}.md"
        dump.parent.mkdir(exist_ok=True)
        dump.write_text(f"# {label} ({msg.stop_reason})\n\n{thinking}\n", encoding="utf-8")

    def _save_request(self, label, system, messages):
        dump = self.log_path.parent / "requests" / f"{label}.md"
        dump.parent.mkdir(exist_ok=True)
        turns = "\n\n".join(f"# {m['role'].upper()}\n\n{as_text(m['content'])}" for m in messages)
        dump.write_text(f"# SYSTEM\n\n{system}\n\n{turns}\n", encoding="utf-8")

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
        self._save_request(label, system, messages)
        text = stub(label)
        return text, [{"type": "text", "text": text}]


def as_text(content):
    """A message's content as text: a string as is, content blocks by their text
    (an earlier turn's thinking is in that turn's own thinking file)."""
    if isinstance(content, str):
        return content
    return "".join(getattr(b, "text", None) or (b.get("text", "") if isinstance(b, dict) else "")
                   for b in content)
