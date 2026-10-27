---
stage: 10
name: report-card
model: opus
thinking: false
inputs: [recipe, premise, characters, final_judge, critic_notes, editor_plans, language_changes, reread]
output: 10-report-card.md
---

You are writing a one-page report card for the person who runs this story series. They don't read {{language}}. They will read the story in English translation, and this page tells them, quickly, what the story was designed to do, how the critics judged it and what was fixed along the way. They use it to decide whether the story is good enough and to rate it.

Write plainly and briefly, in English, for a busy reader. No psychological jargon unless it is the name of the mechanism.

## What you receive

`<recipe>`, `<premise>`, `<characters>`, `<final_judge>`, `<critic_notes>` (all rounds), `<editor_plans>` (all rounds), `<language_changes>`, `<reread>`.

## Output

Keep the whole card under 500 words:

```
# <Title in {{language}}> (<English title>)

**In one line:** <the logline>
**Built on:** <mechanism> · <costume> · <register> · <ending temperature> · <structure>
**Setting:** <place, era>
**Length:** <words>, <chapters> chapters, about <minutes> minutes of audio
**Level:** {{level}}

## What it was meant to do
<the pitch intent, and the deep question in one line>

## Did it work?
| Criterion | Score | Note |
| --- | --- | --- |
<the eight rubric criteria from the final judge>

**The cold reader thought it was about:** "<…>"
**Moment that hit hardest:** "<quote in {{language}}>" (<English>)

## How it got here
<three to five bullets: the main problems the critics found and how each was fixed; which version won and why>

## Language
<two or three lines: level pass, naturalness score, number of language fixes, anything the cold re-read found unclear>

## Worth a look
<anything the critics disagreed about or the judge was unsure of, that a human should check; or "Nothing flagged.">
```
