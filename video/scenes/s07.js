// Scene s07: chapter 2, the warm room. One tap, a sock on the spout, buckets in a queue,
// Khadija against the tiles, the memory of the till, then the thin woman scrubbing the round one.
// Shots: title 2 -> tap and sock -> bucket queue -> Khadija by the wall with a phone glow ->
// profile murmur -> night till memory -> plastic bag -> wide scrub -> profile suspicion -> flats.
SCENE({
  draw(ctx, t, dur, B) {
    const K = KIT, C = K.C;
    const PHONE = '#7fb8ff';
    const TILE_WALL = [C.tile, '#8fa6a6', C.tileDark];

    // Muted zellige band as the back wall of the hammam.
    const wall = (c, y1 = 400) => K.zellige(c, -40, 0, K.W + 80, y1, 56, TILE_WALL);

    // A grey washing sock hung over the spout, to filter the water.
    const sock = (c, x, y) => {
      c.save(); c.fillStyle = '#8e949a';
      c.beginPath(); c.roundRect(x - 8, y, 16, 64, 6); c.fill();
      c.beginPath(); c.ellipse(x, y + 66, 10, 8, 0, 0, 7); c.fill();
      c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(x - 8, y, 16, 5);
      c.restore();
    };

    // A translucent plastic bag with a phone lit up inside.
    const bag = (c, x, y, s, t) => {
      c.save(); c.translate(x, y); c.scale(s, s);
      c.fillStyle = 'rgba(200,212,210,0.32)';
      c.beginPath(); c.roundRect(-90, -70, 180, 140, 10); c.fill();
      c.strokeStyle = 'rgba(230,236,232,0.5)'; c.lineWidth = 5;
      c.beginPath(); c.arc(-40, -70, 22, Math.PI, 0); c.stroke();
      c.beginPath(); c.arc(40, -70, 22, Math.PI, 0); c.stroke();
      c.fillStyle = `rgba(127,184,255,${0.6 + 0.4 * Math.sin(t * 3)})`;
      c.beginPath(); c.roundRect(-22, -30, 44, 26, 4); c.fill();
      K.glow(c, 0, -17, 150, PHONE, 0.18);
      c.restore();
    };

    K.shots(ctx, t, dur, [
      // 0: chapter heading "2" over the dark room, fading before the first line.
      [0, (c, lt) => {
        K.sky(c, 'warm');
        K.title(c, '2', K.pulse(lt, 0.2, B(65) - 0.4, 0.6), { size: 200, color: C.plaster });
      }],

      // 1 (B65): one tap running, a sock on the spout, water filling a bucket.
      [B(65), (c, lt, p) => {
        const cam = K.camera(c, p, { x: -30, y: 0, z: 1.0 }, { x: 30, y: -10, z: 1.08 });
        cam.layer(0, c2 => { K.sky(c2, 'hammam'); wall(c2); K.steam(c2, lt, 0.5, 4); });
        cam.layer(1, c2 => {
          K.tileFloor(c2, 470, C.tile);
          K.tap(c2, 640, 180, 2.0, 0.8, lt);
          sock(c2, 700, 186);
          K.bucket(c2, 700, 650, 1.5, '#b8433a', 0.7);
        });
        cam.layer(1.3, c2 => K.particles(c2, lt, { n: 30, color: K.MOODS.hammam.dust, rise: 6 }));
      }],

      // 2 (B65+17): the queue of buckets, red, green, red, yellow.
      [B(65) + 17, (c, lt, p) => {
        const cam = K.camera(c, p, { x: 0, y: 0, z: 1.02 }, { x: -40, y: 0, z: 1.1 });
        cam.layer(0, c2 => { K.dome(c2, lt, '#4a5a58', 7); K.steam(c2, lt, 0.7, 9); });
        cam.layer(1, c2 => {
          K.tileFloor(c2, 430, C.tile);
          [[210, '#b8433a'], [450, '#3f7f5a'], [690, '#b8433a'], [930, '#d9b44a']].forEach(([x, col], i) => {
            K.bucket(c2, x, 600 + (i % 2) * 14, 1.25, col, 0.6);
          });
        });
        cam.layer(1.4, c2 => K.particles(c2, lt, { n: 25, color: K.MOODS.hammam.dust, rise: 5 }));
      }],

      // 3 (B66): Khadija with her back to the tiles, a phone lighting up on a high shelf.
      [B(66), (c, lt, p) => {
        const cam = K.camera(c, p, { x: -20, y: 0, z: 1.0 }, { x: 20, y: 0, z: 1.06 });
        cam.layer(0, c2 => {
          K.sky(c2, 'hammam'); wall(c2);
          c2.fillStyle = '#5a4a40'; c2.fillRect(860, 150, 320, 16);              // shelf
          bag(c2, 1010, 110, 0.85, lt);
        });
        cam.layer(1, c2 => {
          K.tileFloor(c2, 470, C.tile);
          // the blue light from the phone sweeps slowly over the tiles
          const sx = 1010 - 180 + ((lt * 26) % 360);
          K.glow(c2, sx, 560, 200, PHONE, 0.10);
          K.woman(c2, 400, 640, 1.25, { color: '#2a2230', scarf: null, robe: 'towel', towel: '#d8cbb4', width: 1.1, t: lt, earring: true });
        });
        cam.layer(1.4, c2 => K.steam(c2, lt, 0.4, 12));
      }],

      // 4 (B67): profile bust, the murmur about the days left.
      [B(67), (c, lt, p) => {
        const cam = K.camera(c, p, { x: 0, y: 0, z: 1.0 }, { x: 10, y: -6, z: 1.05 });
        cam.layer(0, c2 => { K.sky(c2, 'hammam'); wall(c2, 720); });
        cam.layer(1, c2 => {
          K.profile(c2, 640, 440, 0.95, { color: '#2a2230', scarf: null, rim: C.lamp, earring: true, t: lt, tilt: 0.05 });
        });
        cam.layer(1.3, c2 => K.particles(c2, lt, { n: 20, color: K.MOODS.hammam.dust, rise: 5 }));
      }],

      // 5 (B69): the night-shift memory, the till lit by a bare bulb.
      [B(69), (c, lt, p) => {
        const cam = K.camera(c, p, { x: -40, y: 0, z: 1.0 }, { x: 40, y: 0, z: 1.08 });
        cam.layer(0, c2 => { K.sky(c2, 'night'); K.medina(c2, 420, '#0b0e16', 6, 0.2, lt); });
        cam.layer(1, c2 => {
          K.bulb(c2, 900, 40, lt, 200);
          K.woman(c2, 380, 640, 1.1, { color: '#241d2a', scarf: '#6b3b4f', width: 1.05, t: lt, earring: true });
          K.till(c2, 760, 600, 1.1, '', lt);
          K.coin(c2, 720, 500 + 6 * Math.sin(lt * 1.5), 14, lt, 0);
        });
        cam.layer(1.4, c2 => K.particles(c2, lt, { n: 35, color: K.MOODS.night.dust, rise: 6 }));
      }],

      // 6 (B72): the plastic bag on the bench, the one that is not hers.
      [B(72), (c, lt, p) => {
        const cam = K.camera(c, p, { x: 0, y: 0, z: 1.0 }, { x: 0, y: -10, z: 1.14 });
        cam.layer(0, c2 => { K.sky(c2, 'hammam'); wall(c2, 380); });
        cam.layer(1, c2 => {
          K.tileFloor(c2, 470, C.tile);
          K.bench(c2, 260, 520, 760, C.umber);
          bag(c2, 640, 430, 1.25, lt);
        });
        cam.layer(1.4, c2 => K.steam(c2, lt, 0.3, 21));
      }],

      // 7 (B74): the scrub. The round woman sits, head low; the thin one kneels behind her.
      [B(74), (c, lt, p) => {
        const cam = K.camera(c, p, { x: -30, y: 0, z: 1.0 }, { x: 30, y: -6, z: 1.08 });
        cam.layer(0, c2 => { K.sky(c2, 'warm'); wall(c2, 360); K.steam(c2, lt, 0.9, 5); });
        cam.layer(0.6, c2 => {
          K.woman(c2, 150, 620, 0.7, { color: '#1c2324', robe: 'towel', towel: '#8a6f5a', width: 1.0, pose: 'stand', t: lt, scarf: null });
          K.woman(c2, 1110, 610, 0.72, { color: '#1c2324', robe: 'towel', towel: '#7a8f8c', width: 0.95, pose: 'stand', t: lt, scarf: null });
        });
        cam.layer(1, c2 => {
          K.tileFloor(c2, 470, C.tile);
          K.bucket(c2, 1020, 640, 1.0, '#3f7f8c', 0.4);
          // the thin one: scrubbing mitt raised and drawn down, slowly
          K.woman(c2, 830, 640, 1.0, { color: '#1d2a2c', robe: 'towel', towel: '#9fb4c2', scarf: null, width: 0.8, pose: 'bend', t: lt, arm: 0.45 + 0.3 * Math.sin(lt * 0.5) });
          K.shoePair(c2, 840, 668, 0.55, 'ballet');
          // the round woman, sitting on the tiles with her head bent low
          K.woman(c2, 520, 650, 1.25, { color: '#2b2321', robe: 'towel', towel: '#c9875a', scarf: null, width: 1.45, pose: 'sit', t: lt });
        });
        cam.layer(1.4, c2 => K.particles(c2, lt, { n: 30, color: K.MOODS.warm.dust, rise: 5 }));
      }],

      // 8 (B75): profile, suspicious, the eyes narrowing in the heat.
      [B(75), (c, lt, p) => {
        const cam = K.camera(c, p, { x: 0, y: 0, z: 1.0 }, { x: -10, y: -8, z: 1.08 });
        cam.layer(0, c2 => { K.sky(c2, 'warm'); wall(c2, 720); K.steam(c2, lt, 0.5, 8); });
        cam.layer(1, c2 => {
          K.profile(c2, 620, 440, 0.95, { color: '#2a2230', scarf: null, rim: C.lamp, earring: true, eyes: 'open', t: lt, tilt: -0.04, facing: -1 });
        });
        cam.layer(1.3, c2 => K.particles(c2, lt, { n: 20, color: K.MOODS.warm.dust, rise: 5 }));
      }],

      // 9 (B77): the other hand. Close on the thin woman's ballet flats with gold buckles.
      [B(77), (c, lt, p) => {
        const cam = K.camera(c, p, { x: 0, y: 0, z: 1.0 }, { x: 0, y: -20, z: 1.12 });
        cam.layer(0, c2 => { K.sky(c2, 'warm'); wall(c2, 380); K.steam(c2, lt, 0.6, 14); });
        cam.layer(1, c2 => {
          K.tileFloor(c2, 430, C.tile);
          K.shoePair(c2, 540, 500, 2.4, 'ballet', { color: '#141414' });
        });
        cam.layer(1.3, c2 => K.particles(c2, lt, { n: 20, color: K.MOODS.warm.dust, rise: 4 }));
      }],
    ]);

    K.finish(ctx, t);
    K.fadeEdges(ctx, t, dur, 0.6, 0.6);
  },
});
