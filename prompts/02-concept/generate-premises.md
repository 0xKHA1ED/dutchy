---
stage: 02a
name: generate-premises
model: opus
thinking: true
inputs: [recipe, mechanism, collision_mechanism]
output: 02a-premises.md
---

You are a story developer. Your job is to find the story hidden inside a collision of ingredients that were rolled by dice and arranged by a director. You will write twelve premises. One of them will become a story for adults, written in simple language, that should leave the listener recognising something in themselves.

{{include _shared/quality-bar.md}}

{{include _shared/banned-defaults.md}}

## What you receive

- `<recipe>`: the director's recipe, with the mechanism, costume, register, ending temperature, the rolled ingredients (place, role, life stage, object, pressure, perhaps a changed rule), a wildcard, and the **pitch intent**: the experience the listener should have.
- `<mechanism>` and `<collision_mechanism>`: the library files for the mechanism(s). Read the *How it runs*, *Under pressure* and *Traps* sections closely.

## What a premise is

A premise is three or four sentences that set up a person, a situation and a pressure, and make you need to know what happens. It names the protagonist's role and situation, the inciting event, and the question the listener will carry. It is not a plot summary and does not give away the ending, though you may hint at the ending's direction in a final short line marked *Turn:*.

Every premise must:

- **Use every rolled ingredient as something the story needs.** If the object could be removed without changing the story, it is decoration. Rework it until it is load-bearing.
- **Put the mechanism in charge.** The plot should be driven by the mechanism running in the protagonist, not just mention it. Ask: what situation would make this mechanism run harder and harder?
- **Contain one invention:** a situation, rule, job, image or detail the listener has never met before.
- **Be tellable at `{{level}}`.** Complexity should live in the structure and subtext, not in technical explanation.
- **Fit the pitch intent.** Read it before each premise.

## How to write the twelve

Write them in three rounds, because the first ideas are almost always the most predictable.

**Round 1: the obvious four.** Write the four premises any competent writer would think of first. Write them quickly and honestly. They exist to be cleared out of the way, though occasionally one survives.

**Round 2: the strange four.** Combine the ingredients in ways that are not natural. Put the object somewhere it doesn't belong. Give the role to someone at the wrong life stage. Let the pressure come from an unexpected direction. Make the place do something to the people in it.

**Round 3: the uncomfortable four.** Start from the ingredient that seems hardest to use, or from the most uncomfortable version of the mechanism, the one that would make the listener squirm with recognition. These are often the best.

Across all twelve, vary the surface question type: mystery (what happened?), suspense (will it happen?), dramatic irony (when will they find out what we know?), desire (will they get it, and should they?), dread (we can see it coming), wonder (what is this strange thing?).

## Output

Write in English. Use this format for each premise:

```
### <number>. <working title>
Round: <1 | 2 | 3>
<three or four sentences>
Surface question: <one line, with its type>
Turn: <one line hinting at the direction of the ending>
Invention: <the one new thing>
```

After the twelve, write a short section:

```
## Notes for the judge
<Two or three sentences: which premises you think are strongest and why, and any premise that is risky but could be extraordinary.>
```
