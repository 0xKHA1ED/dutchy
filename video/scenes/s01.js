// Scene s01 (opens the film): title card, then Bab Boujloud in the morning.
// Khadija reads the meter notice, remembers the coin jar in the Fiat and the
// till at 3 a.m., watches the street, then feeds the meter.
// Shots: title -> wide street -> meter notice -> night till -> jar in the car
//        -> taxi queue and seller -> meter with the knotted bag -> coins in the meter.
SCENE({
  draw(ctx, t, dur, B) {
    const K = KIT, C = K.C;

    // ---------- local props ----------
    // Café chair seen from the side, facing the street.
    const chair = (c, x, y, s = 1, color = '#2a2a2e') => {
      c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = color;
      c.fillRect(-34, -64, 68, 10);            // seat
      c.fillRect(-30, -54, 6, 54); c.fillRect(24, -54, 6, 54);   // legs
      c.fillRect(-34, -128, 6, 66);            // back post
      c.beginPath(); c.roundRect(-34, -132, 40, 22, 6); c.fill(); // back rail
      c.restore();
    };
    // Standing or seated man in silhouette. vest = hi-vis colour or null.
    const man = (c, x, y, s = 1, color = '#1d1f24', vest = null, sit = false) => {
      c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = color;
      if (sit) {
        c.beginPath(); c.roundRect(-26, -150, 52, 100, 18); c.fill();   // torso
        c.beginPath(); c.roundRect(-30, -66, 70, 16, 6); c.fill();      // thighs
        c.beginPath(); c.roundRect(10, -66, 16, 66, 6); c.fill();       // shins
      } else {
        c.beginPath(); c.roundRect(-22, -150, 44, 124, 18); c.fill();
        c.beginPath(); c.roundRect(-20, -34, 16, 34, 6); c.roundRect(4, -34, 16, 34, 6); c.fill();
      }
      c.beginPath(); c.ellipse(0, -172, 18, 22, 0, 0, 7); c.fill();     // head
      if (vest) { c.fillStyle = vest; c.beginPath(); c.roundRect(-24, -140, 48, 84, 8); c.fill();
        c.fillStyle = 'rgba(255,240,200,0.6)'; c.fillRect(-24, -110, 48, 4); }
      c.restore();
    };
    // Paper cone of sunflower seeds from the notebook-paper cornets.
    const cone = (c, x, y, s = 1) => {
      c.save(); c.translate(x, y); c.scale(s, s);
      c.fillStyle = '#efe6d2'; c.beginPath(); c.moveTo(-14, -40); c.lineTo(14, -40); c.lineTo(0, 0); c.closePath(); c.fill();
      c.fillStyle = '#2a4a8a'; c.fillRect(-14, -40, 28, 3);
      c.fillStyle = '#5a3d2b';
      for (let i = 0; i < 7; i++) c.fillRect(-9 + (i * 5) % 17, -30 + (i % 3) * 8, 3, 2);
      c.restore();
    };
    // Café table with a row of cones on it, the seed seller behind.
    const seller = (c, x, y) => {
      cone(c, x - 60, y - 2, 0.9); cone(c, x - 20, y - 2, 0.9); cone(c, x + 20, y - 2, 0.9); cone(c, x + 60, y - 2, 0.9);
      K.cut(c, '#4a3a2c', p => { p.beginPath(); p.rect(x - 100, y, 200, 14); p.rect(x - 90, y + 14, 12, 40); p.rect(x + 78, y + 14, 12, 40); }, 3);
    };

    // ---------- shot 1: title card over the night medina (0 to B(3)) ----------
    const shot1 = (c, lt) => {
      K.sky(c, 'night');
      K.stars(c, lt, 90, 11);
      K.glow(c, 640, 330, 520, '#ffcf8a', 0.10);
      K.medina(c, 560, '#05070b', 2, 0.35, lt);
      K.particles(c, lt, { n: 40, color: K.MOODS.night.dust, rise: 6 });
      K.title(c, 'La Paire', K.pulse(t, 0.4, B(2) - 0.2, 0.6), { size: 120, color: C.plaster });
      K.title(c, 'Un', K.pulse(t, B(2), B(3) - 0.2, 0.8), { size: 72, color: C.gold });
    };

    // ---------- shot 2: wide street, the gate, the Fiat, the meter (B(3) to B(5)) ----------
    const shot2 = (c, lt, p) => {
      const cam = K.camera(c, p, { x: -60, y: 0, z: 1.0 }, { x: 80, y: 10, z: 1.12 });
      cam.layer(0, c2 => {
        K.sky(c2, 'day'); K.glow(c2, 980, 140, 260, '#fff3d6', 0.35);
        K.medina(c2, 470, '#7d8a96', 4, 0.05, lt);
      });
      cam.layer(0.25, c2 => K.gate(c2, 420, 560, 300, 330, '#2c5f8a', '#3b2a22'));
      cam.layer(0.5, c2 => { chair(c2, 80, 620, 1.1); chair(c2, 170, 620, 1.1); man(c2, 130, 620, 0.9, '#1c1e22', '#e0732c', true); chair(c2, 120, 640, 1.2, '#2a2a2e'); });
      cam.layer(1, c2 => {
        c2.fillStyle = '#b7a58a'; c2.fillRect(-400, 600, 2200, 300);           // pavement
        K.taxi(c2, 330, 610, 0.7); K.taxi(c2, 580, 614, 0.72);
        K.car(c2, 860, 640, 1.0, '#e6e2d8');                                    // the Fiat
        K.parkingMeter(c2, 1100, 660, 1.0, '', true);
        K.woman(c2, 1010, 660, 1.0, { color: '#2a2230', scarf: '#6b3b4f', width: 1.1, t: lt, earring: true, arm: K.pulse(t, B(4), B(5), 0.5) * 0.6 });
      });
      cam.layer(1.4, c2 => K.particles(c2, lt, { n: 40, color: K.MOODS.day.dust, rise: 6 }));
    };

    // ---------- shot 3: close on the meter, the notice, Khadija at the meter (B(5) to B(7)) ----------
    const shot3 = (c, lt, p) => {
      K.sky(c, 'day'); K.glow(c, 1000, 120, 300, '#fff3d6', 0.3);
      K.medina(c, 360, '#8f9aa4', 5, 0.02, lt);
      c.fillStyle = '#b7a58a'; c.fillRect(-400, 640, 2200, 200);
      K.parkingMeter(c, 600, 700, 1.9, '', true);
      // the notice, stuck to the side of the meter
      K.paper(c, 712, 250, 0.8, 0, '#f4efe2', -0.06);
      K.woman(c, 1060, 730, 1.7, { color: '#2a2230', scarf: '#6b3b4f', width: 1.1, t: lt, earring: true, arm: 0.1 });
      K.particles(c, lt, { n: 30, color: K.MOODS.day.dust, rise: 5 });
    };

    // ---------- shot 4: night till flashback, the cashier's 3 a.m. (B(7) to B(8)) ----------
    const shot4 = (c, lt, p) => {
      K.sky(c, 'night');
      K.glow(c, 720, 380, 520, '#ffcf8a', 0.12);
      K.bulb(c, 640, 40, lt, 150);
      K.till(c, 720, 560, 1.1, '', lt);
      K.notebook(c, 500, 470, 0.36, 6, lt, p);
      K.woman(c, 300, 640, 1.2, { color: '#2a2230', scarf: '#6b3b4f', width: 1.0, t: lt, earring: true, arm: 0 });
      K.particles(c, lt, { n: 40, color: K.MOODS.night.dust, rise: 5 });
    };

    // ---------- shot 5: the Fiat, the Nescafé jar, counting coins (B(9) to B(11)) ----------
    const shot5 = (c, lt, p) => {
      K.sky(c, 'day');
      K.medina(c, 430, '#7d8a96', 4, 0.02, lt);
      K.glow(c, 1000, 120, 240, '#fff3d6', 0.25);
      // seats and dashboard seen through the car
      K.cut(c, '#2b2623', q => { q.beginPath(); q.roundRect(60, 280, 300, 260, 30); q.roundRect(920, 280, 300, 260, 30); }, 6);
      K.cut(c, '#3a332d', q => { q.beginPath(); q.rect(-K.W, 520, K.W * 3, 260); }, 6);
      // the bridge where the jar sits
      K.cut(c, '#4a3f36', q => { q.beginPath(); q.roundRect(540, 540, 200, 40, 10); }, 4);
      // sunflower seed shells on the dash
      const r = K.rng(31);
      c.fillStyle = 'rgba(230,200,150,0.35)';
      for (let i = 0; i < 40; i++) { c.beginPath(); c.ellipse(r() * K.W, 600 + r() * 110, 4 + r() * 2, 2, r() * 3, 0, 7); c.fill(); }
      // the jar empties just before the line "Le pot était vide"
      const fill = 0.42 * (1 - K.ramp(t, B(10) - 1.2, B(10) + 0.2));
      K.jar(c, 640, 560, 2.2, fill);
      // the hand dips in, then rests
      K.hand(c, 640, 215 + 12 * Math.sin(lt * 1.2), 0.85, '#8a5a3c', Math.PI);
      // the seven coins, laid out as she counts them
      const counted = Math.min(7, Math.floor(K.clamp((t - B(9)) / (B.end(9) - B(9))) * 8));
      for (let i = 0; i < counted; i++) K.coin(c, 420 + i * 46, 640 - (i % 2) * 6, 16, lt, 0);
      K.particles(c, lt, { n: 25, color: K.MOODS.day.dust, rise: 3 });
    };

    // ---------- shot 6: taxi queue and the seed seller (B(11) to 74 s) ----------
    const shot6 = (c, lt, p) => {
      K.sky(c, 'day'); K.glow(c, 980, 140, 260, '#fff3d6', 0.35);
      K.medina(c, 470, '#7d8a96', 6, 0.03, lt);
      c.fillStyle = '#b7a58a'; c.fillRect(-400, 600, 2200, 300);
      chair(c, 1020, 630, 1.0); chair(c, 1120, 630, 1.0);
      man(c, 1070, 630, 0.95, '#1c1e22', '#e0732c', true);
      K.taxi(c, 60, 600, 0.7); K.taxi(c, 300, 606, 0.72); K.taxi(c, 540, 600, 0.7); K.taxi(c, 760, 610, 0.72);
      seller(c, 880, 620);
      man(c, 880, 640, 1.0, '#26282e', null, false);
      K.parkingMeter(c, 1190, 700, 0.95, '', false);
      K.particles(c, lt, { n: 30, color: K.MOODS.day.dust, rise: 5 });
    };

    // ---------- shot 7: the meter with its knotted plastic bag, the agent with coffee (74 to B(12)) ----------
    const shot7 = (c, lt, p) => {
      const cam = K.camera(c, p, { x: 0, y: 0, z: 1.0 }, { x: -40, y: -10, z: 1.25 });
      cam.layer(0, c2 => { K.sky(c2, 'day'); K.glow(c2, 980, 140, 260, '#fff3d6', 0.35); K.medina(c2, 470, '#7d8a96', 6, 0.03, lt); });
      cam.layer(1, c2 => {
        c2.fillStyle = '#b7a58a'; c2.fillRect(-400, 600, 2200, 300);
        chair(c2, 240, 640, 1.0); chair(c2, 330, 640, 1.0);
        man(c2, 285, 640, 1.0, '#1c1e22', '#e0732c', true);
        c2.fillStyle = '#3a2a22'; c2.fillRect(280, 600, 36, 4);             // coffee glass on the table
        c2.fillStyle = 'rgba(230,220,200,0.7)'; c2.fillRect(288, 588, 20, 12);
        K.parkingMeter(c2, 900, 700, 1.6, '', true);
        c2.save(); c2.translate(900, 700); c2.scale(1.6, 1.6);
        c2.fillStyle = 'rgba(230,230,220,0.85)'; c2.beginPath(); c2.ellipse(0, -224, 10, 7, 0, 0, 7); c2.fill(); // the knot under the screen
        c2.restore();
      });
    };

    // ---------- shot 8: close on the meter, coins drop in, minutes appear (B(12) to end) ----------
    const shot8 = (c, lt) => {
      K.sky(c, 'street');
      const k = K.clamp((t - B(12)) / (B.end(12) - B(12)));
      K.glow(c, 640, 240, 420, '#9fd3a8', 0.18);
      const i = Math.min(2, Math.floor(k * 3));       // which coin
      const ph = k * 3 - i;                           // progress through this coin
      const shown = i + (ph > 0.6 ? 1 : 0);
      const screen = ['', '10 min', '20 min', '20 min'][shown];
      K.parkingMeter(c, 640, 720, 2.0, screen, false);
      if (ph < 0.6) K.coin(c, 640, 150 + K.easeIn(ph / 0.6) * 110, 22, lt, 3);
      K.particles(c, lt, { n: 30, color: K.MOODS.street.dust, rise: 4 });
    };

    K.shots(ctx, t, dur, [
      [0,       shot1],   // title card
      [B(3),    shot2],   // Bab Boujloud, the Fiat and the meter
      [B(5),    shot3],   // the notice on the meter
      [B(7),    shot4],   // the till at 3 a.m.
      [B(9),    shot5],   // the jar in the car, the coins
      [B(11),   shot6],   // the taxi queue and the seller
      [(B(11) + B(12)) / 2, shot7],   // the meter's bag, the agent with coffee
      [B(12),   shot8],   // coins in the meter
    ]);

    K.finish(ctx, t);
    K.fadeEdges(ctx, t, dur, 2.5, 1.2);
  },
});
