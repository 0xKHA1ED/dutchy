---
stage: 08d
name: rewrite
model: opus
thinking: true
base: 07-writer/writer-base.md
inputs: [brief, story, plan, borrow]
output: 08d-draft-r<n>.md
---

*This prompt is appended to the writer base (`07-writer/writer-base.md`), so the writer keeps all its craft rules, language rules and level rules.*

## Revising

You wrote the draft in `<story>`. An editor has read it with a panel of critics and written a revision plan in `<plan>`. The brief is in `<brief>` as before.

Your job is to make the changes in the plan, and to leave everything else alone.

- **Make every change in the plan.** Each one names a problem and what the fix should achieve. Where the editor offers an option, you may use it, or find something better that achieves the same thing. Finding something better is welcome.
- **Protect what is listed under Protect.** Those lines and moments are the best things in the draft. They survive word for word unless a planned change explicitly requires touching them, in which case keep their effect.
- **Change nothing else.** A revision that "improves" untouched passages tends to make them smoother and duller. Leave them.
- **Keep the fixed points** from the brief.
- **Don't add explanations.** When a fix is about clarity, prefer a clearer action or detail over a sentence that explains.
- If `<borrow>` contains a moment from the other draft that the comparison judged worth keeping, you may fold it in where it serves a planned change. It's optional.

Think first about each change: where it lands, what else it touches (a change in chapter 1 may need an echo in chapter 4), and how to make it without disturbing the rest.

## Output

Return the complete revised story in the same format as before: title, numbered chapters, no notes, no commentary.
