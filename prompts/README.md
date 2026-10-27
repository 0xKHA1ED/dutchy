# The story prompt tree

This folder is the brain of the story pipeline. It turns a few dice rolls into a graded-reader story that is genuinely worth reading or listening to: one that pulls the listener forward, surprises them, and leaves them recognising something in themselves.

The design behind every file here was worked out in a series of design docs (quality bar, character forge, plot, world, director, assembler, critics). This README is the operating manual: what runs when, what each stage reads and writes, and how prompt files are put together.

## The core ideas, in one screen

1. **Quality has three parts.** *Pull* (the listener cannot stop), *Recognition* (they see something of themselves they never put into words) and *Invention* (they meet something they have never met before). Every prompt serves one of the three. See `_shared/quality-bar.md`.
2. **Mechanisms, not themes.** Every story starts from a universal psychological mechanism (projection, mimetic desire, self-sabotage…) from `universals/`. Genre is only the costume the mechanism wears.
3. **Design in English, write in the target language.** Everything up to the writer's brief is language-free. Language and level enter only at the assembler, the writer and the language critics.
4. **Facts before interpretation.** Characters start as a factual dossier and a self-deceiving interview. Seven psychological lenses read both. A case conference keeps what they agree on and turns their disagreements into drama.
5. **Diverge, then select.** Concepts, plots and drafts are generated in several versions and judged side by side.
6. **The iceberg.** The pipeline designs ten times more than the story shows. The writer gets a short, distilled brief. The critics hold the full iceberg.
7. **Real dice.** Randomness comes from code (`config/preferences.yaml` + `seeds/`), never from asking a model to "pick something random".

## Pipeline

| # | Stage | Prompt files | Reads | Writes |
| --- | --- | --- | --- | --- |
| 0 | Dice (code) | — | `config/preferences.yaml`, `seeds/*`, `universals/*`, `library/ledger.jsonl` | `00-roll.yaml` |
| 1 | Director | `01-director/director.md` | roll, mechanism file(s), ledger summary | `01-recipe.md` |
| 2a | Premises | `02-concept/generate-premises.md` | recipe, mechanism file | `02a-premises.md` |
| 2b | Premise judge | `02-concept/judge-premises.md` | recipe, premises, ledger summary | `02b-premise.md` |
| 3a | Dossier | `03-character/dossier.md` | recipe, premise, mechanism file, names bank slice | `03a-dossier-<name>.md` |
| 3b | Interview | `03-character/interview.md` | dossier | `03b-interview-<name>.md` |
| 3c | Lenses ×7 (parallel) | `03-character/lenses/*.md` | dossier, interview, mechanism file | `03c-lens-<lens>.md` |
| 3d | Supporting cast | `03-character/supporting-cast.md`, then 2 lenses each in light mode | recipe, premise, protagonist dossier and interview, names | `03d-cast.md`, `03d-cast-lens-<name>-<lens>.md` |
| 3e | Case conference | `03-character/case-conference.md` | everything from 3a–3d | `03e-characters.md` |
| 4a | Plot skeletons | `04-plot/skeletons.md` + `04-plot/structures/*` | recipe, premise, characters | `04a-skeletons.md` |
| 4b | Skeleton judge | `04-plot/judge-skeletons.md` | recipe, characters, skeletons | `04b-skeleton.md` |
| 4c | Ending | `04-plot/ending.md` | recipe, characters, chosen skeleton | `04c-ending.md` |
| 4d | Scene plan | `04-plot/scene-plan.md` | recipe, characters, chosen skeleton, ending | `04d-scene-plan.md` |
| 4e | Fair-play check | `04-plot/fair-play-check.md` | scene plan, ending | `04e-fair-play.md` (if fixes are needed, 4d reruns once with them) |
| 5 | World | `05-world/world.md` | recipe, characters, scene plan, ending, changed rule | `05-world.md` |
| 6 | Assembler | `06-assembler/build-brief.md` | the whole bible (1–5), exemplars | `06-brief.md` |
| 7 | Writer ×2 | `07-writer/writer-base.md` + brief | brief | `07-draft-a.md`, `07-draft-b.md` |
| 8a | Draft comparison | `08-critique/compare.md` | pitch intent, two drafts (blind, random order) | `08a-chosen.md` |
| 8b | Story critics ×4 (parallel) | `08-critique/{cold-reader,predictor,character-truth,cliche}.md` | see each file | `08b-notes-<critic>.md` (the predictor runs as a conversation, one chapter per turn) |
| 8c | Editor | `08-critique/editor.md` | brief, draft, all notes, round number | `08c-plan.md` |
| 8d | Rewrite | `09-revise/rewrite.md` | writer base, brief, draft, plan, borrow (from the losing draft) | `08d-draft-r<n>.md` |
| — | Loop 8b–8d at most twice. If a gate still fails: back to 4a once, then discard. | | | |
| 9a | Language critics ×3 (parallel) | `08-critique/{level,native-ear,read-aloud}.md` | story (+ palette and vocab report for the level critic) | `09a-notes-<critic>.md` |
| 9b | Language pass | `09-revise/language-pass.md` | story, language notes | `09b-story.md` |
| 9c | French cold re-read | `08-critique/cold-reread.md` | final story only | `09c-reread.md` |
| 9d | Final judge | `08-critique/final-judge.md` | pitch intent, all versions (blind), re-read | `09d-final.md` (if an earlier version wins, it goes through 9a–9c before packaging) |
| 10 | Package | `10-package/*.md` | final story, bible, critic notes | `10-translation.json`, `10-report-card.md`, `10-tts-script.json`, `10-image-prompt.md`, `10-ledger-entry.json` (appended to `library/ledger.jsonl`) |

