// Scene 1: title, then Bab Boujloud in the morning. Khadija feeds the parking meter.
// Shots: title card -> street with gate, Fiat and meter -> close on meter and coins.
SCENE({
  draw(ctx, t, dur, B) {
    const K = KIT, C = K.C;

    // Shot A: title over a dark medina skyline (segments 1-2).
    const a = 1 - K.ramp(t, B(3) - 1.5, B(3));
    // Shot C: close on the meter from the coin count (segment 12).
    const c = K.ramp(t, B(12) - 1, B(12) + 0.5);

    if (a < 1) {
      // Shot B: the street. Camera drifts right towards the meter.
      const p = (t - B(3)) / (B(12) - B(3));
      const cam = K.camera(ctx, p, { x: -60, y: 0, z: 1.0 }, { x: 80, y: 10, z: 1.12 });
      cam.layer(0, c2 => { K.sky(c2, 'day'); K.glow(c2, 980, 140, 260, '#fff3d6', 0.35); });
      cam.layer(0.25, c2 => K.medina(c2, 470, '#7d8a96', 4, 0, t));
      cam.layer(0.5, c2 => K.gate(c2, 420, 560, 300, 330, '#2c5f8a', '#3b2a22'));
      cam.layer(1, c2 => {
        c2.fillStyle = '#b7a58a'; c2.fillRect(-400, 560, 2200, 300);           // pavement
        K.taxi(c2, 120, 600, 0.7); K.taxi(c2, 380, 610, 0.72);
        K.car(c2, 860, 640, 1.0, '#c9b48a');                                   // the Fiat
        K.parkingMeter(c2, 1100, 660, 1.0, '', true);
        K.woman(c2, 1010, 660, 1.0, { color: '#2a2230', scarf: '#6b3b4f', width: 1.1, t, earring: true, arm: K.pulse(t, B(4), B(5), 0.5) * 0.6 });
      });
      cam.layer(1.4, c2 => K.particles(c2, t, { n: 40, color: K.MOODS.day.dust, rise: 6 }));
    }

    if (c > 0) {
      // Shot C: close-up of the meter screen counting up with each coin.
      ctx.save(); ctx.globalAlpha = c;
      K.sky(ctx, 'street');
      const k = (t - B(12)) / (B.end(12) - B(12));
      const coins = Math.min(2, Math.floor(K.clamp(k) * 3));
      K.glow(ctx, 640, 260, 420, '#9fd3a8', 0.18);
      K.parkingMeter(ctx, 640, 1010, 2.6, ['10 min', '20 min', '20 min'][coins] || '', false);
      const drop = (k * 3) % 1;
      K.coin(ctx, 640, 230 + K.easeIn(drop) * 90, 22, t, 3);
      K.particles(ctx, t, { n: 30, color: K.MOODS.street.dust, rise: 4 });
      ctx.restore();
    }

    if (a > 0) {
      ctx.save(); ctx.globalAlpha = a;
      K.sky(ctx, 'night'); K.medina(ctx, 720, '#05070b', 2, 0.35, t);
      K.particles(ctx, t, { n: 50, color: K.MOODS.night.dust, rise: 8 });
      K.title(ctx, 'La Paire', K.pulse(t, 0.4, B(2) + 0.2, 1.0), { size: 120, color: C.plaster });
      K.title(ctx, 'Un', K.pulse(t, B(2), B(3), 0.6), { size: 72, color: C.gold });
      ctx.restore();
    }

    K.finish(ctx, t);
    K.fadeEdges(ctx, t, dur, 1.0, 0.6);
  },
});
