---
stage: 03d
name: supporting-cast
model: opus
thinking: true
inputs: [recipe, premise, mechanism, dossier, interview, names]
output: 03d-cast.md
---

You are casting the people around a protagonist. The protagonist already exists in full: a factual dossier and an interview in their own words. Your job is to design the one to three other people the story needs, and to make each of them a person with their own life, not a function.

## What you receive

- `<recipe>` and `<premise>`: the story's recipe (with the pitch intent) and its chosen premise.
- `<mechanism>`: the universal mechanism the story is built on.
- `<dossier>` and `<interview>`: the protagonist.
- `<names>`: name lists for the story's region. Choose every name from these lists, fitting age and background.

## Why the cast is designed around the mechanism

Most mechanisms need another person to run on. Projection needs a screen. Mimetic desire needs a model. A scapegoat needs a group. The protector that harms needs someone to be protected from. So each supporting character has a **role in the protagonist's mechanism**, chosen from these (a character can hold two):

- **The screen:** the person the protagonist projects onto. The best screen is innocent of what they are accused of, or guilty of something else entirely.
- **The model or rival:** the person whose desire the protagonist copies, or competes with.
- **The mirror:** someone running the same mechanism in a different costume, which the protagonist can see clearly in them and never in themselves.
- **The pendulum's voice:** the person who speaks for the group, job, family role or cause that feeds on the protagonist.
- **The witness:** someone who sees the protagonist clearly. Often a minor character with one line that lands.
- **The catalyst:** someone whose arrival starts the pressure.

## The test every supporting character must pass

**They want something for themselves that has nothing to do with the protagonist.** A screen who exists only to be projected on is a cardboard figure, and the listener feels it. Ines, in the story of Gérard the driving examiner, wants to finally drive without fear. That want is hers, and it is what makes her more than a device.

Each must also be specific: an age, a job, a way of speaking, one physical detail, one habit, and one thing that would surprise the protagonist about them.

## How many

As few as the premise allows. At B1, a story of a few chapters can hold one protagonist and one to three other people with real depth. Background figures (a colleague with one line, a waiter) do not need to be designed here; the writer can invent them.

## Output

Write in English. For each supporting character:

```
## <name>, <age>

**Role in the mechanism:** <one or two of the roles above, and how exactly>
**Their own want:** <one sentence, independent of the protagonist>
**Short dossier:** <250 to 450 words of facts in the same style as the protagonist's dossier: who they are, one formative scene in brief, work, home, one habit, one secret, their history with the protagonist if any>
**How they speak:** <two or three sentences, with one or two sample lines in English>
**What would surprise the protagonist about them:** <one sentence>
**Lenses to run:** <the two lenses from: core-dramatic, jungian, lacanian, transurfing, ifs, defences-attachment, existential, that would most illuminate this person's role in the story, and why in one line>
```

After the characters:

```
## The cast as a system
<One paragraph: how these people press on each other. Who needs whom to stay the same? Where are the alliances, rivalries and blind spots? Where is the conflict that does not need a villain?>
```

End with a JSON block the runner reads to schedule the light-mode lenses:

```json
{"cast": [{"name": "<name>", "lenses": ["<lens>", "<lens>"]}]}
```
