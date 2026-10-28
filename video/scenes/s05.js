// Scene s05: chapter 1, the warm hammam room. Khadija watches the thin woman
// with the bag, then the soap, the sleeves, the mitt; memory of 2014 at the till
// and the framed certificate; the earring; "you can tell by the hands"; the
// thin one's shoulders turn for a second; Khadija's triumphant close.
// Shots: wide hall -> round woman seated -> coin in fist -> sleeves -> Khadija
// profile -> till memory -> certificate -> ear -> hands -> profile.
SCENE({
  draw(ctx, t, dur, B) {
    const K = KIT, C = K.C;

    // Figure presets (see ANIMATOR_GUIDE character bible).
    const KH = { color: '#2a2230', robe: 'towel', towel: '#d8cbb4', scarf: null, width: 1.1, earring: true };
    const THIN = { color: '#1d2a2c', robe: 'towel', towel: '#9fb4c2', scarf: null, width: 0.8 };
    const ROUND = { color: '#2b2321', robe: 'towel', towel: '#c9875a', scarf: null, width: 1.45 };
    const BYSTANDER = { color: '#1c2324', robe: 'towel', towel: '#7d6a5a', scarf: null, width: 1 };

    // Handbag, cut paper, with a strap.
    const handbag = (c, x, y, s = 1) => {
      K.cut(c, '#5a3520', p => { p.beginPath(); p.roundRect(x - 44 * s, y - 30 * s, 88 * s, 60 * s, 10 * s); }, 4);
      c.save(); c.strokeStyle = '#3a2216'; c.lineWidth = 6 * s; c.beginPath(); c.arc(x, y - 30 * s, 22 * s, Math.PI, 0); c.stroke(); c.restore();
    };
    // Knotted supermarket plastic bag, translucent, with a knot on top.
    const plasticBag = (c, x, y, s = 1) => {
      c.save(); c.translate(x, y); c.scale(s, s);
      c.fillStyle = 'rgba(225,236,240,0.30)'; c.beginPath();
      c.moveTo(-70, 0); c.quadraticCurveTo(-82, -70, -30, -82); c.quadraticCurveTo(0, -92, 30, -82);
      c.quadraticCurveTo(82, -70, 70, 0); c.quadraticCurveTo(0, 12, -70, 0); c.fill();
      c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = 2; c.stroke();
      c.fillStyle = 'rgba(235,242,246,0.55)'; c.beginPath(); c.arc(0, -88, 10, 0, 7); c.fill();
      c.restore();
    };
    // Pot of black soap (savon noir): dark soap level in a clear tub.
    const soapTub = (c, x, y, s = 1, fill = 0.7) => {
      c.save(); c.translate(x, y); c.scale(s, s);
      c.fillStyle = 'rgba(200,220,230,0.22)'; c.beginPath(); c.roundRect(-36, -110, 72, 110, 12); c.fill();
      c.fillStyle = '#0d0a08'; c.fillRect(-32, -fill * 100, 64, fill * 100 - 4);
      c.fillStyle = C.umber; c.fillRect(-38, -124, 76, 18);
      c.fillStyle = 'rgba(255,255,255,0.25)'; c.fillRect(-26, -100, 7, 80);
      c.restore();
    };
    // Yogurt cups in a little stack, red foil lids.
    const cups = (c, x, y, s = 1) => {
      for (let i = 0; i < 3; i++) {
        const cy = y - i * 34 * s;
        c.save(); c.translate(x, cy); c.scale(s, s);
        K.cut(c, '#efe6d2', p => { p.beginPath(); p.roundRect(-34, -30, 68, 30, 6); }, 3);
        c.fillStyle = C.red; c.fillRect(-36, -36, 72, 8);
        c.restore();
      }
    };
    // Faint invisible sleeve pushed up above the elbow, drawn along the raised upper arm
    // (outline only). px,py = shoulder pivot on screen, ang = arm rotation, s = figure scale.
    const ghostSleeve = (c, px, py, ang, s, a) => {
      if (a <= 0.01) return;
      c.save(); c.translate(px, py); c.rotate(ang);
      c.strokeStyle = `rgba(20,24,34,${0.6 * a})`; c.lineWidth = 3; c.setLineDash([8, 6]);
      c.beginPath(); c.roundRect(-15 * s, 14 * s, 30 * s, 36 * s, 12 * s); c.stroke();
      c.setLineDash([]); c.restore();
    };

    // Timing helpers from the brief.
    const S54 = B(54);
    const midB50 = (B(50) + B.end(50)) / 2;

    K.shots(ctx, t, dur, [
      // Shot 1 (B43-44): wide warm hall, the thin woman with the knotted bag, Khadija watching.
      [0, (c, lt, p) => {
        const cam = K.camera(c, p, { x: -40, y: 0, z: 1 }, { x: 30, y: -8, z: 1.06 });
        cam.layer(0, c2 => { K.dome(c2, lt, '#3e5452', 9); K.steam(c2, lt, 0.6, 3); });
        cam.layer(0.4, c2 => { K.tileFloor(c2, 470); K.bench(c2, 820, 468, 320); });
        cam.layer(0.8, c2 => {
          K.woman(c2, 170, 560, 0.75, { ...BYSTANDER, pose: 'sit', t: lt });
          K.woman(c2, 1010, 590, 0.8, { ...BYSTANDER, t: lt, width: 1.2 });
        });
        cam.layer(1, c2 => {
          K.woman(c2, 800, 640, 1.2, { ...THIN, t: lt, arm: 0.3 + 0.1 * Math.sin(lt) });
          plasticBag(c2, 830, 520, 0.9);
          K.woman(c2, 380, 650, 1.35, { ...KH, t: lt });
        });
        cam.layer(1.4, c2 => K.particles(c2, lt, { n: 30, color: K.MOODS.hammam.dust, rise: 6 }));
        K.glow(c, 640, 60, 420, '#f3ead6', 0.18);
      }],

      // Shot 2 (B45-46): the round woman settles on the tiles, back turned; the thin one sets the bag by her and reaches for the soap.
      [B(45), (c, lt, p) => {
        const cam = K.camera(c, p, { x: 60, y: 0, z: 1.02 }, { x: -30, y: 0, z: 1.08 });
        cam.layer(0, c2 => K.sky(c2, 'hammam'));
        cam.layer(0.4, c2 => { K.steam(c2, lt, 0.5, 11); K.tileFloor(c2, 480); });
        cam.layer(1, c2 => {
          K.woman(c2, 440, 650, 1.6, { ...ROUND, pose: 'sit', t: lt });
          soapTub(c2, 700, 640, 1.0, 0.7);
          K.woman(c2, 960, 640, 1.15, { ...THIN, t: lt, arm: 0.2 + 0.6 * K.ease(p) });
          plasticBag(c2, 560, 640, 0.6);
        });
        cam.layer(1.4, c2 => K.particles(c2, lt, { n: 30, color: K.MOODS.hammam.dust, rise: 6 }));
      }],

      // Shot 3 (B46): close on Khadija's fist with the 2-dirham coin, the soap pot beside it.
      [B(46), (c, lt, p) => {
        const cam = K.camera(c, p, { x: 0, y: 0, z: 1 }, { x: -20, y: -10, z: 1.1 });
        cam.layer(0, c2 => { K.sky(c2, 'warm'); K.glow(c2, 480, 300, 380, C.lamp, 0.25); });
        cam.layer(1, c2 => {
          soapTub(c2, 930, 650, 2.0, 0.6);
          K.hand(c2, 500, 520, 1.5, '#2a2230', -0.05);
          K.coin(c2, 500, 470, 24, lt, 0);
        });
        cam.layer(1.4, c2 => K.particles(c2, lt, { n: 25, color: K.MOODS.warm.dust, rise: 5 }));
      }],

      // Shot 4 (B47): the thin one pushes up her invisible sleeves; the mitt arm rises.
      [B(47), (c, lt, p) => {
        const cam = K.camera(c, p, { x: 0, y: 0, z: 1 }, { x: 0, y: -20, z: 1.05 });
        cam.layer(0, c2 => { K.sky(c2, 'hammam'); K.steam(c2, lt, 0.8, 5); });
        cam.layer(0.4, c2 => K.tileFloor(c2, 430));
        cam.layer(1, c2 => {
          const ar = 0.2 + 0.8 * K.ease(K.clamp(lt / 6));
          K.woman(c2, 640, 660, 1.9, { ...THIN, t: lt, arm: ar });
          // Arm pivot in screen space: woman local (shW*0.8, -bodyH+12) scaled by 1.9.
          ghostSleeve(c2, 640 + 34 * 0.8 * 0.8 * 1.9, 660 - 188 * 1.9, -0.25 - ar * 1.6, 1.9, K.pulse(lt, 2, 13, 1.2));
        });
        cam.layer(1.4, c2 => K.particles(c2, lt, { n: 30, color: K.MOODS.hammam.dust, rise: 6 }));
      }],

      // Shot 5 (B48-49): Khadija in profile, stopped dead, eyes open; the thin one puts on the mitt behind her.
      [B(48), (c, lt, p) => {
        const cam = K.camera(c, p, { x: -10, y: 0, z: 1 }, { x: 10, y: 0, z: 1.03 });
        cam.layer(0, c2 => { K.sky(c2, 'hammam'); K.steam(c2, lt, 0.7, 8); });
        cam.layer(0.5, c2 => {
          K.woman(c2, 1040, 560, 0.7, { ...THIN, t: lt, arm: 0.3 + 0.35 * K.ease(K.clamp(lt / 10)) });
        });
        cam.layer(1, c2 => K.profile(c2, 400, 390, 0.95, { scarf: '#6b3b4f', earring: true, rim: C.lamp, t: lt, tilt: 0.04 }));
        cam.layer(1.4, c2 => K.particles(c2, lt, { n: 25, color: K.MOODS.hammam.dust, rise: 5 }));
      }],

      // Shot 6 (B50, first half): memory, night shift at the till: a hand reaches into a bag between the yogurts.
      [B(50), (c, lt, p) => {
        const cam = K.camera(c, p, { x: -20, y: 0, z: 1 }, { x: 20, y: 0, z: 1.05 });
        cam.layer(0, c2 => { K.sky(c2, 'night'); });
        cam.layer(0.6, c2 => K.bulb(c2, 240, 120, lt, 40));
        cam.layer(1, c2 => {
          K.till(c2, 640, 560, 1.3, '', lt);
          handbag(c2, 470, 470, 1.1);
          cups(c2, 820, 470, 1.0);
          K.hand(c2, 490, 420, 0.9, '#1a1518', -0.3);
        });
        cam.layer(1.4, c2 => K.particles(c2, lt, { n: 25, color: K.MOODS.night.dust, rise: 5 }));
      }],

      // Shot 7 (B50, second half): the framed certificate next to her sink.
      [midB50, (c, lt, p) => {
        const cam = K.camera(c, p, { x: 0, y: 0, z: 1 }, { x: 0, y: -10, z: 1.06 });
        cam.layer(0, c2 => { K.sky(c2, 'night'); K.glow(c2, 600, 220, 320, C.lamp, 0.35); });
        cam.layer(1, c2 => {
          c2.fillStyle = '#1b2230'; c2.fillRect(-200, 0, 1700, 720);                // wall
          K.cut(c2, '#4a3520', q => { q.beginPath(); q.rect(420, 180, 360, 260); }, 6);   // frame
          c2.fillStyle = '#efe6d2'; c2.fillRect(442, 202, 316, 216);                       // certificate paper
          c2.fillStyle = 'rgba(40,60,140,0.45)'; c2.fillRect(470, 250, 260, 2);
          c2.fillStyle = 'rgba(40,60,140,0.45)'; c2.fillRect(470, 268, 220, 2);
          K.label(c2, 'Vigilance 2014', 600, 232, 26, '#2a2a40');
          K.glow(c2, 600, 360, 50, C.gold, 0.6);
          c2.fillStyle = C.gold; c2.beginPath(); c2.arc(600, 360, 22, 0, 7); c2.fill();
          K.cut(c2, '#dfe6e8', q => { q.beginPath(); q.roundRect(440, 520, 320, 110, 14); }, 4);   // sink
          K.tap(c2, 600, 510, 0.9, 0, lt);
        });
        cam.layer(1.4, c2 => K.particles(c2, lt, { n: 20, color: K.MOODS.night.dust, rise: 4 }));
      }],

      // Shot 8 (B51-52): Khadija in profile, "une voleuse"; the camera pushes to her earring as the thumb turns it.
      [B(51), (c, lt, p) => {
        const z = 1 + 1.1 * K.ramp(t, B(52), B(52) + 3);
        const ex = 400 + 36 * 0.95, ey = 390 + 60 * 0.95;   // earring position in screen space
        const cam = K.camera(c, p, { x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: 1 });
        cam.layer(0, c2 => { K.sky(c2, 'hammam'); K.steam(c2, lt, 0.5, 8); });
        c.save(); c.translate(ex, ey); c.scale(z, z); c.translate(-ex, -ey);
        cam.layer(1, c2 => K.profile(c2, 400, 390, 0.95, { scarf: '#6b3b4f', earring: true, rim: C.lamp, t: lt, tilt: 0.04 }));
        c.restore();
        // Thumb turning the left earring, only once the pinch begins.
        const tk = K.ramp(t, B(52) - 0.2, B(52) + 0.5);
        if (tk > 0) {
          c.save(); c.translate(ex - 10, ey + 22); c.rotate(-0.4 + Math.sin((t - B(52)) * 5) * 0.25 * tk); c.scale(0.22 * (1 + 0.6 * z / 2), 0.22 * (1 + 0.6 * z / 2));
          c.globalAlpha = tk; K.cut(c, '#2a2230', q => { q.beginPath(); q.ellipse(0, 0, 60, 40, 0, 0, 7); }, 4); c.restore();
        }
      }],

      // Shot 9 (B53-55): the thin one's hands, "by the hands"; they stop, shoulders turn for a second, then go on.
      [B(53), (c, lt, p) => {
        const cam = K.camera(c, p, { x: 0, y: 0, z: 1 }, { x: 0, y: -10, z: 1.05 });
        cam.layer(0, c2 => { K.sky(c2, 'hammam'); K.steam(c2, lt, 0.6, 9); });
        cam.layer(0.5, c2 => K.tileFloor(c2, 430));
        cam.layer(1, c2 => {
          // Her shoulders turn toward Khadija's wall for a second after the hands stop.
          const turn = K.pulse(t, S54 + 0.8, S54 + 5.5, 0.6);
          const stopped = K.ramp(t, S54, S54 + 0.3) - K.ramp(t, S54 + 5.5, S54 + 7);   // 1 while moving, 0 when stopped
          const mv = K.clamp(1 - stopped);
          c2.save(); c2.translate(640, 680); c2.scale(1 - 0.45 * turn, 1); c2.translate(-640, -680);
          K.woman(c2, 640, 720, 1.6, { ...THIN, t: lt, arm: 0.6 + 0.35 * Math.sin(t * 4) * mv });
          c2.restore();
          const sway = Math.sin(t * 4) * 18 * mv;
          K.hand(c2, 560 + sway, 470, 1.5, '#1d2a2c', -0.2);
          K.hand(c2, 730 - sway, 480, 1.5, '#1d2a2c', 0.25);
        });
        cam.layer(1.4, c2 => K.particles(c2, lt, { n: 25, color: K.MOODS.hammam.dust, rise: 6 }));
      }],

      // Shot 10 (B55): Khadija's close, triumphant and dry. Hold to the end.
      [B(55), (c, lt, p) => {
        const cam = K.camera(c, p, { x: 0, y: 0, z: 1 }, { x: -30, y: 0, z: 1.04 });
        cam.layer(0, c2 => { K.sky(c2, 'warm'); K.glow(c2, 700, 200, 380, C.lamp, 0.22); });
        cam.layer(1, c2 => K.profile(c2, 400, 390, 0.95, { scarf: '#6b3b4f', earring: true, rim: C.lamp, t: lt, tilt: -0.04 }));
        cam.layer(1.4, c2 => K.particles(c2, lt, { n: 25, color: K.MOODS.warm.dust, rise: 5 }));
      }],
    ]);

    K.finish(ctx, t);
    K.fadeEdges(ctx, t, dur, 0.6, 0.6);
  },
});
