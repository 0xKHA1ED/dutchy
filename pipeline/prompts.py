"""Loading prompt files: frontmatter, includes, placeholders, and the helpers
that read the Markdown and JSON the prompts produce."""

import json
import re
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
PROMPTS = ROOT / "prompts"

LANGUAGE_NAMES = {"fr": "French", "nl": "Dutch"}
INCLUDE = re.compile(r"\{\{include ([^}]+)\}\}")


def split_frontmatter(text):
    if text.startswith("---\n"):
        end = text.index("\n---", 4)
        return yaml.safe_load(text[4:end]) or {}, text[end + 4:].lstrip("\n")
    return {}, text


def resolve(body, language, level, depth=0):
    """Paste in {{include}} files (codes first, so paths like
    _shared/levels/{{level}}.md resolve), then fill the remaining
    placeholders with readable names ("French", "B1")."""
    if depth > 5:
        raise RecursionError("includes nested too deeply")
    coded = "\n".join(
        line.replace("{{language}}", language).replace("{{level}}", level) if "{{include" in line else line
        for line in body.splitlines())

    def paste(m):
        _, included = split_frontmatter((PROMPTS / m.group(1).strip()).read_text(encoding="utf-8"))
        return resolve(included, language, level, depth + 1).strip()

    out = INCLUDE.sub(paste, coded)
    return out.replace("{{language}}", LANGUAGE_NAMES.get(language, language)).replace("{{level}}", level.upper())


def load(rel, language, level):
    """Return (meta, system_prompt) for a prompt file. A `base:` in the
    frontmatter puts that file's body first (the rewrite builds on the writer)."""
    meta, body = split_frontmatter((PROMPTS / rel).read_text(encoding="utf-8"))
    if meta.get("base"):
        _, base = split_frontmatter((PROMPTS / meta["base"]).read_text(encoding="utf-8"))
        body = base.rstrip() + "\n\n" + body
    return meta, resolve(body, language, level)


def user_message(inputs):
    """Inputs go in the user message, each in an XML tag named after it."""
    parts = []
    for name, value in inputs.items():
        if value is None:
            continue
        parts.append(f"<{name}>\n{str(value).strip()}\n</{name}>")
    return "\n\n".join(parts)


def last_json(text):
    """The final ```json block of an output: the only part code reads."""
    blocks = re.findall(r"```json\s*\n(.*?)```", text, re.S)
    if not blocks:
        raise ValueError("no json block in output")
    return json.loads(blocks[-1])


def bare_json(text):
    """For prompts whose whole output is JSON (possibly fenced)."""
    t = text.strip()
    m = re.search(r"```(?:json)?\s*\n(.*?)```", t, re.S)
    if m:
        t = m.group(1)
    return json.loads(t[t.find("{"): t.rfind("}") + 1])


def section(text, heading):
    """The body under a Markdown heading (any level), up to the next heading
    of the same or a higher level. Matches the start of the heading text."""
    lines = text.splitlines()
    for i, line in enumerate(lines):
        m = re.match(r"^(#+)\s+(.*)$", line)
        if m and m.group(2).strip().lower().startswith(heading.lower()):
            level = len(m.group(1))
            out = []
            for nxt in lines[i + 1:]:
                n = re.match(r"^(#+)\s", nxt)
                if n and len(n.group(1)) <= level:
                    break
                out.append(nxt)
            return "\n".join(out).strip()
    return None


def without_json(text):
    return re.sub(r"```json\s*\n.*?```", "", text, flags=re.S).strip()


def chapters(story):
    """Split a story ('# Title', then '## 1', '## 2'...) into (title, [chapters])."""
    title = re.search(r"^#\s+(.+)$", story, re.M)
    parts = re.split(r"^##\s+\d+.*$", story, flags=re.M)
    return (title.group(1).strip() if title else ""), [p.strip() for p in parts[1:]]
