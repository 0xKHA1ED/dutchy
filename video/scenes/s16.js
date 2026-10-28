// Scene 16: the final scene. The fine, the jar, the pocket, the folded ticket,
// and the earring. It ends on a long, quiet hold that fades to black.
// Shots: Fiat at dusk with the ticket under the wiper -> close on the ticket,
// pulling back to the meter and the Nescafe jar -> the empty pocket ->
// the ticket folded in four -> profile bust, earring, long hold to black.
SCENE({
  draw(ctx, t, dur, B) {
    const K = KIT, C = K.C;

    // Shot 1: the Fiat in cold dusk light, the ticket under the wiper.
    const shot1 = (c, lt, p) => {
      const cam = K.camera(c, p, { x: -40, y: 0, z: 1.0 }, { x: 60, y: -10, z: 1.08 });
      cam.layer(0, c2 => { K.sky(c2, 'cold'); K.glow(c2, 1000, 120, 300, '#cfe3e6', 0.22); });
      cam.layer(0.3, c2 => K.medina(c2, 470, '#2b3840', 9, 0.12, lt));
      cam.layer(1, c2 => {
        c2.fillStyle = '#3a474d'; c2.fillRect(-400, 560, 2200, 300);     // pavement
        K.car(c2, 640, 600, 1.5, '#e6e2d8', lt);
        K.paper(c2, 700, 462, 0.55, 0, '#f4efe2', 0.15);                  // ticket under the wiper
        K.glow(c2, 700, 462, 26, C.lamp, 0.25);
      });
      cam.layer(1.4, c2 => K.particles(c2, lt, { n: 30, color: K.MOODS.cold.dust, rise: 5 }));
    };

    // Shot 2: the ticket in close-up and the coin ("Cent dirhams"), then the
    // camera pulls back to the blank meter and the Nescafe jar, and the hand scrapes it.
    const shot2 = (c, lt, p) => {
      const near = 1 - K.ramp(t, B(225) - 1.0, B(225) + 1.5);  // close ticket fades out
      const far = K.ramp(t, B(225) - 0.5, B(225) + 2.0);       // meter and jar fade in
      if (near > 0) {
        c.save(); c.globalAlpha = near;
        K.sky(c, 'cold'); K.glow(c, 640, 300, 320, '#cfe3e6', 0.3);
        K.paper(c, 620, 330, 2.4, 0, '#f4efe2', -0.05);
        K.coin(c, 930, 480, 34, lt, 0);
        K.particles(c, lt, { n: 30, color: K.MOODS.cold.dust, rise: 4 });
        c.restore();
      }
      if (far > 0) {
        c.save(); c.globalAlpha = far;
        K.sky(c, 'cold');
        K.glow(c, 1030, 300, 200, '#9fd3a8', 0.12);
        K.parkingMeter(c, 1040, 660, 1.0, '', true);                       // screen blank
        K.jar(c, 600, 640, 1.7, 0.45);                                     // Nescafe jar of coins
        // Hand reaches down into the jar: nails scrape the glass, bottom, side, bottom.
        const down = K.ease(K.clamp((t - B(225) - 4) / 4));
        const scrape = t > B(225) + 8 ? Math.sin((t - B(225)) * 5) * 14 : 0;
        const hy = K.lerp(250, 400, down);
        K.hand(c, 600 + scrape, hy, 1.0, '#8a5a3c', 0.1);
        K.particles(c, lt, { n: 30, color: K.MOODS.cold.dust, rise: 4 });
        c.restore();
      }
    };

    // Shot 3: standing in the cold street, the hand goes to the pocket of the djellaba: empty.
    const shot3 = (c, lt, p) => {
      const cam = K.camera(c, p, { x: 0, y: 0, z: 1.0 }, { x: 0, y: -20, z: 1.12 });
      cam.layer(0, c2 => { K.sky(c2, 'cold'); K.glow(c2, 240, 160, 260, '#cfe3e6', 0.2); });
      cam.layer(0.4, c2 => K.medina(c2, 480, '#25313a', 4, 0.1, lt));
      cam.layer(1, c2 => {
        c2.fillStyle = '#3a474d'; c2.fillRect(-400, 600, 2200, 260);
        K.woman(c2, 640, 650, 1.75, { color: '#2a2230', scarf: '#6b3b4f', width: 1.0, t: lt, arm: 0.1 });
        // the pocket: a dark slit on the hip, nothing in it
        c2.fillStyle = '#120e16'; c2.beginPath(); c2.roundRect(640 + 14, 650 - 140, 32, 40, 6); c2.fill();
      });
      cam.layer(1.4, c2 => K.particles(c2, lt, { n: 26, color: K.MOODS.cold.dust, rise: 4 }));
    };

    // Shot 4: the ticket folded in four, corner on corner, the crease pressed flat.
    // Then it goes into the empty pocket and the shot falls dark.
    const shot4 = (c, lt, p) => {
      const s0 = B(227);
      const folds = 2 * K.ramp(t, s0, s0 + 9);
      const gone = 1 - K.ramp(t, s0 + 10, s0 + 13);
      K.sky(c, 'cold');
      K.glow(c, 640, 320, 300, '#cfe3e6', 0.25);
      if (gone > 0) {
        c.save(); c.globalAlpha = gone;
        K.paper(c, 640, 340, 2.6, folds, '#f4efe2', 0.04);
        c.restore();
      }
      K.particles(c, lt, { n: 24, color: K.MOODS.cold.dust, rise: 3 });
    };

    // Shot 5: profile bust, earring glint, a long quiet hold.
    const shot5 = (c, lt, p) => {
      const cam = K.camera(c, p, { x: 0, y: 0, z: 1.0 }, { x: -10, y: -6, z: 1.05 });
      cam.layer(0, c2 => { K.sky(c2, 'cold'); K.glow(c2, 420, 180, 320, '#cfe3e6', 0.18); });
      cam.layer(1, c2 => {
        K.profile(c2, 640, 420, 1.2, { scarf: '#6b3b4f', earring: true, rim: C.lamp, t: lt, tilt: 0.08 });
        // the earring catches the light a little more, slowly
        const pulse = 0.5 + 0.5 * Math.sin(lt * 0.6);
        K.glow(c2, 640 + 36 * 1.2, 420 + 60 * 1.2, 36, C.gold, 0.25 + 0.2 * pulse);
      });
      cam.layer(1.4, c2 => K.particles(c2, lt, { n: 22, color: K.MOODS.cold.dust, rise: 3 }));
    };

    K.shots(ctx, t, dur, [
      [0,           shot1],
      [B(224),      shot2],
      [B(226),      shot3],
      [B(227),      shot4],
      [B(227) + 13, shot5],
    ]);
    K.finish(ctx, t);
    // Long fade to black at the very end.
    K.fadeEdges(ctx, t, dur, 0.6, 4.5);
  },
});
