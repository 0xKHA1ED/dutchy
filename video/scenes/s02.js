// s02: chapter 1 (street at Bab Boujloud, the meter, the hammam door).
SCENE({ draw(ctx, t, dur, B) { const K = KIT;
  // Pavement in lamplight, a warm ground band under the street.
  const ground = (c, y) => { c.fillStyle = K.vgrad(c, y, K.H, ['#b08a64', '#4a3a30']); c.fillRect(-K.W, y, K.W * 3, K.H * 2); };
  // Parking meter with a wider green screen so the text fits.
  const meter = (c, x, y, s, text) => {
    K.parkingMeter(c, x, y, s, '', true);
    if (text) {
      c.save(); c.fillStyle = '#9fd3a8';
      c.fillRect(x - 44 * s, y - 322 * s, 88 * s, 30 * s);
      c.fillStyle = '#163a20'; c.font = `bold ${13 * s}px DejaVu Sans Mono, monospace`;
      c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, x, y - 307 * s);
      c.restore();
    }
  };
  K.shots(ctx, t, dur, [
    // Shot 1 (B13): the meter, six coins in, the seventh drops back.
    [0, (c, lt, p) => {
      K.sky(c, 'day');
      K.medina(c, 380, '#8c7360', 4, 0.2, lt);
      ground(c, 470);
      K.car(c, 300, 600, 0.9, '#e6e2d8');
      K.taxi(c, 1040, 600, 0.7);
      meter(c, 760, 600, 1, 'fin 11 h 20');
      K.glow(c, 760, 330, 120, '#9fd3a8', 0.18);
      // The seventh coin falls straight back into the lower slot.
      const k = (lt - 6.2) / 1.4;
      if (k > 0 && k < 1) K.coin(c, 760, K.lerp(300, 372, K.easeIn(k)), 9, lt, 0);
      K.particles(c, lt, { n: 40, color: K.MOODS.day.dust });
    }],
    // Shot 2 (B14): Khadija, mock-offended, turned to the machine.
    [B(14), (c, lt, p) => {
      K.sky(c, 'day');
      K.medina(c, 380, '#8c7360', 4, 0.2, lt);
      ground(c, 470);
      meter(c, 880, 600, 0.9, '');
      K.profile(c, 400, 230, 1.0, { scarf: '#6b3b4f', earring: true, rim: K.C.lamp, t: lt, tilt: 0.06 * Math.sin(lt * 1.2) });
      K.particles(c, lt, { n: 30, color: K.MOODS.day.dust });
    }],
    // Shot 3 (B17): the coin turned between her nails.
    [B(17), (c, lt, p) => {
      K.sky(c, 'warm');
      K.glow(c, 640, 360, 320, K.C.lamp, 0.22);
      K.hand(c, 640, 470, 1.1, '#8a5a3c', 0.1 * Math.sin(lt * 1.5));
      K.coin(c, 640, 425, 24, lt, 3);
      K.particles(c, lt, { n: 35, color: K.MOODS.warm.dust });
    }],
    // Shot 4 (B18): the cashier's night, till glow and the notebook writing itself.
    [B(18), (c, lt, p) => {
      K.sky(c, 'night');
      K.bulb(c, 300, 40, lt);
      K.glow(c, 640, 380, 260, '#7fd0e0', 0.12);
      K.till(c, 640, 540, 1.2, '', lt);
      K.notebook(c, 420, 360, 0.7, 6, lt, p);
      K.particles(c, lt, { n: 30, color: K.MOODS.night.dust });
    }],
    // Shot 5 (middle of B18): notebook close-up, the entry in her hand.
    [B(18) + (B.end(18) - B(18)) * 0.5, (c, lt, p) => {
      K.sky(c, 'night');
      K.glow(c, 640, 360, 420, K.C.lamp, 0.12);
      K.notebook(c, 640, 340, 1.5, 6, lt, p);
      K.particles(c, lt, { n: 30, color: K.MOODS.night.dust });
    }],
    // Shot 6 (B19): Khadija's thumb at her left earring.
    [B(19), (c, lt, p) => {
      K.sky(c, 'day');
      K.medina(c, 380, '#8c7360', 4, 0.2, lt);
      ground(c, 470);
      K.profile(c, 560, 230, 1.1, { scarf: '#6b3b4f', earring: true, rim: K.C.lamp, t: lt, tilt: 0.15 });
      K.particles(c, lt, { n: 30, color: K.MOODS.day.dust });
    }],
    // Shot 7 (middle of B19): the voucher, folded in four, thumbnail on the crease.
    [B(19) + (B(20) - B(19)) * 0.5, (c, lt, p) => {
      K.sky(c, 'day');
      K.glow(c, 640, 400, 380, '#fff3d6', 0.2);
      const folds = 2 * K.clamp(lt / 10.5);
      K.paper(c, 640, 400, 2.0, folds, '#f4efe2', 0.04);
      c.save(); c.translate(640, 400); c.rotate(0.04); c.scale(2, 2);
      c.globalAlpha = K.clamp((0.9 - folds) / 0.4); c.fillStyle = '#2a3c8a';
      c.font = 'italic 11px "DejaVu Serif", serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('Bon pour un gommage', 0, -18);
      c.restore();
      K.particles(c, lt, { n: 30, color: K.MOODS.day.dust });
    }],
    // Shot 8 (B20): Fiat on the street, going downhill, the meter left behind.
    [B(20), (c, lt, p) => {
      K.sky(c, 'day');
      K.medina(c, 380, '#8c7360', 4, 0.2, lt);
      ground(c, 470);
      meter(c, 230, 600, 0.8, '');
      K.car(c, 560 + lt * 6, 600, 1.0, '#e6e2d8');
      K.particles(c, lt, { n: 30, color: K.MOODS.day.dust });
    }],
    // Shot 9 (B23): the hammam door, a woman on the phone, one slipper in and one out.
    [B(23), (c, lt, p) => {
      K.sky(c, 'hammam');
      K.tileFloor(c, 560);
      K.door(c, 800, 600, 260, 420, 0, '#4a2e20');
      K.woman(c, 560, 600, 1.0, { color: '#1c2324', scarf: '#2f5e63', width: 0.8, t: lt });
      K.slipper(c, 640, 640, 0.9, '#c4473f', 0.2);
      K.slipper(c, 500, 660, 0.9, '#3f7fbf', -0.1);
      K.steam(c, lt, 0.5);
      K.particles(c, lt, { n: 25, color: K.MOODS.hammam.dust });
    }],
    // Shot 10 (B24): Khadija looks at the door; the door opens on "the door is for everybody".
    [B(24), (c, lt, p) => {
      const open = K.ramp(lt, 4.5, 7);
      K.sky(c, 'warm');
      K.glow(c, 180, 420, 260, K.C.lamp, 0.5 * open);
      K.lightShaft(c, 240, 180, 160, 420, lt, 0.14 * open);
      K.door(c, 60, 600, 240, 420, open, '#4a2e20');
      K.profile(c, 860, 230, 1.0, { scarf: '#6b3b4f', earring: true, rim: K.C.lamp, t: lt, facing: -1, tilt: 0.05 });
      K.steam(c, lt, 0.4);
      K.particles(c, lt, { n: 25, color: K.MOODS.warm.dust });
    }],
  ]);
  K.finish(ctx, t);
  K.fadeEdges(ctx, t, dur, 0.6, 0.6);
} });
