# Animator guide: "La Paire" story video

You animate ONE scene (1-2 minutes) of a 27-minute narrated story video. Many
animators work in parallel on other scenes, so stick to the shared look below.
The narration audio and English subtitles are added later; you only make pictures.

## The story in brief

Fès, Morocco, present day, a weekday morning. Khadija, 63, a night-shift supermarket
cashier three weeks from retirement, parks her old Fiat at Bab Boujloud with exactly
one hour on the meter and goes to a women's hammam on a gift voucher. Dry, funny,
she plays detective: she decides a thin woman is a pickpocket working the bathhouse.
Through the cold, warm and hot rooms the comedy turns: the thin woman is scrubbing a
round woman who has Khadija's name, her shoe size, her hip, her laugh, the life she
refused. Khadija leaves before that woman turns round, chooses the parking ticket over
the truth, and pays anyway. Comic turning bitter. Never sentimental.

## Art style: paper-cut silhouettes in lamplight

Flat layered shapes (like cut paper or shadow theatre), soft gradients, steam, dust in
light, film grain, letterbox bars. No faces with features; people are silhouettes.
Gold is the rare accent colour (buckles, coins, earrings) and should feel precious.
Everything is drawn with `KIT` (video/kit/kit.js) on a 1280x720 canvas.
READ kit.js FIRST: it is the whole toolbox, with a comment on every helper.

Taste rules:
- Calm, slow, beautiful. Slow camera drift (`KIT.camera`) on every shot. Nothing jitters.
- Change shot every 8-20 seconds, on narration beats, with `KIT.shots` (crossfades).
  Mix wide establishing shots, medium shots of figures, and close-ups of objects
  (coins, shoes, notebook, bucket, tap, earrings) or a `KIT.profile` bust for inner moments.
- Show what the line is about, literally and simply: a coin when coins are counted,
  shoes when shoes are described, the notebook when she remembers.
- Memories and the cashier's night job (the till, 3 a.m.) use the 'night' mood with a
  `KIT.bulb` or till glow, so they read as flashbacks.
- Text on screen: only the chapter numbers (scene that contains a chapter heading
  segment), and at most a word or two that is literally written in the story (a meter
  screen "fin 11 h 20", "Bon pour un gommage"). Never put subtitles or dialogue on screen;
  the bottom 120 px will carry subtitles, so keep key objects above y=580.
- Bathhouse decency: women are dark silhouettes wrapped in towels (`robe: 'towel'`), no
  anatomy, no skin detail. Sexuality is never shown.
- Always end draw() with `KIT.finish(ctx, t)` then `KIT.fadeEdges(ctx, t, dur, 0.6, 0.6)`
  so scenes join smoothly. Scene s01 fades in from black for longer (it opens the film).

## Character bible (use these exactly so people match across scenes)

| who | how to draw |
| --- | --- |
| Khadija (heroine, 63) | `woman(...,{color:'#2a2230', scarf:'#6b3b4f', width:1.1, earring:true})`; profile: `{scarf:'#6b3b4f', earring:true}`. In the bathing rooms: `robe:'towel', scarf:null, towel:'#d8cbb4'`. She often turns her left earring with her thumb, and keeps a 2-dirham coin in her fist. |
| The thin woman (Fatiha, the scrubber) | `woman(...,{color:'#1d2a2c', scarf:'#2f5e63', width:0.8})`, in the rooms `robe:'towel', towel:'#9fb4c2', scarf:null`. She wears a black scrubbing mitt (just raise her arm). Her black ballet flats have gold buckles (`shoePair(..., 'ballet')`). |
| The round woman (Dija, being scrubbed) | `woman(...,{color:'#2b2321', width:1.45, robe:'towel', towel:'#c9875a', scarf:null})`. Loud, warm, laughing. Seen mostly from BEHIND: her face is never shown. |
| Souad (attendant with the bucket) | `woman(...,{color:'#221c1a', scarf:'#7a2f2a', width:1.05})` with a blue `bucket`. |
| Background women | `color:'#1c2324'`, mixed widths, towels in muted colours. Keep them small and few. |
| Naïma (only in memory: gave the voucher) | not shown; show the voucher `paper` instead. |

Props: Khadija's black velcro pharmacy sandals = `shoePair(...,'sandal')`. The old Fiat =
`car(..., '#c9b48a')`; red petits taxis = `taxi`. Nescafé jar of coins = `jar`.
The cashier's notebook of unpaid 2-dirham debts = `notebook`. Lost-and-found nail with
single earrings: draw with `coin`-sized gold dots on a string.

## Moods by chapter

- Chapter 1: street at Bab Boujloud = 'day' (morning, pale blue and warm sand). Inside the
  entrance and changing room = 'hammam' with `tileFloor`, `bench`, `slipper`s, `bundle`s.
- Chapter 2 (warm room): 'warm' and 'hammam', `dome` ceilings, `steam`, `tap`, `bucket`s.
- Chapter 3 (hot room): thick `steam(ctx,t,1)`, darker, 'warm' with deep shadows; tension.
- Chapter 4 (leaving, the alley, the car, the ticket): 'cold' then 'day' drained of warmth.
  The ending is quiet and bitter; slow, sparse shots, long holds.

## Scene file contract

Write `video/scenes/sNN.js` (your scene number) containing exactly one call:

```js
SCENE({
  draw(ctx, t, dur, B) {
    // t = seconds since the scene started, dur = scene length.
    // B(id) = when narration segment `id` starts (seconds into this scene), B.end(id) when it ends.
    const K = KIT;
    K.shots(ctx, t, dur, [
      [0,      (c, lt, p) => { /* shot 1: lt = seconds into shot, p = 0..1 progress */ }],
      [B(14),  (c, lt, p) => { /* shot 2 starts when segment 14 is spoken */ }],
    ]);
    K.finish(ctx, t);
    K.fadeEdges(ctx, t, dur, 0.6, 0.6);
  },
});
```

- draw() must be a pure function of t: no state between frames, no Math.random (use
  `KIT.rng(seed)`), no timers, no DOM, no images or fonts to load.
- Use only B(id) for ids listed in YOUR brief. Never hard-code seconds for story beats.
- Keep it fast: under ~15 ms per frame. Avoid huge loops and per-pixel work.
- Inside a shot, use the `c` argument as the context. Use `K.camera(c, p, from, to)` and
  `cam.layer(depth, fn)` for parallax.
- You may add small local helper functions inside your file. Do NOT edit kit.js or other
  scenes.
- Worked examples: `video/scenes/_example_shots.js` (shots, dome, profile, shoes, till) and `video/scenes/s01.js` (camera parallax, timed beats).

## Check your work

From `/home/user/dutchy/video/render`:

```
node render.js ../scenes/sNN.js ../build/2026-10-27-001/timing/sNN.json /tmp/claude-0/sNN.jpg --stills 9
```

It prints ERRORS if your scene throws. Open the jpg with the Read tool and look at it
critically: is every shot readable, on-model, beautiful, with nothing clipped or broken?
Fix and re-check. Two or three rounds is normal; stop when it looks good. When done,
reply with one line per shot: start beat, what it shows.
