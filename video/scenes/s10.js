// Scene s10: chapter 2, the warm room. The coin goes, the scrubbing starts,
// a memory of fourteen, the count, the tap, the walk to the hot room, the hip.
// Shots: warm room with the hand to a scarf -> bucket woman -> mitt on the back
// -> memory in night light -> profile counting, round woman stands with the bag
// -> the tap, bag and walk -> Khadija stands -> empty bench, a profile.
SCENE({
  draw(ctx, t, dur, B) {
    const K = KIT, C = K.C, { lerp, ramp } = K;
    const ss = (a, b) => ramp(t, a, b);

    // Warm room backdrop: glowing sky, arched wall, wet tiles, drifting steam.
    const warmRoom = (d, lt, tone = 'warm') => {
      K.sky(d, tone);
      K.glow(d, 640, 140, 520, C.lamp, 0.32);
      K.archWall(d, '#3b2820', [[40, 470, 260, 380], [500, 470, 280, 420], [960, 470, 280, 380]], 0, 480);
      K.tileFloor(d, 470, '#8a6250', 'rgba(0,0,0,0.2)', lt);
      K.steam(d, lt, 0.45, 11);
    };
    // A plastic shopping bag held by its handles (local centre at x, y).
    const bag = (d, x, y, s = 1) => {
      d.save(); d.translate(x, y); d.scale(s, s);
      K.cut(d, 'rgba(225,232,228,0.82)', c => { c.beginPath(); c.roundRect(-40, -30, 80, 70, 10); }, 3);
      d.strokeStyle = 'rgba(255,255,255,0.55)'; d.lineWidth = 3;
      d.beginPath(); d.arc(0, -30, 22, Math.PI, 0); d.stroke();
      d.restore();
    };
    // The hot-room doorway: a dark arch with heat glowing inside.
    const hotArch = (d, lt) => {
      K.arch(d, 1000, 640, 240, 420, '#24130d');
      K.glow(d, 1120, 420, 170, C.amber, 0.35);
      K.steam(d, lt, 0.9, 21);
    };

    K.shots(ctx, t, dur, [
      // Shot 1 (from 0): the hand rises past Khadija's line to a scarf knot, comes back empty.
      [0, (c, lt, p) => {
        const cm = K.camera(c, p, { x: -20, y: 0, z: 1 }, { x: 30, y: -4, z: 1.05 });
        cm.layer(0, d => warmRoom(d, lt));
        cm.layer(1, d => {
          K.woman(d, 430, 620, 1.1, { color: '#2a2230', robe: 'towel', towel: '#d8cbb4', scarf: null, width: 1.1, t: lt, earring: true });
          K.woman(d, 760, 620, 0.95, { color: '#1d2a2c', robe: 'towel', towel: '#9fb4c2', scarf: null, width: 0.8, t: lt, arm: 0.5 });
          K.woman(d, 1010, 640, 1.05, { color: '#3a302c', scarf: '#8f3a33', width: 1.05, t: lt });
          const k = ss(0.5, 5.5) * (1 - ss(6, 9.8));          // up, then back down empty
          K.hand(d, lerp(790, 990, k), lerp(470, 395, k), 0.42, '#0c0c0f', 0);
        });
        cm.layer(1.4, d => K.particles(d, lt, { n: 30, color: K.MOODS.warm.dust, rise: 8 }));
      }],

      // Shot 2 (B127): the bucket woman, plain and steady. Her bucket leaves on B130.
      [B(127), (c, lt, p) => {
        const cm = K.camera(c, p, { x: 0, y: 0, z: 1 }, { x: -40, y: 0, z: 1.08 });
        cm.layer(0, d => warmRoom(d, lt));
        cm.layer(1, d => {
          const bx = lerp(470, 1400, ss(B(130), B(130) + 3));
          K.bucket(d, bx, 660, 1.1, '#3f7f8c', 0.7);
          K.woman(d, 640, 630, 1.25, { color: '#221c1a', scarf: '#7a2f2a', width: 1.05, t: lt, robe: 'towel', towel: '#b9a58a' });
        });
        cm.layer(1.4, d => K.particles(d, lt, { n: 26, color: K.MOODS.warm.dust, rise: 8 }));
      }],

      // Shot 3 (B131): slow close on the back of the heavyset woman, the mitt going down.
      [B(131), (c, lt, p) => {
        const cm = K.camera(c, p, { x: 0, y: 0, z: 1 }, { x: 0, y: -20, z: 1.12 });
        cm.layer(0, d => warmRoom(d, lt));
        cm.layer(1, d => {
          K.woman(d, 330, 640, 1.4, { color: '#1d2a2c', width: 0.8, robe: 'towel', towel: '#9fb4c2', scarf: null, t: lt, arm: 0.6 });
          K.woman(d, 760, 640, 1.5, { color: '#2b2321', width: 1.45, robe: 'towel', towel: '#c9875a', scarf: null, pose: 'sit', t: lt });
          const q = ss(B(131), B.end(131));                    // slower than before
          K.hand(d, 770, lerp(430, 600, q), 0.5, '#0c0c0f', Math.PI);
        });
      }],

      // Shot 4 (B132): memory in night light. Wet tiles, a bulb, a finger writing letters
      // on a girl's back. Fades out unfinished.
      [B(132), (c, lt, p) => {
        const fade = 1 - ss(B.end(132) - 2.5, B.end(132));
        const cm = K.camera(c, p, { x: 20, y: 0, z: 1 }, { x: -20, y: 0, z: 1.06 });
        cm.layer(0, d => {
          K.sky(d, 'night');
          K.bulb(d, 900, 40, lt, 150);
          K.glow(d, 900, 110, 300, '#ffcf8a', 0.3);
          K.tileFloor(d, 480, '#3d5558', 'rgba(0,0,0,0.25)', lt);
        });
        cm.layer(1, d => {
          K.woman(d, 330, 610, 1.2, { color: '#1c2324', robe: 'towel', towel: '#c9a77c', scarf: null, width: 1.0, t: lt, arm: 0.7 });
          K.woman(d, 560, 620, 0.85, { color: '#2a2230', robe: 'towel', towel: '#efe2c8', scarf: null, width: 0.7, t: lt, pose: 'sit' });
          // letters traced on the back, one stroke after another
          const show = ss(B(132) + 1, B.end(132) - 2);
          const n = Math.floor(60 * show);
          d.strokeStyle = `rgba(255,236,190,${fade})`; d.lineWidth = 3.5; d.shadowColor = 'rgba(255,210,140,0.9)'; d.shadowBlur = 10; d.beginPath();
          for (let m = 0; m <= n; m++) {
            const x = 520 + m * 3.2, y = 520 + Math.sin(m * 0.7) * 16 + Math.sin(m * 0.23) * 8;
            m ? d.lineTo(x, y) : d.moveTo(x, y);
          }
          d.stroke();
          if (n > 0) { // the finger tip
            const m = n, fx = 520 + m * 3.2, fy = 520 + Math.sin(m * 0.7) * 16 + Math.sin(m * 0.23) * 8;
            d.fillStyle = `rgba(255,240,210,${0.9 * fade})`; d.beginPath(); d.arc(fx, fy, 4, 0, 7); d.fill();
          }
        });
        cm.layer(1.4, d => K.particles(d, lt, { n: 22, color: 'rgba(255,210,150,0.3)', rise: 6 }));
        if (fade < 1) { c.fillStyle = `rgba(0,0,0,${1 - fade})`; c.fillRect(0, 0, K.W, K.H); }
      }],

      // Shot 5 (B133): Khadija in profile, counting. The heavyset woman stands on B136
      // and holds the bag out behind her.
      [B(133), (c, lt, p) => {
        const cm = K.camera(c, p, { x: -10, y: 0, z: 1 }, { x: 20, y: 0, z: 1.1 });
        cm.layer(0, d => warmRoom(d, lt));
        cm.layer(1, d => {
          K.profile(d, 380, 330, 1.0, { color: '#2a2230', scarf: null, earring: true, rim: C.lamp, t: lt, tilt: 0.05 });
          const stand = ss(B(136), B(136) + 2);
          d.save(); d.globalAlpha = 1 - stand;
          K.woman(d, 960, 640, 1.45, { color: '#2b2321', width: 1.45, robe: 'towel', towel: '#c9875a', scarf: null, pose: 'sit', t: lt });
          d.restore();
          d.save(); d.globalAlpha = stand;
          K.woman(d, 960, 640, 1.45, { color: '#2b2321', width: 1.45, robe: 'towel', towel: '#c9875a', scarf: null, t: lt });
          d.restore();
          const hold = ss(B(136) + 1, B(136) + 5);
          bag(d, lerp(950, 780, hold), lerp(560, 600, hold), 1.0 * stand);
        });
        cm.layer(1.4, d => K.particles(d, lt, { n: 24, color: K.MOODS.warm.dust, rise: 8 }));
      }],

      // Shot 6 (B137): the bag changes hands, the tap runs, the bucket fills,
      // the two women walk towards the hot room.
      [B(137), (c, lt, p) => {
        const cm = K.camera(c, p, { x: 0, y: 0, z: 1 }, { x: -30, y: 0, z: 1.06 });
        cm.layer(0, d => warmRoom(d, lt));
        cm.layer(1, d => {
          K.tap(d, 150, 420, 1.2, ss(B(139), B(139) + 2), lt);
          K.bucket(d, 160, 660, 1.1, '#3f7f8c', ss(B(139) + 2, B(139) + 12));
          bench(d);
          K.woman(d, 430, 556, 1.1, { color: '#2a2230', robe: 'towel', towel: '#d8cbb4', scarf: null, width: 1.05, pose: 'sit', t: lt, earring: true });
          const walk = ss(B(139) + 3, B(139) + 14);
          const fx = lerp(560, 960, walk), dx = lerp(780, 1040, walk);
          K.woman(d, fx, 640, 0.95, { color: '#1d2a2c', robe: 'towel', towel: '#9fb4c2', scarf: null, width: 0.8, pose: 'walk', t: lt, arm: 0.3 });
          bag(d, fx + 10, 540, 0.6);
          K.woman(d, dx, 640, 1.2, { color: '#2b2321', width: 1.45, robe: 'towel', towel: '#c9875a', scarf: null, pose: 'walk', t: lt });
        });
        cm.layer(0.6, d => hotArch(d, lt));
        cm.layer(1.4, d => K.particles(d, lt, { n: 24, color: K.MOODS.warm.dust, rise: 8 }));
      }],

      // Shot 7 (after the walk): Khadija alone on the bench, stands up, a hand to her hip.
      [B(139) + 15, (c, lt, p) => {
        const cm = K.camera(c, p, { x: -40, y: 0, z: 1.02 }, { x: 20, y: 0, z: 1.08 });
        cm.layer(0, d => warmRoom(d, lt));
        cm.layer(1, d => {
          bench(d);
          const stand = ss(B(139) + 17, B(139) + 21);
          d.save(); d.globalAlpha = 1 - stand;
          K.woman(d, 430, 556, 1.1, { color: '#2a2230', robe: 'towel', towel: '#d8cbb4', scarf: null, width: 1.05, pose: 'sit', t: lt, earring: true });
          d.restore();
          d.save(); d.globalAlpha = stand;
          K.woman(d, 430, 610, 1.1, { color: '#2a2230', robe: 'towel', towel: '#d8cbb4', scarf: null, width: 1.05, t: lt, earring: true, arm: -0.4 * stand });
          d.restore();
        });
        cm.layer(0.6, d => hotArch(d, lt));
      }],

      // Shot 8 (B140): a quiet hold on Khadija in profile, eyes closed, the bench behind.
      [B(140), (c, lt, p) => {
        const cm = K.camera(c, p, { x: 0, y: 0, z: 1 }, { x: 0, y: -10, z: 1.05 });
        cm.layer(0, d => warmRoom(d, lt));
        cm.layer(1, d => {
          K.profile(d, 640, 320, 1.0, { color: '#2a2230', scarf: null, earring: true, rim: C.lamp, t: lt, eyes: 'closed' });
        });
        cm.layer(1.4, d => K.particles(d, lt, { n: 18, color: K.MOODS.warm.dust, rise: 5 }));
      }],
    ]);

    K.finish(ctx, t);
    K.fadeEdges(ctx, t, dur, 0.6, 0.6);

    // Bench drawn in the warm room, used by several shots above.
    function bench(d) { K.bench(d, 300, 560, 330, C.umber); }
  },
});
