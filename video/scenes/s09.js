// s09: chapter 2, the warm room. Fatiha scrubs Dija, Khadija keeps her distance,
// the bucket woman presses the earrings, Khadija pays the 2-dirham coin and leaves.
SCENE({ draw(ctx, t, dur, B) { const K = KIT, C = K.C;

  // Warm-room background: lamplit haze over a wet tiled floor.
  const room = (c, lt, seed, floorY = 500) => {
    K.sky(c, 'warm');
    K.lightPool(c, 640, 90, 520, 300, 0.22, '#ffd9a0');
    K.tileFloor(c, floorY, C.tile, 'rgba(0,0,0,0.18)', lt);
    K.steam(c, lt, 0.5, seed);
  };
  // Khadija's earring as a gold hoop, turned by her thumb (sx squashes it).
  const hoop = (c, x, y, r, sx) => {
    c.save(); c.translate(x, y); c.scale(Math.max(0.06, sx), 1);
    c.strokeStyle = C.gold; c.lineWidth = r * 0.2;
    c.beginPath(); c.arc(0, 0, r, 0, 7); c.stroke(); c.restore();
    K.glow(c, x, y, r * 2.4, C.goldHi, 0.35);
  };

  K.shots(ctx, t, dur, [
    // Shot 1, from B(95): Fatiha's mitt on Dija's back, seen from behind.
    [0, (c, lt, p) => {
      room(c, lt, 4);
      const cam = K.camera(c, p, { x: -20, y: 0, z: 1.0 }, { x: 20, y: -10, z: 1.12 });
      cam.layer(0.6, k => {
        K.woman(k, 300, 520, 0.7, { color: '#1c2324', scarf: '#5a3a3a', width: 1, robe: 'towel', towel: '#9a8f7a', t: lt });
      });
      cam.layer(1, k => {
        K.woman(k, 560, 600, 1.15, { color: '#1d2a2c', width: 0.8, robe: 'towel', towel: '#9fb4c2', scarf: null, arm: 0.9, t: lt });
        K.shoePair(k, 520, 606, 0.9, 'ballet');
        K.woman(k, 820, 600, 1.2, { color: '#2b2321', width: 1.45, robe: 'towel', towel: '#c9875a', scarf: null, arm: 0.1, t: lt });
      });
    }],

    // Shot 2, from B(101): the whole room laughs under the dome; the tap runs.
    [B(101), (c, lt, p) => {
      K.dome(c, lt, '#3e5452', 9);
      K.steam(c, lt, 0.7, 11);
      const cam = K.camera(c, p, { x: 0, y: 0, z: 1 }, { x: 0, y: -20, z: 1.08 });
      cam.layer(0.5, k => {
        K.woman(k, 360, 560, 0.55, { color: '#1c2324', width: 1, robe: 'towel', towel: '#7a4a4a', scarf: null, t: lt });
        K.woman(k, 1040, 560, 0.6, { color: '#1c2324', scarf: '#3a2a3a', width: 1.1, robe: 'towel', towel: '#8a7a6a', t: lt });
      });
      cam.layer(1, k => {
        K.tap(k, 190, 460, 1.4, 0.7, lt);
        K.woman(k, 300, 600, 0.85, { color: '#1c2324', scarf: '#4a3a3a', robe: 'towel', towel: '#9a7a6a', arm: 0.2, t: lt });
        K.bucket(k, 470, 620, 1.2, '#3f7f8c', 1);
        K.woman(k, 760, 590, 1.1, { color: '#2b2321', width: 1.45, robe: 'towel', towel: '#c9875a', scarf: null, arm: 0.5 + 0.2 * Math.sin(lt * 2), t: lt });
      });
    }],

    // Shot 3, from B(102): Khadija's profile, the detective's dryness.
    [B(102), (c, lt, p) => {
      K.sky(c, 'warm');
      K.lightPool(c, 900, 200, 520, 320, 0.2, '#ffd9a0');
      K.steam(c, lt, 0.8, 21);
      const cam = K.camera(c, p, { x: -30, y: 0, z: 1 }, { x: 20, y: -20, z: 1.12 });
      cam.layer(1, k => K.profile(k, 600, 420, 1.15, { color: '#2a2230', scarf: '#6b3b4f', earring: true, rim: C.lamp, t: lt, tilt: 0 }));
    }],

    // Shot 4, from B(108): Khadija alone on the bench, not joining in.
    [B(108), (c, lt, p) => {
      room(c, lt, 31, 480);
      const cam = K.camera(c, p, { x: 0, y: 0, z: 1.0 }, { x: -30, y: 0, z: 1.1 });
      cam.layer(0.5, k => {
        K.woman(k, 1080, 500, 0.6, { color: '#1c2324', width: 1, robe: 'towel', towel: '#7a6a5a', scarf: null, t: lt });
        K.woman(k, 180, 490, 0.55, { color: '#1c2324', scarf: '#3a2a3a', width: 1.1, robe: 'towel', towel: '#8a7a6a', t: lt });
      });
      cam.layer(1, k => {
        K.bench(k, 430, 540, 420);
        K.woman(k, 640, 540, 1.25, { color: '#2a2230', scarf: null, robe: 'towel', towel: '#d8cbb4', pose: 'sit', width: 1.1, t: lt });
      });
    }],

    // Shot 5, from B(109): the bucket and the tap, a neighbour filling a bowl.
    [B(109), (c, lt, p) => {
      room(c, lt, 41, 470);
      const cam = K.camera(c, p, { x: -60, y: 0, z: 1 }, { x: 40, y: -20, z: 1.15 });
      cam.layer(1, k => {
        K.tap(k, 260, 380, 1.5, 0.8, lt);
        K.bucket(k, 560, 600, 1.5, '#3f7f8c', 1);
        K.woman(k, 980, 560, 0.9, { color: '#1c2324', scarf: '#4a3a3a', width: 1, robe: 'towel', towel: '#9a7a6a', facing: -1, t: lt });
      });
    }],

    // Shot 6, from B(112): the blue bucket comes back and stops at her knees.
    [B(112), (c, lt, p) => {
      room(c, lt, 51, 500);
      const sx = K.lerp(1000, 740, K.ease(lt / 5));
      const cam = K.camera(c, p, { x: 20, y: 0, z: 1 }, { x: -20, y: 0, z: 1.12 });
      cam.layer(1, k => {
        K.bench(k, 330, 540, 380);
        K.woman(k, 480, 540, 1.25, { color: '#2a2230', scarf: null, robe: 'towel', towel: '#d8cbb4', pose: 'sit', width: 1.1, t: lt });
        K.bucket(k, sx - 70, 610, 0.9, '#3f7f8c', 1);
        K.woman(k, sx, 600, 1.15, { color: '#221c1a', scarf: '#7a2f2a', width: 1.05, facing: -1, arm: 0.3, t: lt });
      });
    }],

    // Shot 7, from B(115): a close profile; the mitt is about to catch the earring.
    [B(115), (c, lt, p) => {
      K.sky(c, 'warm');
      K.lightPool(c, 300, 150, 420, 320, 0.22, '#ffd9a0');
      K.steam(c, lt, 0.7, 61);
      const cam = K.camera(c, p, { x: 0, y: 0, z: 1 }, { x: -10, y: -10, z: 1.14 });
      cam.layer(1, k => K.profile(k, 640, 520, 1.4, { color: '#2a2230', scarf: '#6b3b4f', earring: true, rim: C.lamp, t: lt, tilt: 0.02 }));
    }],

    // Shot 8, from B(119): the left earring turned by her thumb, a gold hoop in the dark.
    [B(119), (c, lt, p) => {
      c.fillStyle = '#1a1210'; c.fillRect(-1280, -720, 3840, 2160);
      K.glow(c, 640, 330, 420, C.lamp, 0.25);
      const cam = K.camera(c, p, { x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: 1.2 });
      cam.layer(1, k => hoop(k, 640, 330, 80, Math.abs(Math.cos(lt * 0.9)) + 0.05));
    }],

    // Shot 9, from B(122): the lost-and-found nail, single earrings on a string.
    [B(122), (c, lt, p) => {
      c.fillStyle = '#1a1412'; c.fillRect(-1280, -720, 3840, 2160);
      K.lightPool(c, 640, 260, 480, 300, 0.12, '#ffd59a');
      const cam = K.camera(c, p, { x: 0, y: -10, z: 1 }, { x: 0, y: 10, z: 1.08 });
      cam.layer(1, k => {
        k.fillStyle = '#2b2320'; k.fillRect(200, 120, 880, 420);
        k.fillStyle = '#8a8580'; k.beginPath(); k.arc(640, 170, 6, 0, 7); k.fill();
        const q = u => (1 - u) * (1 - u) * 200 + 2 * (1 - u) * u * 240 + u * u * 200;
        k.strokeStyle = 'rgba(230,220,200,0.5)'; k.lineWidth = 2; k.beginPath();
        k.moveTo(320, 200); k.quadraticCurveTo(640, 280, 960, 200); k.stroke();
        for (let i = 0; i < 7; i++) {
          const u = i / 6, x = 320 + 640 * u, y = q(u);
          const drop = 40 + ((i * 37) % 50), sw = Math.sin(lt * 0.6 + i) * 3;
          k.strokeStyle = 'rgba(230,220,200,0.4)'; k.lineWidth = 1.5;
          k.beginPath(); k.moveTo(x, y); k.lineTo(x + sw, y + drop); k.stroke();
          hoop(k, x + sw, y + drop + 6, 9, 1);
        }
      });
    }],

    // Shot 10, from B(123): the fist opens; the two-dirham coin travels to the palm,
    // her eyes on the plastic bag by the thin woman's shoes.
    [B(123), (c, lt, p) => {
      room(c, lt, 71, 500);
      const mv = K.ease(K.clamp((lt - 3) / 5));
      const cam = K.camera(c, p, { x: 0, y: 0, z: 1 }, { x: -30, y: -10, z: 1.12 });
      cam.layer(1, k => {
        k.fillStyle = 'rgba(225,232,236,0.35)';
        k.beginPath(); k.roundRect(960, 560, 130, 70, 14); k.fill();
        k.strokeStyle = 'rgba(225,232,236,0.4)'; k.lineWidth = 3;
        k.beginPath(); k.arc(1000, 560, 16, Math.PI, 0); k.stroke();
        K.shoePair(k, 1010, 612, 0.9, "ballet");
        // Khadija's arm and fist from the bottom left.
        k.fillStyle = '#2a2230'; k.fillRect(390, 520, 60, 200);
        K.hand(k, 420, 440, 0.9, '#2a2230', 0.3);
        // Fatiha's palm, rising from the bottom right.
        k.fillStyle = '#1d2a2c'; k.fillRect(770, 520, 60, 200);
        K.hand(k, 800, 440, 0.9, '#1d2a2c', -0.2);
        const cx = K.lerp(420, 790, mv), cy = K.lerp(420, 400, mv) - Math.sin(mv * Math.PI) * 40;
        K.coin(k, cx, cy, 18, lt, 0);
      });
    }],

    // Shot 11, from B(125): the long hold. Khadija on the bench, the room pulling away,
    // steam drifting through the dark.
    [B(125), (c, lt, p) => {
      K.dome(c, lt, '#2a3634', 5);
      K.steam(c, lt, 0.9, 81);
      const cam = K.camera(c, p, { x: 0, y: 0, z: 1.12 }, { x: 0, y: -10, z: 1.0 });
      cam.layer(0.5, k => {
        K.woman(k, 1040, 520, 0.6, { color: '#1c2324', width: 1, robe: 'towel', towel: '#6a5a4a', scarf: null, t: lt });
      });
      cam.layer(1, k => {
        K.bench(k, 300, 540, 340);
        K.woman(k, 420, 540, 0.95, { color: '#2a2230', scarf: null, robe: 'towel', towel: '#d8cbb4', pose: 'sit', width: 1.1, t: lt });
      });
    }],
  ]);
  K.finish(ctx, t);
  K.fadeEdges(ctx, t, dur, 0.6, 0.6);
} });