## How a prompt file is built

Every file in a stage folder is a **system prompt**. Its frontmatter is a contract the runner reads:

```yaml
---
stage: 03c
name: lens-jungian
model: opus            # which model runs it
thinking: true         # extended thinking on or off
inputs: [dossier, interview, mechanism]
output: 03c-lens-jungian.md
---
```

Inside the body:

- `{{include path/to/file.md}}` pastes another file in at that point. Shared files (`_shared/quality-bar.md`, `_shared/banned-defaults.md`, the language and level files) are pulled in this way, so every stage measures against the same bar.
- `{{language}}` and `{{level}}` are replaced by the runner (`fr`, `b1`), and `{{include _shared/languages/{{language}}.md}}` resolves to the right file.
- Inputs are never pasted into the system prompt. The runner sends them in the user message, each wrapped in an XML tag named after the input (`<dossier>…</dossier>`). Each prompt refers to its inputs by those tag names.

Outputs are Markdown with fixed headings, so later stages and the critics can find what they need. When code needs to read a decision (a winner, a score, a pass or fail), the prompt asks for a final fenced `json` block, and that block is the only thing the runner parses.

## Folder map

```
prompts/
  README.md                this file
  _shared/                 included by many stages: quality bar, house style, banned defaults,
                           languages/, levels/, exemplars/, calibration/
  universals/              the mechanism library: one file per universal psychological mechanism
  seeds/                   dice banks: places, roles, life stages, objects, pressures, changed rules,
                           wildcards, names
  01-director/             the showrunner: turns the dice into a recipe
  02-concept/              twelve premises and a judge
  03-character/            dossier, interview, seven lenses, supporting cast, case conference
  04-plot/                 skeletons, structures library, judge, ending, scene plan, fair-play check
  05-world/                places as pressure, palette, mood arc, changed rules
  06-assembler/            writes the writer's bespoke brief
  07-writer/               the fixed writer base
  08-critique/             seven critics, draft comparison, editor, cold re-read, final judge
  09-revise/               story rewrite and language pass
  10-package/              translation, report card, TTS script, image prompt, ledger entry
config/preferences.yaml    every mix, weight and cooldown, editable by hand
```

## Editing rules for this tree

- **Explain the why.** Every rule in a prompt carries its reason. Models generalise from reasons and obey bare rules narrowly.
- **No shouting.** No capitals for emphasis, no "CRITICAL", no "you MUST". Calm instructions are taken seriously; shouting makes the model rigid.
- **Say what to do,** not only what to avoid.
- **Theory stays upstream.** Psychological vocabulary may appear in stages 3 and 4. From the assembler onwards it is translated into behaviour, and none of it reaches the story.
- **A lesson learned once goes in a shared file.** If a story fails because of a habit (say, chapters ending on rhetorical questions), add it to `_shared/banned-defaults.md` or the writer base, so every later story benefits.
