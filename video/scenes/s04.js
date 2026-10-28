// Scene 4: chapter 1, the cold room. Khadija undresses in the mirror, walks through
// the cold room, quietly fixes a wobbling stool, watches a thin woman with a brown bag.
// Shots: mirror bust -> cold room wide -> stool close-up -> clock over the door ->
// the pair of women -> the bag on the bench -> close-up of the bag.
SCENE({
  draw(ctx, t, dur, B) {
    const K = KIT, C = K.C;

    // A round white kitchen clock inside a plastic bag. Second hand ticks once a second.
    const clockBag = (c, x, y, r, tt) => {
      c.save();
      c.fillStyle = 'rgba(225,238,242,0.22)';
      c.beginPath(); c.roundRect(x - r * 1.3, y - r * 1.25, r * 2.6, r * 2.9, 16); c.fill();
      c.fillStyle = '#f4f4ee'; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
      c.strokeStyle = '#2a2a2a'; c.lineWidth = 3;
      for (let i = 0; i < 12; i++) {
        const a = i * Math.PI / 6;
        c.beginPath(); c.moveTo(x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8);
        c.lineTo(x + Math.cos(a) * r * 0.92, y + Math.sin(a) * r * 0.92); c.stroke();
      }
      const hand = (ang, len, w) => {
        c.lineWidth = w; c.beginPath(); c.moveTo(x, y);
        c.lineTo(x + Math.sin(ang) * len, y - Math.cos(ang) * len); c.stroke();
      };
      hand(0.6 + tt * 0.004, r * 0.5, 5);                       // hour hand
      hand(1.2 + tt * 0.05, r * 0.82, 3);                       // minute hand
      c.strokeStyle = C.red; hand(Math.floor(tt) * Math.PI / 30, r * 0.88, 1.5); // second hand
      c.fillStyle = '#2a2a2a'; c.beginPath(); c.arc(x, y, 5, 0, 7); c.fill();
      c.restore();
    };

    // A low kitchen stool. `tilt` rocks it on the floor; the short leg is on the right.
    const stool = (c, x, y, s, tilt) => {
      c.save(); c.translate(x, y); c.rotate(tilt); c.scale(s, s);
      c.fillStyle = '#5a3d2b';
      c.beginPath(); c.roundRect(-60, -110, 120, 22, 6); c.fill();
      c.fillRect(-52, -90, 10, 90);            // long left leg
      c.fillRect(40, -70, 10, 70);             // short right leg
      c.restore();
    };

    // Shot 1 (0 s): Khadija in the changing room, a small mirror high on the tiles.
    // Her profile, head bowed slightly, nods to herself (segments 34-36).
    const shot1 = (c, lt, p) => {
      const cam = K.camera(c, p, { x: -30, y: 0, z: 1 }, { x: 30, y: -10, z: 1.1 });
      cam.layer(0, c2 => { K.sky(c2, 'hammam'); K.glow(c2, 640, 160, 340, '#f3ead6', 0.3); });
      cam.layer(0.4, c2 => {
        c2.fillStyle = '#3d5558'; c2.fillRect(-K.W, 0, K.W * 3, K.H);
        c2.strokeStyle = 'rgba(0,0,0,0.12)'; c2.lineWidth = 2;
        for (let r = 0; r < 9; r++) for (let q = -6; q < 14; q++) c2.strokeRect(q * 80 + (r % 2) * 40, r * 60, 80, 60);
      });
      cam.layer(0.7, c2 => {
        K.cut(c2, '#6b5a40', pth => pth.roundRect(556, 76, 168, 228, 14), 6);   // the small mirror frame
        c2.fillStyle = '#b9cdd0'; c2.beginPath(); c2.roundRect(572, 92, 136, 196, 8); c2.fill();
        K.glow(c2, 640, 170, 110, '#ffffff', 0.25);
      });
      cam.layer(1, c2 => K.profile(c2, 600, 580, 0.74, {
        color: '#2a2230', scarf: null, earring: true, rim: C.lamp, t: lt, tilt: 0.12,
      }));
      cam.layer(1.4, c2 => K.particles(c2, lt, { n: 26, color: K.MOODS.hammam.dust, rise: 5 }));
      K.steam(c, lt, 0.35, 5);
    };

    // Shot 2 (B37, 15 s): the cold room. Dome with skylight holes, buckets, women walking.
    // Khadija crosses the room through the middle, then sits against the wall.
    const shot2 = (c, lt, p) => {
      const cam = K.camera(c, p, { x: -90, y: 0, z: 1 }, { x: 50, y: -6, z: 1.12 });
      cam.layer(0, c2 => K.dome(c2, lt, '#3e5452', 9));
      cam.layer(0.5, c2 => {
        K.tileFloor(c2, 430, '#6f8b8f', 'rgba(0,0,0,0.18)', lt);
        [[300, 530, 160, 60], [700, 600, 200, 70], [1010, 520, 140, 52]]
          .forEach(([x, y, rx, ry]) => K.lightPool(c2, x, y, rx, ry, 0.28, '#fff6dc'));
      });
      cam.layer(1, c2 => {
        K.bucket(c2, 240, 640, 1.15, '#3f7f8c', 0.5);
        K.bucket(c2, 1040, 660, 1.2, '#3f7f8c', 0);
        K.woman(c2, 470, 640, 0.82, { color: '#1c2324', robe: 'towel', towel: '#7d6b5a', scarf: null, width: 1.0, pose: 'walk', t: lt + 0.4, facing: -1 });
        K.woman(c2, 860, 600, 0.7, { color: '#1c2324', robe: 'towel', towel: '#8a9a8a', scarf: '#4a3a3a', width: 0.9, pose: 'walk', t: lt, facing: -1 });
        K.woman(c2, 1060, 600, 0.62, { color: '#1c2324', robe: 'towel', towel: '#9a7a6a', scarf: null, width: 0.95, pose: 'bend', t: lt * 0.5 });
        // Khadija: walks through the middle, then sits with her back to the tiles.
        const walking = p < 0.5;
        const kx = walking ? K.lerp(150, 600, K.ease(p * 2)) : 600;
        K.woman(c2, kx, 660, 1.0, {
          color: '#2a2230', robe: 'towel', towel: '#d8cbb4', scarf: null, width: 1.1,
          earring: true, pose: walking ? 'walk' : 'sit', t: lt,
        });
      });
      cam.layer(1.5, c2 => K.particles(c2, lt, { n: 45, color: K.MOODS.hammam.dust, rise: 10 }));
      K.steam(c, lt, 0.5, 11);
    };

    // Shot 3 (B38, 40 s): close on the wobbling stool. A woman sits on it, rocking it.
    // Khadija's hand folds the soap wrapper and slides it under the short leg.
    const shot3 = (c, lt, p) => {
      const k = K.clamp(lt / Math.max(0.1, B.end(38) - B(38)));
      const amp = 0.035 * (1 - K.ramp(k, 0.55, 0.8));          // wobble until the leg is fixed
      const tilt = Math.sin(lt * 9) * amp;
      const cam = K.camera(c, p, { x: 0, y: 0, z: 1.25 }, { x: -30, y: 20, z: 1.4 });
      cam.layer(0, c2 => { K.sky(c2, 'hammam'); K.tileFloor(c2, 340, '#6f8b8f', 'rgba(0,0,0,0.15)', lt); });
      cam.layer(1, c2 => {
        K.woman(c2, 560, 452, 1.0, { color: '#1c2324', robe: 'towel', towel: '#8a6a5a', scarf: '#5a3a3a', width: 1.2, pose: 'sit', t: lt });
        stool(c2, 560, 560, 1.0, tilt);
        // the soap wrapper, folded in four, slides under the short leg
        const wx = K.lerp(640, 610, K.ramp(k, 0.35, 0.5));
        K.paper(c2, wx, 592, 0.42, 2, '#c8d6dc', 0.1);
        K.hand(c2, 700 - 90 * K.ramp(k, 0.1, 0.35), 640 - 40 * K.ramp(k, 0.1, 0.35), 0.45, '#3a2a2a', -0.6);
      });
      cam.layer(1.4, c2 => K.particles(c2, lt, { n: 22, color: K.MOODS.hammam.dust, rise: 4 }));
    };

    // Shot 4 (B39, 63 s): the white clock in its plastic bag above the door. Khadija,
    // head down, knows the time without looking up.
    const shot4 = (c, lt, p) => {
      const cam = K.camera(c, p, { x: 0, y: 0, z: 1 }, { x: 30, y: -16, z: 1.12 });
      cam.layer(0, c2 => { K.sky(c2, 'hammam'); K.glow(c2, 900, 200, 300, '#f3ead6', 0.25); });
      cam.layer(0.5, c2 => {
        c2.fillStyle = '#b9c4bf'; c2.fillRect(-K.W, 0, K.W * 3, 470);
        K.door(c2, 860, 600, 170, 300, 0, '#4a2e20');
      });
      cam.layer(0.8, c2 => clockBag(c2, 930, 230, 62, lt + 9 * 60 + 20));
      cam.layer(1, c2 => K.profile(c2, 250, 500, 0.5, {
        color: '#2a2230', scarf: '#6b3b4f', earring: true, rim: C.lamp, t: lt, tilt: 0.5,
      }));
      cam.layer(1.4, c2 => K.particles(c2, lt, { n: 18, color: K.MOODS.hammam.dust, rise: 5 }));
    };

    // Shot 5 (B40, 80 s): the pair. A thin woman in ballet flats with gold buckles,
    // and a round woman seen from behind, towel on her shoulders.
    const shot5 = (c, lt, p) => {
      const cam = K.camera(c, p, { x: -20, y: 0, z: 1 }, { x: 20, y: 0, z: 1.08 });
      cam.layer(0, c2 => { K.sky(c2, 'hammam'); K.glow(c2, 640, 180, 300, '#f3ead6', 0.2); });
      cam.layer(0.6, c2 => {
        c2.fillStyle = '#3d5558'; c2.fillRect(-K.W, 0, K.W * 3, 470);
        K.bench(c2, 80, 520, 1120, '#5a3d2b');
      });
      cam.layer(1, c2 => {
        K.tileFloor(c2, 560, '#6f8b8f', 'rgba(0,0,0,0.12)', lt);
        K.woman(c2, 470, 640, 1.0, { color: '#1d2a2c', robe: 'towel', towel: '#9fb4c2', scarf: null, width: 0.8, t: lt, arm: 0.35 });
        K.shoePair(c2, 432, 650, 0.6, 'ballet');
        K.woman(c2, 800, 640, 1.1, { color: '#2b2321', robe: 'towel', towel: '#c9875a', scarf: null, width: 1.45, t: lt });
      });
      cam.layer(1.4, c2 => K.particles(c2, lt, { n: 30, color: K.MOODS.hammam.dust, rise: 6 }));
      K.steam(c, lt, 0.3, 17);
    };

    // Shot 6 (B41, 85 s): the thin woman follows the round one from bench to bench,
    // a small brown bag shut inside a knotted plastic bag, never opened.
    const shot6 = (c, lt, p) => {
      const rx = K.lerp(380, 820, K.ease(p));           // round woman, walking away
      const tx = rx - 230;                               // thin woman, a step behind
      const cam = K.camera(c, p, { x: -40, y: 0, z: 1 }, { x: 40, y: 0, z: 1.1 });
      cam.layer(0, c2 => { K.sky(c2, 'hammam'); K.glow(c2, 640, 170, 300, '#f3ead6', 0.2); });
      cam.layer(0.6, c2 => {
        c2.fillStyle = '#3d5558'; c2.fillRect(-K.W, 0, K.W * 3, 470);
        K.bench(c2, 60, 500, 360, '#5a3d2b');
        K.bench(c2, 820, 500, 380, '#5a3d2b');
      });
      cam.layer(1, c2 => {
        K.tileFloor(c2, 580, '#6f8b8f', 'rgba(0,0,0,0.12)', lt);
        K.woman(c2, rx, 650, 1.1, { color: '#2b2321', robe: 'towel', towel: '#c9875a', scarf: null, width: 1.45, pose: 'walk', t: lt });
        K.woman(c2, tx, 640, 0.95, { color: '#1d2a2c', robe: 'towel', towel: '#9fb4c2', scarf: null, width: 0.8, pose: 'walk', t: lt, arm: 0.25 });
        // the brown bag in its knotted plastic, carried at her hip
        const bx = tx + 36, by = 530;
        K.cut(c2, '#5a3d2b', pth => pth.roundRect(bx - 26, by - 18, 52, 38, 6), 3);
        c2.fillStyle = 'rgba(230,240,245,0.3)'; c2.beginPath(); c2.ellipse(bx + 28, by - 20, 9, 6, 0.4, 0, 7); c2.fill();
      });
      cam.layer(1.4, c2 => K.particles(c2, lt, { n: 24, color: K.MOODS.hammam.dust, rise: 6 }));
    };

    // Shot 7 (B42, 98 s): close on the bag, held the way you hold eggs. Fades out.
    const shot7 = (c, lt, p) => {
      const cam = K.camera(c, p, { x: 0, y: 0, z: 1.15 }, { x: 0, y: -20, z: 1.3 });
      cam.layer(0, c2 => { K.sky(c2, 'hammam'); K.glow(c2, 640, 220, 300, '#f3ead6', 0.25); });
      cam.layer(1, c2 => {
        c2.save(); c2.translate(640, 330);                                          // centre the close-up
        K.cut(c2, '#5a3d2b', pth => pth.roundRect(-150, -110, 300, 200, 26), 10);   // the bag
        c2.fillStyle = 'rgba(230,240,245,0.22)'; c2.beginPath(); c2.roundRect(-165, -125, 330, 230, 30); c2.fill();
        c2.fillStyle = '#5a3d2b'; c2.beginPath(); c2.ellipse(0, -118, 26, 16, 0, 0, 7); c2.fill();   // knot
        K.hand(c2, -190, 40, 0.9, '#3a2a2a', 0.5);
        K.hand(c2, 190, 40, 0.9, '#3a2a2a', -0.5);
        c2.restore();
      });
      cam.layer(1.4, c2 => K.particles(c2, lt, { n: 14, color: K.MOODS.hammam.dust, rise: 4 }));
    };

    K.shots(ctx, t, dur, [
      [0,       shot1],
      [B(37),   shot2],
      [B(38),   shot3],
      [B(39),   shot4],
      [B(40),   shot5],
      [B(41),   shot6],
      [B(42),   shot7],
    ]);
    K.finish(ctx, t);
    K.fadeEdges(ctx, t, dur, 0.6, 0.6);
  },
});
