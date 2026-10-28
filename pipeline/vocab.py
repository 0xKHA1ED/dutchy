"""The vocabulary check: a mechanical report for the level critic.

Every word of the story is looked up in a frequency list of word forms. The
list counts forms, not dictionary words, so about 5,000 forms stand in for
the ~2,500 core words of B1. The report over-flags (rare inflections, names,
cognates); the level critic decides what matters.
"""

import re
from collections import defaultdict
from pathlib import Path

DATA = Path(__file__).resolve().parent / "data"
CORE_FORMS = {"b1": 5000}
KNOWN_FORMS = 10000
ELISION = re.compile(r"^(?:l|d|j|m|t|s|n|c|qu|jusqu|lorsqu|puisqu)['’]", re.I)
WORD = re.compile(r"[A-Za-zÀ-ÖØ-öø-ÿŒœ'’-]+")


def ranks(language):
    words = [w.strip() for w in (DATA / f"{language}-frequency.txt").read_text(encoding="utf-8").splitlines()
             if w.strip() and not w.startswith("#")]
    return {w: i + 1 for i, w in enumerate(words)}


PRONOUN_SUFFIX = re.compile(r"-(?:t-)?(?:je|tu|il|elle|on|nous|vous|ils|elles|ce|moi|toi|lui|leur|le|la|les|y|en)$")
# Inflected endings -> dictionary endings to try, longest first. Crude, but it
# keeps common verbs and adjectives (souri, ouvertes, sourit) out of the report.
ENDINGS = [("aient", ["er", "ir", "re"]), ("erons", ["er"]), ("eront", ["er"]), ("ées", ["er"]), ("ée", ["er"]),
           ("és", ["er"]), ("é", ["er"]), ("ait", ["er", "ir", "re"]), ("ais", ["er", "ir", "re"]),
           ("ions", ["er", "ir", "re"]), ("iez", ["er", "ir", "re"]), ("ent", ["er", "re"]), ("ons", ["er", "re"]),
           ("ez", ["er"]), ("ies", ["ir"]), ("ie", ["ir"]), ("is", ["ir", "re"]), ("it", ["ir", "re"]),
           ("i", ["ir", "ire"]), ("ues", ["re", "oir"]), ("ue", ["re", "oir"]), ("us", ["re", "oir"]),
           ("u", ["re", "oir"]), ("ertes", ["rir"]), ("erte", ["rir"]), ("erts", ["rir"]), ("ert", ["rir"]),
           ("es", ["", "e"]), ("e", ["", "er"]), ("s", [""]), ("x", [""])]


def best_rank(word, rank):
    """Rank of the word, or of a likely dictionary form of it."""
    found = [rank[word]] if word in rank else []
    for end, subs in ENDINGS:
        if word.endswith(end) and len(word) > len(end) + 2:
            stem = word[: -len(end)]
            found += [rank[stem + sub] for sub in subs if stem + sub in rank]
    return min(found) if found else None


def report(story, chapters, language, level, palette=""):
    rank = ranks(language)
    core = CORE_FORMS.get(level, 5000)
    palette_words = {w.lower() for w in WORD.findall(palette or "")}
    hits = defaultdict(lambda: {"count": 0, "chapters": set(), "rank": None})
    total = 0
    # Capitalised words seen mid-sentence are names; skip them at sentence starts too.
    names = {w for text in chapters for sent in re.split(r"(?<=[.!?…])\s+", text)
             for w in WORD.findall(sent)[1:] if w[:1].isupper()}
    for n, text in enumerate(chapters, 1):
        for sentence in re.split(r"(?<=[.!?…])\s+", text):
            for i, raw in enumerate(WORD.findall(sentence)):
                token = PRONOUN_SUFFIX.sub("", ELISION.sub("", raw)).strip("'’-")
                if not token:
                    continue
                total += 1
                if token[0].isupper() and (i > 0 or token in names):
                    continue  # names
                word = token.lower()
                r = best_rank(word, rank)
                if r and r <= core:
                    continue
                hits[word]["count"] += 1
                hits[word]["chapters"].add(n)
                hits[word]["rank"] = r

    above = sorted(((w, h) for w, h in hits.items() if h["rank"]), key=lambda x: x[1]["rank"])
    unknown = sorted(((w, h) for w, h in hits.items() if not h["rank"]), key=lambda x: -x[1]["count"])
    flagged = sum(h["count"] for h in hits.values())

    def line(w, h):
        where = ", ".join(str(c) for c in sorted(h["chapters"]))
        tag = " (palette)" if w in palette_words else ""
        rank_note = f"rank {h['rank']}" if h["rank"] else f"not in top {KNOWN_FORMS}"
        return f"- {w}{tag}: {h['count']}x, chapters {where}, {rank_note}"

    out = [
        "# Vocabulary report (script)",
        f"Words checked: {total}. Outside the {core} most frequent forms: {flagged} "
        f"({flagged / max(total, 1):.1%}), {len(hits)} distinct.",
        "",
        f"## Above core, within the top {KNOWN_FORMS} forms",
        *(line(w, h) for w, h in above),
        "",
        f"## Rare or unknown (not in the top {KNOWN_FORMS}; may be inflections, names or cognates)",
        *(line(w, h) for w, h in unknown),
    ]
    return "\n".join(out)
