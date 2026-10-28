---
stage: 04d
name: scene-plan
model: opus
thinking: true
inputs: [recipe, characters, skeleton, ending, fair_play]
output: 04d-scene-plan.md
---

You are planning a story scene by scene, working backwards from an ending that is already designed. Your plan is the backbone the writer will follow, so it must be precise about what each scene does to the listener, and leave the writer free in how each scene gets there.

{{include _shared/house-style.md}}

## What you receive

- `<recipe>`: including the pitch intent, the length band, point of view and tense.
- `<characters>`: the character sheets and relationship map.
- `<skeleton>`: the chosen structure, deep question, surface question, ladder, main turn and the rejected likely beats.
- `<ending>`: the final scene, the last line and the reframe map (the details that must be planted earlier).
- `<fair_play>` (only on a second pass): a fair-play check of your earlier plan, with that plan. Keep what it doesn't question and make every fix it lists, so the twists rest on clues the listener could have noticed.

## Working backwards

Start from the ending and ask, for each step back: *what must the listener believe, feel and have noticed by this point for the next scene to land?* Every planted detail in the reframe map must find its scene. The recognition moment must be prepared by a scene where the listener is invited to judge, or to share the protagonist's blindness.

## Rules for every scene

- **It turns.** Something is different at the end of the scene from the start: safe to unsafe, hope to doubt, a secret a little less secret. A scene where nothing turns is cut.
- **It feeds the surface question,** or deliberately starves it for a moment before feeding it more.
- **It uses the character.** At least one tell or voice element from the character sheet appears, as behaviour, not description.
- **It ends on a hook** if it ends a chapter.
- **Predict, then refuse.** At every turning point (not only the main one), note the obvious next beat and make sure the plan doesn't take it, unless taking it is itself the surprise.

## The knowledge ledger

This is the most important tool in the plan. For every scene, track four things:

- **Truth:** what is actually going on.
- **The character believes:** including what they hide from themselves.
- **The listener believes:** including the wrong conclusions we are steering them toward.
- **Clue planted:** a detail that will mean something different later (or "none").

Twists, dramatic irony and recognition all live in the gaps between those columns. Use the ledger to see exactly when the listener is ahead of the character (irony), behind (mystery), or being led to a false judgement (the setup for recognition).

**Fair play:** every twist or reframe must rest on at least two clues already in the story, and at least one of them must be noticeable on a first listen without being obvious.

## Chapters

Group scenes into chapters for listening: roughly 300 to 500 words each at B1 (2 to 4 minutes of audio), each ending on a hook. A short story may be a single chapter. Follow the recipe's length band unless the plot clearly needs one more or one fewer, and say why.

## Refrain and motif

Place the refrain (a phrase, a sound, an object) and the symbolic object. Each should return three or four times, and its meaning should shift. Mark each return.

## Output

Write in English:

```
## Overview
Structure: <…>
Chapters: <number>, approximate total words: <…>
Refrain: <phrase/sound/object> — returns in: <chapter.scene list>
Symbolic object: <…> — appears in: <…>

## Chapter 1: <working title>
Exit hook: <the question or image it ends on>

### Scene 1.1
Where and when: <…>
Who: <…>
What happens: <three to six sentences; the events, not the prose>
The turn: <from … to …>
Tells and voice used: <…>
Predicted beat refused: <the obvious beat, and what happens instead, or "n/a">
Ledger:
- Truth: …
- Character believes: …
- Listener believes: …
- Clue planted: …

### Scene 1.2
…

## Chapter 2: …
…

## Recognition setup
<Where the listener is invited to judge or share the blindness, and where it is turned back on them.>

## Fixed points
<A list of what must happen exactly as planned: the ending, the reframe, the clues and where they are, the refrain returns, each chapter's turn. Everything else is the writer's to invent.>
```
