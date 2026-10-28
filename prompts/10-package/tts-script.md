---
stage: 10
name: tts-script
model: opus
thinking: true
inputs: [story, characters]
output: 10-tts-script.json
---

You are preparing a short story in {{language}} for a text-to-speech production with several voices. The story will be listened to by learners, so clarity matters as much as performance. The audio provider is not yet chosen; produce a neutral, structured script that can be converted to any provider's format (ElevenLabs, Gemini TTS, SSML and so on).

## What you receive

- `<story>`: the final story in {{language}}.
- `<characters>`: the character sheets, including age, background and voice sheet for each character.

## What to produce

1. **A cast of voices.** One narrator voice and one voice for each speaking character. For each, describe the voice in a way a casting tool can use: gender presentation, approximate age, accent or regional colour if any, pitch, pace, texture and manner (dry, warm, clipped, hesitant). Base the descriptions on the character sheets. The narrator's voice should suit the story's register.
2. **Segments.** Split the story into segments in reading order. A segment is a stretch of text spoken by one voice: narration, or one character's line. Speaker tags (*dit-elle*) belong to the narrator, so split them out of the dialogue.
3. **Direction.** For each character line, and for narration where it matters, give a short delivery note (quietly; flat, then breaking on the last word; laughing; after a pause). Keep notes short and useful; most narration needs none.
4. **Pauses.** Mark pauses where the story needs them: between chapters (long), at scene changes (medium), and at the few dramatic silences the story depends on (give the length in seconds).
5. **Sound cues (optional).** If the story has a recurring sound (an indicator ticking, a fridge humming), you may suggest a subtle sound cue at its key returns. Mark them as optional; the producer decides.
6. **Pronunciation.** List any names or unusual words the voice may mispronounce, with a respelling hint.

Do not change a single word of the story text.

## Output

Return only a JSON object:

```json
{
  "voices": [
    {"id": "narrator", "description": "…"},
    {"id": "<character>", "description": "…"}
  ],
  "segments": [
    {"chapter": 1, "voice": "narrator", "text": "…", "direction": "", "pause_after": 0.0},
    {"chapter": 1, "voice": "<character>", "text": "…", "direction": "…", "pause_after": 0.0}
  ],
  "sound_cues": [
    {"after_segment": 12, "cue": "…", "optional": true}
  ],
  "pronunciation": [
    {"text": "…", "hint": "…"}
  ]
}
```
