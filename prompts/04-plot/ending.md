---
stage: 04c
name: ending
model: opus
thinking: true
inputs: [recipe, characters, skeleton]
output: 04c-ending.md
---

You are designing the ending of a story before anything else in it is written, because everything else is a setup for it. A plot skeleton has been chosen; your job is to make its ending as strong as it can be, and to prove it with three tests.

{{include _shared/quality-bar.md}}

## What you receive

- `<recipe>`: including the pitch intent and the **ending temperature** (warm, bitter or open).
- `<characters>`: the character sheets, including the protagonist's central contradiction, symbolic object, tells, never-say list and recognition setup.
- `<skeleton>`: the chosen plot skeleton with its deep question, surface question, ladder, main turn and ending sketch.

## Ending types

| Type | What happens | Effect |
| --- | --- | --- |
| The reframe | The last line gives an early detail its true meaning | The listener replays the story in their head |
| The choice | The character finally chooses the need over the want, or fails to | Catharsis, or a quiet tragedy |
| The ironic win | They get exactly what they wanted and lose what they needed | A bitter laugh |
| The open door | The plot stays open, but the emotional question is answered | Lingering; the listener finishes it themselves |
| The comic collapse | The mechanism runs to its absurd end and the character is still standing in the wreckage | Laughter that stings |

Every story needs a **reframe**, even when its ending is one of the other types. Not every story needs a twist.

The ending temperature from the recipe guides the type: *warm* endings lean to the choice made well or a tender reframe; *bitter* endings lean to the ironic win, the choice failed, or the comic collapse; *open* endings lean to the open door. Temperature is about feeling, not happiness: a warm ending can still cost a great deal.

{{include _shared/banned-defaults.md}}

## What to design

1. **The final scene,** in prose notes (not polished prose): where it happens, who is there, what is done, what is said and not said, and the final image or line. The ending is **enacted, never explained**. Nobody understands their life out loud.
2. **The last line.** Write two or three candidates in English, and pick one. The best last lines are short, concrete and send the listener back to an earlier moment. A refrain from earlier in the story, returned with a new meaning, is often the strongest.
3. **The reframe map:** list the earlier details (objects, lines, habits) that the ending changes the meaning of, and where they need to be planted.
4. **An alternative ending** of a different type, sketched in three sentences, so the judge and the writer know what was not chosen and why.

## The three tests

Run each test honestly and write the result:

1. **The last-line test.** Does the final line send the listener back to an earlier moment? Which one?
2. **The inevitability test.** Could a careful listener have seen this coming from the clues, after the fact? List the clues that make it fair.
3. **The deep-question test.** Does the ending answer the deep question without stating it? How exactly: what action or image carries the answer?

If any test fails, revise the ending and run the tests again. If you cannot make it pass, say so plainly, so the runner can send the story back to the skeleton stage.

## Output

Write in English:

```
## Ending type
<type, and how it fits the ending temperature>

## Final scene
<prose notes>

## Last line
Candidates:
1. …
2. …
Chosen: <…>, because …

## Reframe map
- <detail> → <its meaning at the end> → <where it must be planted>
…

## Alternative ending (not chosen)
<three sentences, and why not>

## Tests
1. Last line: <pass/fail, and why>
2. Inevitability: <pass/fail; the clues>
3. Deep question: <pass/fail; the action or image that answers it>
```

End with:

```json
{"tests_passed": true}
```
