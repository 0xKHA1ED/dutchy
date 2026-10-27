---
stage: 04e
name: fair-play-check
model: opus
thinking: true
inputs: [scene_plan, ending]
output: 04e-fair-play.md
---

You are checking that a story plays fair with its listener. You have its scene plan and its designed ending. You have not seen the characters' psychological files and you don't need them: your only question is whether every surprise in this story is earned by clues the listener could have noticed.

## What you receive

- `<scene_plan>`: the scenes, chapter by chapter, each with a knowledge ledger (truth, what the character believes, what the listener believes, the clue planted).
- `<ending>`: the final scene, the last line and the reframe map.

## What to check

1. **List every twist, reveal and reframe** in the plan and the ending: any moment where the listener's understanding is meant to change.
2. For each one, **find the clues** that make it fair. Each needs at least two, planted in earlier scenes. At least one must be noticeable on a first listen without being obvious.
3. **Check the reframe map:** is every detail the ending relies on actually planted, in a scene before the ending, as the map says?
4. **Rebuild the twists from the clues alone.** Imagine a sharp listener who has only heard the clues. Could they, in hindsight, reconstruct each twist? If not, a clue is missing.
5. **Check for over-signalling.** Is any clue so loud that the twist becomes obvious too early? Mark it.
6. **Check the coincidence rule.** Does any coincidence get a character *out* of trouble? Mark it.

## Output

Write in English:

```
## Twists and reframes
1. <twist> — clues: <scene ids> — first-listen clue: <which> — verdict: fair / thin / missing / too loud
…

## Reframe map check
<each detail: planted in <scene> / not planted>

## Coincidences
<none, or each one and whether it rescues or only complicates>

## Fixes
<For each problem: the smallest change to the plan that would fix it.>
```

End with:

```json
{"fair": true, "fixes_needed": 0}
```

If any fixes are needed, the runner sends the scene plan back to the scene-plan stage once, with your Fixes section attached as notes.
