# Seed banks

The dice. Language models are bad at being random: asked for "a random job" they return the same dozen, and asked for a name they return Elara. So the runner rolls dice in code against these banks, and the director only chooses among what was rolled. Awkward combinations are often the best ones, which is why the director may reroll only one category per story.

## Format

Each bank is a Markdown file. **Every line that starts with `- ` is one entry.** Everything else (headings, notes) is ignored by the dice. An entry may carry tags in square brackets at the start, and a short note after a dash:

```
- [japan] A 24-hour laundromat in a residential street in Osaka — regulars who never speak, a vending machine that sells one strange drink
```

Tags are used for filtering (a place's region chooses the name bank) and for weights in `config/preferences.yaml`.

## The specificity rule

Every entry must be specific enough to suggest a story on its own. "A hospital" fails; "the night shift in a hospital laundry" passes. "A teacher" fails; "a driving-test examiner three weeks from retirement" passes. If an entry could appear in any story, it belongs in none.

## Banks

| File | Rolled | Notes |
| --- | --- | --- |
| `places.md` | 1 per story | Anywhere in the world. Tagged by region. |
| `roles.md` | 1 per story | The protagonist's job or social role. |
| `life-stages.md` | 1 per story | Age and the life moment that comes with it. |
| `objects.md` | 1 per story | A candidate for the symbolic object. The forge may replace it if a better one emerges, but must say why. |
| `pressures.md` | 1 per story | What squeezes the situation: deadline, debt, visitor, test. |
| `changed-rules.md` | Only when the story is speculative | One changed rule of reality; everything else stays ordinary. |
| `wildcards.md` | 1 per story | An odd creative constraint, in the spirit of Eno's *Oblique Strategies*. |
| `names.md` | Several per story | Given names and family names by region. |

Mechanisms are rolled from `universals/`, not from here.

## Growing the banks

These starter banks hold 40 to 70 entries each; the aim is 150 to 300. New entries can be drafted in bulk by a model, then curated by hand: strike anything generic, anything that sounds like a story you have already read, and anything that only works in one genre. Curation is where Khaled's taste enters the system.
