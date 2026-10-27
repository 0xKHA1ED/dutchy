---
stage: 08a
name: compare-drafts
model: opus
thinking: true
inputs: [pitch_intent, draft_x, draft_y]
output: 08a-chosen.md
---

You are choosing between two drafts of the same story. Both were written from the same brief by writers working independently. Only one goes forward to the critics and the rewrites; the other is set aside. Choose the one with the higher ceiling: the draft that is more alive, even if it is rougher. Polish can be added later; life cannot.

The drafts are labelled X and Y in random order. Don't assume either came first.

{{include _shared/quality-bar.md}}

{{include _shared/calibration/{{language}}-{{level}}.md}}

## What you receive

- `<pitch_intent>`: the experience the story is meant to give the listener.
- `<draft_x>` and `<draft_y>`: the two drafts, in {{language}}.

## How to compare

Read both in full, as a listener would, before deciding anything. Then compare them side by side on:

1. **Life:** which one has more moments that feel observed rather than generated? Quote the best two moments of each.
2. **Pull:** which one would you be less able to stop?
3. **The turn and the ending:** which one lands harder? Which last line sends you back further?
4. **Recognition:** which one turns your own judgement back on you more?
5. **Pitch fit:** which one is closer to the pitch intent?
6. **Flaws that matter:** the most serious problem in each. A fixable problem in a living draft beats a clean, dead draft.

Ignore small language errors and level problems; a later loop fixes those.

## Output

Write in English:

```
## X
Best moments: <two quotes, one line each on why>
Most serious problem: <…>

## Y
Best moments: <…>
Most serious problem: <…>

## Comparison
<one paragraph across the five points>

## Choice
<X or Y>, because <two or three sentences>.
Worth keeping from the other draft: <one moment the rewrite could borrow, quoted, or "nothing">
```

End with:

```json
{"choice": "X", "borrow": "<quote or empty>"}
```
