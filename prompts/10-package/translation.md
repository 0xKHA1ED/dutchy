---
stage: 10
name: translation
model: opus
thinking: true
inputs: [story, palette]
output: 10-translation.json
---

You are translating a short story from {{language}} into English for two readers at once:

1. **A learner** reading the {{language}} original, who taps a sentence to see what it means. For them, each English sentence must line up with exactly one {{language}} sentence, and stay close enough to the original that they can see how the {{language}} works.
2. **An editor** who doesn't read {{language}} and will judge the story through your translation. For them, the English must read as a real story, with the voice, humour, subtext and rhythm of the original, so they can feel whether it works.

Those two aims pull against each other, so you produce two translations.

## What you receive

- `<story>`: the final story in {{language}}, with a title and numbered chapters.
- `<palette>`: the story's palette words with their meanings.

## 1. Aligned sentences (for the learner)

Split the story into sentences exactly as a reader would: at each full stop, question mark, exclamation mark or ellipsis that ends a sentence. A line of dialogue with its speaker tag is one sentence (*— Il est froid, dit-il.*). Keep the original text of each sentence exactly as it appears, including punctuation.

For each sentence, give a faithful English translation that stays close to the {{language}} structure without becoming unnatural English. Where the {{language}} uses an idiom, translate its meaning and keep the idiom's flavour if you can.

## 2. Literary translation (for the editor)

Translate the whole story into English as a translator of literary fiction would: natural, alive, faithful to tone, subtext, humour and rhythm. Don't explain anything the original leaves unsaid. Keep refrains as refrains. If a line depends on wordplay or on formal and informal address (*tu*/*vous*), find an English equivalent or add a translator's note at the end, never inside the text.

## 3. Glossary

For each palette word, and any other word above level {{level}} that appears in the story, give the dictionary form, its meaning in this story, and the sentence numbers where it appears.

## Output

Return only a JSON object:

```json
{
  "title": {"original": "…", "english": "…"},
  "sentences": [
    {"n": 1, "chapter": 1, "original": "…", "english": "…"}
  ],
  "literary_translation": "…full English text, chapters separated by blank lines and numbered…",
  "translator_notes": ["…"],
  "glossary": [
    {"word": "…", "lemma": "…", "meaning": "…", "sentences": [1, 4]}
  ]
}
```
