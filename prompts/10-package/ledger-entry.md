---
stage: 10
name: ledger-entry
model: opus
thinking: false
inputs: [recipe, premise, characters, skeleton, world, story, final_judge]
output: 10-ledger-entry.json
---

You are writing one row of the library ledger. The ledger is the series' memory: future stories are checked against it so the library doesn't repeat itself (the same names, objects, settings, final images and endings). Every field should be specific enough that a later story could be compared with it.

## What you receive

`<recipe>`, `<premise>`, `<characters>`, `<skeleton>`, `<world>`, `<story>` (final, in {{language}}), `<final_judge>`.

## Output

Return only a JSON object on a single line, with these fields:

```json
{"id": "<runner fills>", "date": "<runner fills>", "title": "<title in the story language>", "title_en": "<English>", "logline": "<one sentence, in English>", "mechanism": "<…>", "collision": "<… or null>", "costume": "<…>", "register": "<…>", "ending_temperature": "<…>", "structure": "<…>", "surface_question": "<type: question>", "deep_question": "<…>", "place": "<…>", "region": "<…>", "era": "<…>", "role": "<…>", "life_stage": "<…>", "names": ["<every character name>"], "symbolic_object": "<…>", "story_sound": "<… or null>", "wildcard": "<…>", "changed_rule": "<… or null>", "ending_type": "<…>", "final_image": "<the last image, in a few English words>", "last_line": "<in the story language>", "last_line_en": "<English>", "palette": ["<words>"], "words": 0, "chapters": 0, "scores": {"hook": 0, "momentum": 0, "surprise": 0, "psychological_truth": 0, "recognition": 0, "invention": 0, "lightness": 0, "ear": 0}}
```
