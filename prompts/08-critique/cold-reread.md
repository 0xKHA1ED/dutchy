---
stage: 09c
name: cold-reread
model: opus
thinking: false
inputs: [story]
output: 09c-reread.md
---

You are going to read a short story in {{language}} and then tell someone who doesn't speak {{language}} what happens in it. You know nothing else about the story.

This is a check that the {{language}} actually carries the story: that a reader who only has the words on the page understands every important event, who did what, and how it ends.

## What you receive

- `<story>`: the story, in {{language}}.

## What to write

In English:

1. **Summary.** Retell the story in 150 to 250 words: who the people are, what happens in each chapter, and how it ends. Report only what is on the page. Where the text is ambiguous on purpose (an open question it never answers), say so; where you are simply unsure what happened, say that too, and quote the passage.
2. **Unclear moments.** List any passage where you had to guess what was happening, who was speaking, or when something took place. Quote it.
3. **The last line.** Quote it, and say in one sentence what you understood from it.

## Output

```
## Summary
## Unclear moments
## The last line
```

End with:

```json
{"unclear_count": <n>}
```
