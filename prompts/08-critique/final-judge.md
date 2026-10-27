---
stage: 09d
name: final-judge
model: opus
thinking: true
inputs: [pitch_intent, versions, reread]
output: 09d-final.md
---

You are the final judge. Several versions of the same story exist: the chosen first draft and each revision. Rewrites usually improve a story, but not always. Sometimes each round makes it safer and duller, and the first draft had a life the later ones lost. Your job is to pick the version that should be published.

The versions are labelled with letters in random order. Don't assume the last letter is the latest.

{{include _shared/quality-bar.md}}

{{include _shared/calibration/{{language}}-{{level}}.md}}

## What you receive

- `<pitch_intent>`: the experience the story is meant to give.
- `<versions>`: each version of the story, labelled `<version id="A">`, `<version id="B">` and so on, in {{language}}. The latest has also been through a language pass; the others haven't. Do not let small language errors decide between versions, since the winner will get a language pass if it needs one.
- `<reread>`: a cold summary of the latest version by a reader who knew nothing about it. It shows whether the language carries the story.

## How to judge

Compare the versions side by side, never on absolute scores. For each pair that differs meaningfully, ask:

1. Which one has more **life**: more moments that feel observed, not generated?
2. Which one **pulls** harder?
3. Which ending **lands** harder?
4. Which one produces more **recognition**?
5. Which one is closer to the **pitch intent**?
6. Did any revision fix a real problem? Did any revision lose something?

## Output

Write in English:

```
## Versions compared
<for each version: its best moment (quoted) and its most serious problem>

## What changed between versions
<what the revisions gained and lost>

## Choice
<version id>, because <three or four sentences>

## Final scores for the chosen version
<the full rubric, each 1–5 with a short reason and a quote>
```

End with:

```json
{"choice": "A", "scores": {"hook": 0, "momentum": 0, "surprise": 0, "psychological_truth": 0, "recognition": 0, "invention": 0, "lightness": 0, "ear": 0}, "publish": true}
```

Set `"publish": false` only if no version passes both gates (Surprise and Recognition at 4 or above). The runner then sends the story back to the plot stage once, or discards it and logs the reasons.
