// Scene s11: chapter 3, the hot room. Steam, the marble slab with its hollow,
// the drip on the slipper, the towel on the tiles, the bag handed back, the
// earring turned, and the round woman lowered onto the marble.
// Shots: hot room wide -> marble close -> dome drip -> steam and towel ->
// towel on tiles -> bag handover -> profile -> lowering.
SCENE({
  draw(ctx, t, dur, B) {
    const K = KIT;

    // Warm hot-room backdrop with a darkening veil (tension, deep shadows).
    const hotBase = (c, dim) => {
      K.sky(c, 'warm');
      c.fillStyle = `rgba(6,3,2,${dim})`; c.fillRect(-640, -360, 2560, 1440);
    };
    // Haze over the upper frame; sharp near the bottom (the tiles by her feet).
    const haze = (c, y0, y1, a) => {
      const g = c.createLinearGradient(0, y0, 0, y1);
      g.addColorStop(0, `rgba(236,222,200,${a})`); g.addColorStop(1, 'rgba(236,222,200,0)');
      c.fillStyle = g; c.fillRect(-640, -360, 2560, 1440);
    };
    // Canvas-drawn bag (the one she hands back and forth).
    const bag = (c, x, y, s = 1, sway = 0) => {
      c.save(); c.translate(x, y); c.rotate(sway); c.scale(s, s);
      c.strokeStyle = '#1a1412'; c.lineWidth = 6; c.beginPath(); c.arc(0, -36, 22, Math.PI, 0); c.stroke();
      K.cut(c, '#3d5f66', k => { k.beginPath(); k.roundRect(-46, -34, 92, 78, 10); }, 4);
      c.restore();
    };
    // A towel lying flat on the tiles.
    const towelOnFloor = (c, x, y, s = 1, color = '#d8cbb4') => {
      c.save(); c.translate(x, y); c.scale(s, s);
      c.fillStyle = 'rgba(0,0,0,0.25)'; c.beginPath(); c.ellipse(4, 6, 170, 22, 0.04, 0, 7); c.fill();
      c.fillStyle = color; c.beginPath(); c.ellipse(0, 0, 170, 24, 0.04, 0, 7); c.fill();
      c.fillStyle = 'rgba(0,0,0,0.12)'; for (let k = 0; k < 3; k++) c.fillRect(-150 + k * 90, -14 + k * 6, 60, 3);
      c.restore();
    };

    // Shot 1 (narration 141-142): chapter "3" over the hot room. Khadija leans on the far wall.
    const shot1 = (c, lt, p) => {
      const cam = K.camera(c, p, { x: -30, y: 0, z: 1.0 }, { x: 40, y: -6, z: 1.1 });
      cam.layer(0, k => hotBase(k, 0.3));
      cam.layer(0.3, k => {
        k.fillStyle = K.vgrad(k, 60, 480, ['#3a2620', '#1a100c']); k.fillRect(-640, 60, 2560, 420); // back wall
        k.fillStyle = 'rgba(0,0,0,0.25)'; k.fillRect(700, 60, 600, 420);
      });
      cam.layer(0.6, k => { // the furnace behind the burning first wall, flickering
        K.arch(k, 40, 540, 220, 300, '#120806');
        K.glow(k, 150, 430, 300, '#ff8a3a', 0.32 + 0.08 * Math.sin(lt * 7));
      });
      cam.layer(1, k => {
        K.tileFloor(k, 470, '#7a5a4a', 'rgba(0,0,0,0.25)', lt);
        K.woman(k, 420, 640, 0.9, { color: '#1c1614', scarf: '#4a2a2a', robe: 'towel', towel: '#6e5a4e', width: 1.1, t: lt + 1 });
        K.woman(k, 620, 652, 0.8, { color: '#17110f', robe: 'towel', towel: '#7a6a5a', width: 0.9, pose: 'sit', t: lt + 2 });
        // Khadija, leaning on the wall, a towel knotted under her arms.
        K.woman(k, 1000, 610, 1.05, { color: '#2a1f1c', scarf: null, robe: 'towel', towel: '#d8cbb4', width: 1.0, t: lt, facing: -1 });
      });
      K.steam(c, lt, 0.9, 5);
      K.particles(c, lt, { n: 36, color: 'rgba(255,200,140,0.35)', rise: 4 });
    };

    // Shot 2 (narration 142 end): the marble slab with its worn hollow, furnace light from behind.
    const shot2 = (c, lt, p) => {
      const cam = K.camera(c, p, { x: 0, y: 0, z: 1.0 }, { x: 0, y: -20, z: 1.18 });
      cam.layer(0, k => hotBase(k, 0.45));
      cam.layer(0.4, k => {
        K.glow(k, 0, 380, 520, '#ff8a3a', 0.25);
        k.fillStyle = K.vgrad(k, 120, 440, ['#3a2620', '#1a100c']); k.fillRect(-640, 120, 2560, 330);
        K.zellige(k, -200, 120, 1700, 300, 40, ['#2c1b15', '#150d0a', '#3a2519'], lt); // tiled wall, dim
        k.fillStyle = 'rgba(6,3,2,0.35)'; k.fillRect(-640, 120, 2560, 300);
      });
      cam.layer(1, k => {
        k.fillStyle = K.vgrad(k, 430, 640, ['#a08e7e', '#5e4e44']); k.fillRect(-640, 430, 2560, 300); // marble slab
        k.fillStyle = '#4a3a31'; k.beginPath(); k.ellipse(640, 480, 260, 46, 0, 0, 7); k.fill();      // the hollow
        k.fillStyle = 'rgba(255,220,170,0.12)'; k.beginPath(); k.ellipse(640, 490, 200, 26, 0, 0, 7); k.fill();
        K.lightPool(k, 640, 480, 320, 60, 0.12, '#ffd59a');
      });
      K.steam(c, lt, 1.2, 9);
      K.particles(c, lt, { n: 24, color: 'rgba(255,220,170,0.3)', rise: 3 });
    };

    // Shot 3 (narration 143): the dome, a drop that always falls on the same tile, a slipper on it.
    const shot3 = (c, lt, p) => {
      const cam = K.camera(c, p, { x: 0, y: 0, z: 1.0 }, { x: -10, y: 10, z: 1.08 });
      cam.layer(0, k => K.dome(k, lt, '#5b4538', 9));
      cam.layer(1, k => {
        K.tileFloor(k, 500, '#7a5a4a', 'rgba(0,0,0,0.25)', lt);
        k.fillStyle = '#e6dccb'; k.beginPath(); k.roundRect(590, 522, 100, 46, 6); k.fill(); // the pale tile
        K.slipper(k, 640, 552, 1.1, '#c4473f', 0);
        K.drop(k, lt % 3.0, 640, 60, 532, 0, 1.4);                                          // drip, splash, repeat
      });
      K.steam(c, lt, 0.5, 13);
      K.particles(c, lt, { n: 20, color: 'rgba(255,220,180,0.3)', rise: 3 });
    };

    // Shot 4 (narration 144): steam eats the room; women become shapes; her towel slips and falls.
    const shot4 = (c, lt, p) => {
      const cam = K.camera(c, p, { x: -40, y: 0, z: 1.0 }, { x: 40, y: 0, z: 1.12 });
      const fall = K.ramp(t, B(144) + 3, B(144) + 7);      // towel slides down, 0..1
      const slipped = fall >= 1;
      cam.layer(0, k => hotBase(k, 0.5));
      cam.layer(0.5, k => { // women as blurred shapes
        K.woman(k, 300, 520, 0.8, { color: '#1c1614', robe: 'towel', towel: '#6e5a4e', width: 1.2, t: lt });
        K.woman(k, 560, 560, 0.9, { color: '#1c1614', robe: 'towel', towel: '#7a6a5a', width: 1.0, pose: 'sit', t: lt + 1 });
        K.woman(k, 800, 500, 0.7, { color: '#17110f', robe: 'towel', towel: '#5a6a6a', width: 0.9, t: lt + 2 });
      });
      cam.layer(1, k => {
        K.tileFloor(k, 470, '#7a5a4a', 'rgba(0,0,0,0.25)', lt);
        K.woman(k, 1040, 600, 1.0, {
          color: '#2a1f1c', scarf: null, width: 1.0, t: lt, facing: -1,
          robe: slipped ? undefined : 'towel', towel: '#d8cbb4',
          arm: K.pulse(t, B(144) + 3, B(144) + 6.5, 0.5) * 0.9, // one reach
        });
        if (!slipped) { // towel sliding off the shoulders
          const x = K.lerp(1030, 990, fall), y = K.lerp(440, 572, K.easeIn(fall));
          k.save(); k.translate(x, y); k.rotate(K.lerp(-0.2, 0.9, fall));
          k.fillStyle = '#d8cbb4'; k.beginPath(); k.roundRect(-40, -14, 80, 28, 10); k.fill(); k.restore();
        } else {
          towelOnFloor(k, 990, 574, 0.9);
        }
      });
      haze(c, 300, 600, 0.55);
      K.steam(c, lt, 0.8 + 0.9 * K.ramp(t, B(144), B(144) + 12), 17);
      K.particles(c, lt, { n: 24, color: 'rgba(255,220,170,0.3)', rise: 3 });
    };

    // Shot 5 (narration 144 end-145): the towel on the tiles, sharp only at her feet.
    const shot5 = (c, lt, p) => {
      const cam = K.camera(c, p, { x: 0, y: -10, z: 1.2 }, { x: -30, y: 0, z: 1.32 });
      cam.layer(0, k => hotBase(k, 0.55));
      cam.layer(1, k => {
        K.tileFloor(k, 330, '#7a5a4a', 'rgba(0,0,0,0.3)', lt);
        towelOnFloor(k, 640, 530, 1.3);
      });
      haze(c, 180, 470, 0.85);
      K.steam(c, lt, 0.9, 21);
    };

    // Shot 6 (narration 146-147): the round woman holds the bag back; the thin one takes it.
    const shot6 = (c, lt, p) => {
      const cam = K.camera(c, p, { x: 0, y: 0, z: 1.0 }, { x: 20, y: -10, z: 1.1 });
      cam.layer(0, k => hotBase(k, 0.5));
      cam.layer(0.5, k => K.glow(k, 690, 380, 360, '#ffd59a', 0.10));
      cam.layer(1, k => {
        K.tileFloor(k, 470, '#7a5a4a', 'rgba(0,0,0,0.25)', lt);
        // the round woman, from behind, arm out to the side, not looking
        K.woman(k, 560, 600, 1.2, { color: '#2b2321', width: 1.45, robe: 'towel', towel: '#c9875a', scarf: null, t: lt, arm: 0.82 });
        // the thin one, facing her, reaching out for the bag
        K.woman(k, 840, 600, 1.1, { color: '#1d2a2c', scarf: '#2f5e63', width: 0.8, robe: 'towel', towel: '#9fb4c2', t: lt + 1, facing: -1, arm: 0.82 });
        bag(k, 705, 430, 1.1, Math.sin(lt * 1.3) * 0.04);
      });
      K.steam(c, lt, 0.8, 31);
      K.particles(c, lt, { n: 20, color: 'rgba(255,220,170,0.3)', rise: 3 });
    };

    // Shot 7 (narration 149-152): a bust in profile; she turns the earring with her thumb.
    const shot7 = (c, lt, p) => {
      const cam = K.camera(c, p, { x: 0, y: 0, z: 1.0 }, { x: 0, y: 0, z: 1.08 });
      cam.layer(0, k => hotBase(k, 0.4));
      cam.layer(0.5, k => K.glow(k, 640, 300, 500, '#ff8a3a', 0.12));
      cam.layer(1, k => {
        K.profile(k, 640, 400, 0.8, { scarf: '#6b3b4f', earring: true, rim: K.C.lamp, t: lt, tilt: 0.04 });
        // thumb on the left earring, turning it slowly
        K.hand(k, 680, 456, 0.3, '#4a3a40', 0.5 + Math.sin(lt * 1.5) * 0.4);
      });
      K.steam(c, lt, 0.6, 33);
    };

    // Shot 8 (narration 153-154): the bag on a dry step; she is lowered onto the marble, a little, all the way down.
    const shot8 = (c, lt, p) => {
      const q = K.ramp(t, B(153), B(153) + 10); // lowering progress
      const cam = K.camera(c, p, { x: -20, y: 0, z: 1.0 }, { x: 20, y: -6, z: 1.1 });
      cam.layer(0, k => hotBase(k, 0.5));
      cam.layer(1, k => {
        K.tileFloor(k, 500, '#7a5a4a', 'rgba(0,0,0,0.25)', lt);
        k.fillStyle = K.vgrad(k, 520, 640, ['#a08e7e', '#5e4e44']); k.fillRect(-640, 520, 2560, 220); // marble
        k.fillStyle = '#4a3a31'; k.beginPath(); k.ellipse(640, 560, 260, 34, 0, 0, 7); k.fill();     // hollow
        k.fillStyle = '#b8a690'; k.fillRect(930, 576, 170, 26);                                       // dry step
        bag(k, 1000, 540, 0.9);
        // the thin one, standing behind, one hand under the elbow
        K.woman(k, 790, 600, 1.1, { color: '#1d2a2c', scarf: '#2f5e63', width: 0.8, robe: 'towel', towel: '#9fb4c2', t: lt, facing: -1, arm: 0.5 });
        // the round woman, lowering into the hollow
        const s = K.lerp(1.2, 1.0, q), y = K.lerp(560, 600, q);
        K.woman(k, 620, y, s, { color: '#2b2321', width: 1.45, robe: 'towel', towel: '#c9875a', scarf: null, t: lt, pose: q > 0.45 ? 'sit' : 'bend' });
      });
      K.steam(c, lt, 1.0, 37);
      K.particles(c, lt, { n: 20, color: 'rgba(255,220,170,0.3)', rise: 3 });
    };

    K.shots(ctx, t, dur, [
      [0, shot1],
      [B(142) + 12, shot2],
      [B(143), shot3],
      [B(144), shot4],
      [B(144) + 12, shot5],
      [B(146), shot6],
      [B(150), shot7],
      [B(153), shot8],
    ]);

    // Chapter number, only while the opening narration plays.
    K.title(ctx, '3', K.pulse(t, 0.3, B(142) - 0.2, 0.8), { size: 160, y: 300, color: KIT.C.plaster });

    K.finish(ctx, t);
    K.fadeEdges(ctx, t, dur, 0.6, 0.6);
  },
});
