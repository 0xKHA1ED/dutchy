"""The dice: every random choice in the pipeline is made here, in code.

Models are bad at being random (they pick the same "random" things every
time), so the ingredients of each story are rolled from the seed banks and
the mixes in config/preferences.yaml. Each category gets a primary value and
one alternate; the director may swap one category to its alternate.
"""

import random
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SEEDS = ROOT / "prompts" / "seeds"
UNIVERSALS = ROOT / "prompts" / "universals"

# Seed bank file -> roll category, and the ledger field used for its cooldown.
BANKS = {
    "places.md": "place",
    "roles.md": "role",
    "life-stages.md": "life_stage",
    "objects.md": "object",
    "pressures.md": "pressure",
    "changed-rules.md": "changed_rule",
    "wildcards.md": "wildcard",
}

TAG = re.compile(r"^\[([^\]]+)\]\s*")


def read_bank(path):
    """Return the entries of a seed bank: lines starting with '- '."""
    entries = []
    for line in path.read_text(encoding="utf-8").splitlines():
        if not line.startswith("- "):
            continue
        text = line[2:].strip()
        m = TAG.match(text)
        tag = m.group(1) if m else None
        if m:
            text = text[m.end():]
        entries.append({"tag": tag, "text": text})
    return entries


def entry_weight(prefs, key, entry):
    """Weight from preferences.yaml: a number for the whole file, or a dict
    whose keys match the entry's tag or a unique part of its text."""
    w = (prefs.get("weights") or {}).get(key)
    if w is None:
        return 1.0
    if isinstance(w, (int, float)):
        return float(w)
    for part, value in w.items():
        if part == entry.get("tag") or part.lower() in entry["text"].lower():
            return float(value)
    return 1.0


def recent(ledger, category, n):
    """Values of a category used by the last n stories (published or not)."""
    if not n:
        return set()
    return {row.get("roll", {}).get(category) for row in ledger[-n:]} - {None}


def pick_two(rng, items, weights):
    """A primary and a distinct alternate, by weight."""
    pool = [(i, w) for i, w in zip(items, weights) if w > 0]
    if not pool:
        raise ValueError("nothing left to roll: every entry is banned or cooling down")
    first = rng.choices([i for i, _ in pool], [w for _, w in pool])[0]
    rest = [(i, w) for i, w in pool if i is not first]
    second = rng.choices([i for i, _ in rest], [w for _, w in rest])[0] if rest else None
    return first, second


def roll_bank(rng, prefs, ledger, filename, category):
    entries = read_bank(SEEDS / filename)
    cooling = recent(ledger, category, (prefs.get("cooldowns") or {}).get(category, 0))
    weights = [0 if e["text"] in cooling else entry_weight(prefs, f"seeds/{filename}", e)
               for e in entries]
    return pick_two(rng, entries, weights)


def roll_mix(rng, mix):
    """A primary and alternate from a mix of relative weights."""
    a, b = pick_two(rng, list(mix), list(mix.values()))
    return {"primary": a, "alternate": b}


def chance(rng, percent):
    return rng.random() * 100 < percent


def mechanisms():
    return sorted(p.stem for p in UNIVERSALS.glob("*.md") if p.stem != "README")


def roll(prefs, ledger, seed=None):
    rng = random.Random(seed)
    cooldowns = prefs.get("cooldowns") or {}
    result = {}

    names = mechanisms()
    cooling = recent(ledger, "mechanism", cooldowns.get("mechanism", 0))
    weights = [0 if n in cooling else entry_weight(prefs, f"universals/{n}.md", {"text": n})
               for n in names]
    a, b = pick_two(rng, names, weights)
    result["mechanism"] = {"primary": a, "alternate": b}

    result["collision_mechanism"] = None
    if chance(rng, prefs.get("collision_mechanism", 0)):
        others = [n for n in names if n not in (a, b)]
        result["collision_mechanism"] = {"primary": rng.choice(others), "alternate": None}

    for filename, category in BANKS.items():
        if category == "changed_rule" and not chance(rng, prefs.get("speculative", 0)):
            result[category] = None
            continue
        first, second = roll_bank(rng, prefs, ledger, filename, category)
        value = {"primary": first["text"], "alternate": second["text"] if second else None}
        if category == "place":
            value["primary_region"] = first["tag"]
            value["alternate_region"] = second["tag"] if second else None
        result[category] = value

    for key in ("register", "ending_temperature", "era", "pov", "narrative_tense"):
        result[key] = roll_mix(rng, prefs[key])

    costumes = prefs.get("costumes") or {}
    cooling = recent(ledger, "costume", cooldowns.get("costume", 0))
    pool = {c: w for c, w in costumes.items() if c not in cooling and w > 0}
    candidates = []
    while pool and len(candidates) < 3:
        c = rng.choices(list(pool), list(pool.values()))[0]
        candidates.append(c)
        del pool[c]
    result["costume_candidates"] = candidates

    result["flags"] = {
        "quiet_structure": chance(rng, prefs.get("quiet_structure", 0)),
        "direct_address_allowed": chance(rng, prefs.get("direct_address", 0)),
    }
    return result


def names_for(region, rng=None):
    """The names line for a region; [anywhere] (or an unknown region) draws a
    random region."""
    rng = rng or random.Random()
    lines = {e["tag"]: e["text"] for e in read_bank(SEEDS / "names.md")}
    if region not in lines:
        region = rng.choice(sorted(lines))
    return f"[{region}] {lines[region]}"
