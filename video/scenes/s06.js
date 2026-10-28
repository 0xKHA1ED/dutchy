// Scene s06: at the door of the warm room. The bucket woman calls out, Khadija
// ignores her, the round woman walks ahead with the thin one behind, Khadija
// squeezes her coin and takes the bench. Ends on the meter outside, 43 minutes left.
// Shots: warm-room door -> bucket close-up -> Khadija profile -> feet on the tiles
// -> procession into the warm room -> bench and fist -> meter through the door.
SCENE({
  draw(ctx, t, dur, B) {
    const K = KIT, C = K.C;

    K.shots(ctx, t, dur, [
      // Shot 1 (B56 - B58): wide on the door of the warm room, the bucket woman
      // standing guard beside a blue bucket, the glow of the room behind her.
      [0, (c, lt, p) => {
        const cam = K.camera(c, p, { x: -30, y: 0, z: 1.0 }, { x: 24, y: -6, z: 1.07 });
        cam.layer(0, c2 => {
          K.sky(c2, 'hammam');
          K.glow(c2, 700, 260, 380, C.lamp, 0.25);
        });
        cam.layer(0.4, c2 => {
          // the doorway to the warm room: lit through the arch, steam rolling out
          K.arch(c2, 430, 600, 420, 520, '#1b2a2c');
          c2.save();
          K.archPath(c2, 430, 600, 420, 520); c2.clip();
          K.glow(c2, 640, 420, 240, C.lamp, 0.55);
          K.steam(c2, lt, 0.6, 9);
          c2.restore();
        });
        cam.layer(1, c2 => {
          K.tileFloor(c2, 600, C.tile, 'rgba(0,0,0,0.18)', lt);
          K.woman(c2, 300, 620, 1.25, { color: '#221c1a', scarf: '#7a2f2a', width: 1.05, t: lt });
          K.bucket(c2, 200, 650, 1.1, '#3f7f8c', 0.6);
        });
        cam.layer(1.3, c2 => K.particles(c2, lt, { n: 36, color: K.MOODS.hammam.dust, rise: 6 }));
      }],

      // Shot 2 (B58 - B62): close-up of the bucket with its crack mended with tape.
      // Khadija looks only at it; the bucket is what she refuses to look past.
      [B(58), (c, lt, p) => {
        const cam = K.camera(c, p, { x: 0, y: 0, z: 1.0 }, { x: -10, y: -24, z: 1.12 });
        cam.layer(0, c2 => { K.sky(c2, 'hammam'); K.glow(c2, 640, 240, 420, C.lamp, 0.22); });
        cam.layer(1, c2 => {
          K.tileFloor(c2, 520, C.tile, 'rgba(0,0,0,0.18)', lt);
          K.bucket(c2, 640, 640, 3.2, '#3f7f8c', 0.6);
          // crack on the side, mended with a strip of tape
          c2.save();
          c2.strokeStyle = 'rgba(10,20,25,0.7)'; c2.lineWidth = 2;
          c2.beginPath(); c2.moveTo(738, 466); c2.lineTo(746, 484); c2.lineTo(741, 500); c2.stroke();
          c2.translate(748, 478); c2.rotate(-0.35);
          c2.fillStyle = 'rgba(225,215,185,0.85)'; c2.fillRect(-26, -7, 52, 14);
          c2.restore();
        });
        cam.layer(1.2, c2 => {
          K.steam(c2, lt, 0.35, 5);
          K.particles(c2, lt, { n: 26, color: K.MOODS.hammam.dust, rise: 5 });
        });
      }],

      // Shot 3 (B62 - feet): the floor, Khadija's black velcro sandals in the
      // foreground and the thin one's gold-buckled ballet flats moving ahead.
      [B(62), (c, lt, p) => {
        K.sky(c, 'hammam');
        K.glow(c, 640, 180, 360, C.lamp, 0.18);
        K.tileFloor(c, 380, C.tile, 'rgba(0,0,0,0.22)', lt);
        K.shoePair(c, 880, 470, 1.25, 'ballet', { color: '#1a1614' });
        K.shoePair(c, 420, 600, 1.7, 'sandal', { color: '#151414' });
        K.steam(c, lt, 0.4, 2);
        K.particles(c, lt, { n: 24, color: K.MOODS.hammam.dust, rise: 4 });
      }],

      // Shot 4 (B62 + 8.5): the procession into the warm room. Dome above, the
      // round woman in front, the thin one with the bag, Khadija behind them.
      [B(62) + 8.5, (c, lt, p) => {
        const cam = K.camera(c, p, { x: -50, y: 0, z: 1.0 }, { x: 40, y: 0, z: 1.06 });
        cam.layer(0, c2 => {
          K.dome(c2, lt, '#5a4a40', 7);
          K.glow(c2, 640, 200, 500, C.lamp, 0.22);
        });
        cam.layer(0.5, c2 => K.steam(c2, lt, 0.7, 4));
        cam.layer(1, c2 => {
          K.tileFloor(c2, 470, C.tile, 'rgba(0,0,0,0.18)', lt);
          K.woman(c2, 840, 610, 1.1, { color: '#2b2321', width: 1.45, robe: 'towel', towel: '#c9875a', scarf: null, pose: 'walk', t: lt });
          K.woman(c2, 670, 610, 0.95, { color: '#1d2a2c', width: 0.8, robe: 'towel', towel: '#9fb4c2', scarf: null, pose: 'walk', t: lt });
          K.bundle(c2, 700, 560, 0.5, '#5b6b70');
          K.woman(c2, 500, 610, 0.95, { color: '#2a2230', robe: 'towel', towel: '#d8cbb4', scarf: null, pose: 'walk', t: lt });
        });
        cam.layer(1.3, c2 => K.particles(c2, lt, { n: 36, color: K.MOODS.warm.dust, rise: 6 }));
      }],

      // Shot 5 (B62 + 17): Khadija on the bench in the warm room, a coin held in her
      // fist, the earring catching the light. Long, quiet hold.
      [B(62) + 17, (c, lt, p) => {
        const cam = K.camera(c, p, { x: 0, y: 0, z: 1.0 }, { x: 30, y: -10, z: 1.08 });
        cam.layer(0, c2 => {
          K.sky(c2, 'warm');
          K.glow(c2, 640, 180, 380, C.lamp, 0.3);
        });
        cam.layer(0.5, c2 => K.steam(c2, lt, 0.35, 8));
        cam.layer(1, c2 => {
          K.tileFloor(c2, 560, C.tile, 'rgba(0,0,0,0.18)', lt);
          K.bench(c2, 330, 520, 480, C.umber);
          K.woman(c2, 560, 520, 1.15, { color: '#2a2230', pose: 'sit', robe: 'towel', towel: '#d8cbb4', scarf: null, earring: true, t: lt, width: 1 });
          K.hand(c2, 800, 548, 0.8, '#8a5a3c', 0.3);
          K.coin(c2, 800, 506, 16, lt, 0);
        });
        cam.layer(1.3, c2 => K.particles(c2, lt, { n: 28, color: K.MOODS.warm.dust, rise: 5 }));
      }],

      // Shot 6 (B63): the street seen through the outer door, drained and cold.
      // The meter stands in the alley with the Fiat. Forty-three minutes still left.
      [B(63), (c, lt, p) => {
        const cam = K.camera(c, p, { x: -20, y: 0, z: 1.0 }, { x: 20, y: -4, z: 1.04 });
        // dark wall first, then the street clipped to the arched doorway
        c.fillStyle = '#0b1012'; c.fillRect(-K.W, -K.H, K.W * 3, K.H * 3);
        c.save();
        K.archPath(c, 190, 720, 560, 620); c.clip();
        cam.layer(0, c2 => {
          K.sky(c2, 'cold');
          K.glow(c2, 900, 200, 320, '#cfe3e6', 0.25);
          K.medina(c2, 470, '#2b3a40', 6, 0.15, lt);
        });
        cam.layer(1, c2 => {
          K.car(c2, 360, 610, 0.8, '#e6e2d8', lt);
          K.parkingMeter(c2, 620, 640, 1.1, '', true);
        });
        cam.layer(1.3, c2 => K.particles(c2, lt, { n: 30, color: K.MOODS.cold.dust, rise: 5 }));
        c.restore();
      }],
    ]);

    K.finish(ctx, t);
    K.fadeEdges(ctx, t, dur, 0.6, 0.6);
  },
});
