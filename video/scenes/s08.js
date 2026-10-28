// Scene s08: chapter 2 (warm room). The thin woman scrubs the round woman's back
// while Khadija reads the bathers like a cashier reads shoes. Khadija names the
// thin woman a pickpocket, the round woman a boat, and then says she sees more
// than she should. Shots: the scrubbing pair from behind -> feet and buckle
// close-ups -> Khadija's profile and her verdicts in the notebook -> the arm
// going up -> tap, bucket, steam -> Khadija's last line over her coin.
SCENE({
  draw(ctx, t, dur, B) {
    const K = KIT, C = K.C;

    // Figures used across shots. Everyone in the bathing rooms is a dark towel
    // silhouette seen from behind or in profile: no faces, no anatomy.
    const thin = (c, lt, arm = 0, x = 520, y = 575, s = 1.25) =>
      K.woman(c, x, y, s, { color: '#1d2a2c', scarf: null, width: 0.8, robe: 'towel', towel: '#9fb4c2', t: lt, arm });
    const round = (c, lt, x = 790, y = 575, s = 1.35) =>
      K.woman(c, x, y, s, { color: '#2b2321', width: 1.45, robe: 'towel', towel: '#c9875a', scarf: null, t: lt });

    // Arm rising from 0 to 1 over a span of the narration (the sleeve push).
    const rise = (lt, a, b) => K.ease((lt - a) / (b - a));

    // Shot 1 [0]: wide hammam, the scrubber and the round woman's back.
    K.shots(ctx, t, dur, [
      [0, (c, lt, p) => {
        const cam = K.camera(c, p, { x: -50, y: 0, z: 1.0 }, { x: 40, y: -6, z: 1.08 });
        cam.layer(0, c2 => { K.sky(c2, 'hammam'); K.lightPool(c2, 640, 90, 520, 260, 0.14); });
        cam.layer(0.4, c2 => { for (let i = 0; i < 4; i++) K.bench(c2, 80 + i * 300, 500 - (i % 2) * 14, 170, '#3d2d26'); });
        cam.layer(1, c2 => {
          K.tileFloor(c2, 470, C.tile, 'rgba(0,0,0,0.18)', lt);
          thin(c2, lt, 0.25 + 0.12 * Math.sin(lt * 0.9));
          round(c2, lt, 790, 585, 1.35);
        });
        cam.layer(1.4, c2 => K.steam(c2, lt, 0.7, 11));
        cam.layer(1.6, c2 => K.particles(c2, lt, { n: 26, color: K.MOODS.hammam.dust, rise: 6 }));
      }],

      // Shot 2 [B(79)]: the feet. Ballet flats with gold buckles on wet tile.
      [B(79), (c, lt, p) => {
        K.sky(c, 'hammam');
        K.tileFloor(c, 260, C.tile, 'rgba(0,0,0,0.22)', lt);
        K.lightPool(c, 360, 240, 380, 160, 0.16);
        K.shoePair(c, 330, 500, 2.1, 'ballet', { color: '#151414' });
        K.shoePair(c, 880, 520, 1.4, 'ballet', { color: '#2a2622' });
        K.steam(c, lt, 0.35, 21);
        K.particles(c, lt, { n: 22, color: K.MOODS.hammam.dust, rise: 5 });
      }],

      // Shot 3 [B(80)]: Khadija in profile, her verdict about the shoes on the cardboard.
      [B(80), (c, lt, p) => {
        K.sky(c, 'warm');
        K.bulb(c, 1020, 150, lt, 170, C.lamp);
        K.cut(c, '#8a6444', k => { k.beginPath(); k.rect(830, 470, 330, 110); }, 6);
        K.shoePair(c, 880, 460, 1.2, 'ballet', { color: '#151414' });
        K.profile(c, 420 + p * 20, 390, 1.1, { scarf: '#6b3b4f', earring: true, rim: C.lamp, t: lt, tilt: 0.08 });
        K.particles(c, lt, { n: 24, color: K.MOODS.warm.dust, rise: 5 });
      }],

      // Shot 4 [B(82)]: "Trente-neuf. Comme un bateau." The notebook takes the number.
      [B(82), (c, lt, p) => {
        K.sky(c, 'warm');
        K.bulb(c, 640, 80, lt, 120, C.lamp);
        K.notebook(c, 640, 380, 1.5, 6, lt, K.ramp(lt, 0.8, 2.0));
        K.hand(c, 980, 560, 0.7, '#8a5a3c', -0.2);
        K.coin(c, 340, 560, 20, lt, 1.5);
        K.particles(c, lt, { n: 18, color: K.MOODS.warm.dust, rise: 4 });
      }],

      // Shot 5 [B(83)]: the thin woman pushes her invisible sleeves up, one, two.
      [B(83), (c, lt, p) => {
        K.sky(c, 'hammam');
        const cam = K.camera(c, p, { x: 60, y: 0, z: 1.1 }, { x: -20, y: 0, z: 1.25 });
        cam.layer(0, c2 => K.dome(c2, lt, '#3e5452', 7));
        cam.layer(1, c2 => {
          K.tileFloor(c2, 430, C.tile, 'rgba(0,0,0,0.18)', lt);
          thin(c2, lt, 0.1 + 0.8 * rise(lt, 1.0, 4.5), 500, 575, 1.35);
          round(c2, lt, 820, 585, 1.4);
        });
        cam.layer(1.4, c2 => K.steam(c2, lt, 0.5, 5));
      }],

      // Shot 6 [B(85)]: the tap climbs, and a bucket leaves with Souad.
      [B(85), (c, lt, p) => {
        K.sky(c, 'hammam');
        K.tileFloor(c, 380, C.tile, 'rgba(0,0,0,0.18)', lt);
        const flow = 0.5 + 0.5 * K.ramp(lt, 0, 3);
        K.tap(c, 230, 420, 1.7, flow, lt);
        // water stream under the spout, brighter than the kit's so it reads on pale tile
        c.fillStyle = `rgba(235,248,255,${0.85 * flow})`; c.fillRect(291, 440, 8 * flow, 120);
        K.bucket(c, 430 + 40 * p, 575, 1.3, '#3f7f8c', 0.6);
        K.woman(c, 700 + 500 * p, 575, 1.25, { color: '#221c1a', scarf: '#7a2f2a', width: 1.05, robe: 'towel', towel: '#7a5a48', pose: 'walk', t: lt });
        K.steam(c, lt, 0.6, 9);
        K.particles(c, lt, { n: 20, color: K.MOODS.hammam.dust, rise: 6 });
      }],

      // Shot 7 [B(88)]: hot-room tension. Deep shadows, steam, the scrubbing goes on.
      [B(88), (c, lt, p) => {
        K.sky(c, 'warm');
        const cam = K.camera(c, p, { x: 0, y: 0, z: 1.0 }, { x: -30, y: -8, z: 1.12 });
        cam.layer(0.3, c2 => {
          c2.fillStyle = 'rgba(20,10,8,0.6)'; c2.fillRect(-K.W, 0, 3 * K.W, K.H);
          [[180, 510, 0.7], [1080, 520, 0.75]].forEach(([x, y, s]) =>
            K.woman(c2, x, y, s, { color: '#1c2324', width: 1.0, robe: 'towel', towel: '#6b5a4a', t: lt }));
        });
        cam.layer(1, c2 => {
          K.tileFloor(c2, 470, '#5a4a40', 'rgba(0,0,0,0.25)', lt);
          thin(c2, lt, 0.4 + 0.25 * Math.sin(lt * 1.3), 560, 575, 1.3);
          round(c2, lt, 780, 585, 1.45);
        });
        cam.layer(1.4, c2 => K.steam(c2, lt, 1.0, 3));
      }],

      // Shot 8 [B(89)]: the gold buckles. Venga.
      [B(89), (c, lt, p) => {
        K.sky(c, 'warm');
        K.tileFloor(c, 340, '#4f4038', 'rgba(0,0,0,0.25)', lt);
        K.shoePair(c, 560, 470, 3.0, 'ballet', { color: '#151414' });
        K.glow(c, 560, 420, 340, C.gold, 0.18);
        K.particles(c, lt, { n: 14, color: K.MOODS.warm.dust, rise: 3 });
      }],

      // Shot 9 [B(91)]: "Je suis pas payée aujourd'hui." Thin woman bent to the scrub.
      [B(91), (c, lt, p) => {
        K.sky(c, 'hammam');
        const cam = K.camera(c, p, { x: -40, y: 0, z: 1.05 }, { x: 40, y: 0, z: 1.15 });
        cam.layer(0, c2 => K.lightPool(c2, 640, 120, 500, 240, 0.12));
        cam.layer(1, c2 => {
          K.tileFloor(c2, 460, C.tile, 'rgba(0,0,0,0.18)', lt);
          thin(c2, lt, 0.7 + 0.3 * Math.sin(lt * 2.0), 520, 575, 1.35);
          round(c2, lt, 800, 585, 1.42);
        });
        cam.layer(1.4, c2 => K.steam(c2, lt, 0.55, 17));
      }],

      // Shot 10 [B(94)]: Khadija's last line. The notebook writes, the coin stays in her fist.
      [B(94), (c, lt, p) => {
        K.sky(c, 'warm');
        K.bulb(c, 1000, 120, lt, 160, C.lamp);
        K.notebook(c, 420, 400, 1.2, 6, lt, 0.4 + 0.6 * K.ramp(lt, 1, 6));
        K.profile(c, 900, 420, 0.9, { scarf: '#6b3b4f', earring: true, rim: C.lamp, t: lt, tilt: -0.04, facing: -1 });
        K.coin(c, 880, 580, 16, lt, 0.8);
        K.particles(c, lt, { n: 20, color: K.MOODS.warm.dust, rise: 4 });
      }],
    ]);

    K.finish(ctx, t);
    K.fadeEdges(ctx, t, dur, 0.6, 0.6);
  },
});
