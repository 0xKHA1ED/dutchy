// Scene 14: chapter 4. Khadija leaves the hammam: the changing room, the wall,
// the street door, the till memories, the alley climbing away, the steps counted.
// Shots: title "4" -> feet through a light pool -> ballets and sandals on cardboard
// -> dressing (bend, headscarf) -> round woman singing through the wall -> profile
// murmur while the door opens -> till memories -> alley climbing -> sandal on cobble.
SCENE({
  draw(ctx, t, dur, B) {
    const K = KIT, C = K.C, W = K.W, H = K.H;
    // Start of a segment, and a point a fraction of the way through it.
    const at = (id, f) => B(id) + f * (B.end(id) - B(id));

    // Shared pieces -------------------------------------------------------
    // Moroccan star band on a far wall.
    const zWall = c => {
      K.zellige(c, -120, 40, 1520, 330, 40, ['#20414a', '#6f6553', '#17303a']);   // dimmed, cold tile band
      c.fillStyle = 'rgba(10,20,24,0.45)'; c.fillRect(-W, 0, W * 3, 380);
    };
    // Round tin of biscuits; `half` draws the half-eaten tin (the "moitié").
    const tin = (c, x, y, s, half) => {
      c.save(); c.translate(x, y); c.scale(s, s);
      K.cut(c, '#9b2f2a', k => { k.beginPath(); k.roundRect(-70, -70, half ? 70 : 140, 110, 10); });
      c.fillStyle = C.gold; c.fillRect(-70, -20, half ? 70 : 140, 10);
      c.fillStyle = '#d9b48a'; c.beginPath(); c.ellipse(half ? -35 : 0, -70, half ? 35 : 70, 14, 0, 0, 7); c.fill();
      c.restore();
    };
    // Walls and floor of the alley, converging on a vanishing point.
    const alley = (c, lt) => {
      K.sky(c, 'day');
      K.glow(c, 640, 250, 260, '#fff3d6', 0.8);
      c.fillStyle = '#7d6b5a';
      c.beginPath(); c.moveTo(-300, -100); c.lineTo(560, 200); c.lineTo(560, 420); c.lineTo(-300, 720); c.fill();
      c.fillStyle = '#6a5a4c';
      c.beginPath(); c.moveTo(1580, -100); c.lineTo(720, 200); c.lineTo(720, 420); c.lineTo(1580, 720); c.fill();
      c.fillStyle = C.sand; c.globalAlpha = 0.85;
      c.beginPath(); c.moveTo(-300, 720); c.lineTo(560, 420); c.lineTo(720, 420); c.lineTo(1580, 720); c.fill();
      c.globalAlpha = 1;
      // cobbles, rows getting closer together toward the vanishing point
      c.save();
      c.beginPath(); c.moveTo(-300, 720); c.lineTo(560, 420); c.lineTo(720, 420); c.lineTo(1580, 720); c.clip();
      c.strokeStyle = 'rgba(40,30,22,0.35)'; c.lineWidth = 2;
      for (let i = 0; i < 12; i++) {
        const y = 420 + Math.pow(i / 11, 1.9) * 300;
        c.beginPath(); c.moveTo(-300, y); c.lineTo(1580, y); c.stroke();
      }
      c.restore();
    };

    // Shot 1: title card "4" over the cold changing room (segment 194).
    const shot1 = (c, lt) => {
      K.sky(c, 'cold');
      K.tileFloor(c, 430, '#4b6266', 'rgba(0,0,0,0.2)');
      K.particles(c, lt, { n: 30, color: K.MOODS.cold.dust, rise: 5 });
      K.title(c, '4', K.pulse(lt, 0.3, 2.1, 0.6), { size: 180, color: C.plaster });
    };

    // Shot 2: low eye-level on the tiles. Feet, buckets, the stool leg, and her
    // sandals walking through a circle of daylight without seeing it (segment 195).
    const shot2 = (c, lt, p) => {
      K.sky(c, 'cold');
      const cam = K.camera(c, p, { x: -40, y: 0, z: 1.05 }, { x: 60, y: -10, z: 1.12 });
      cam.layer(0, c2 => {
        K.glow(c2, 900, 120, 300, '#cfe3e6', 0.25);
        K.tileFloor(c2, 380, '#5d7a7e', 'rgba(0,0,0,0.2)');
      });
      cam.layer(0.6, c2 => {
        K.bucket(c2, 260, 520, 0.9, '#3f7f8c', 1);
        K.bucket(c2, 1000, 500, 0.75, '#3f7f8c', 0);
        c2.fillStyle = C.umber;
        c2.fillRect(640, 470, 18, 120); c2.fillRect(606, 456, 86, 14);   // stool
      });
      cam.layer(1, c2 => {
        K.lightPool(c2, 560, 555, 190, 55, 0.4, '#fff3d6');              // the circle of daylight
        const x = K.lerp(180, 1100, K.ease(p));
        K.shoe(c2, x, 556, 1.15, 'sandal', '#2b2a2c');
      });
      K.particles(c, lt, { n: 35, color: K.MOODS.cold.dust, rise: 4 });
    };

    // Shot 3: close-up of the cardboard: her sandals and the black ballet flats
    // with gold buckles waiting beside them (segment 196, start).
    const shot3 = (c, lt, p) => {
      K.sky(c, 'cold');
      const cam = K.camera(c, p, { x: -30, y: -10, z: 1.0 }, { x: 40, y: -30, z: 1.12 });
      cam.layer(0, c2 => zWall(c2));
      cam.layer(1, c2 => {
        K.cut(c2, '#a88a62', k => { k.beginPath(); k.rect(300, 470, 680, 200); }, 8);
        c2.strokeStyle = 'rgba(70,50,30,0.35)'; c2.lineWidth = 2;
        c2.beginPath(); c2.moveTo(300, 500); c2.lineTo(980, 500); c2.stroke();
        K.shoePair(c2, 390, 540, 1.3, 'sandal', { color: '#2b2a2c' });
        K.shoePair(c2, 800, 530, 1.3, 'ballet', { color: '#141218' });
      });
      cam.layer(1.3, c2 => K.lightShaft(c2, 900, -40, 200, 620, lt, 0.1));
    };

    // Shot 4: she bends toward the Velcro, stopped halfway by her hip (segment 196, middle).
    const shot4 = (c, lt, p) => {
      K.sky(c, 'cold');
      const cam = K.camera(c, p, { x: 20, y: 0, z: 1.0 }, { x: -30, y: -10, z: 1.08 });
      cam.layer(0, c2 => zWall(c2));
      cam.layer(0.7, c2 => K.bench(c2, 150, 470, 420, '#5a3d2b'));
      cam.layer(1, c2 => {
        K.tileFloor(c2, 560, '#4b6266', 'rgba(0,0,0,0.15)');
        K.woman(c2, 700, 575, 1.2, { color: '#2a2230', scarf: '#6b3b4f', width: 1.1, t: lt, arm: -0.55 });
        K.shoePair(c2, 380, 575, 1.1, 'sandal', { color: '#2b2a2c' });
      });
      K.particles(c, lt, { n: 25, color: K.MOODS.cold.dust, rise: 4 });
    };

    // Shot 5: tying the headscarf over wet hair, without a mirror (segment 196, late).
    const shot5 = (c, lt, p) => {
      K.sky(c, 'cold');
      const cam = K.camera(c, p, { x: -20, y: 0, z: 1.0 }, { x: 30, y: -20, z: 1.1 });
      cam.layer(0, c2 => {
        zWall(c2);
        K.glow(c2, 1100, 160, 300, '#cfe3e6', 0.2);
      });
      cam.layer(1, c2 => {
        K.tileFloor(c2, 560, '#4b6266', 'rgba(0,0,0,0.15)');
        K.bundle(c2, 980, 560, 0.9, '#7a4a6a');
        K.woman(c2, 620, 565, 1.25, { color: '#2a2230', scarf: '#6b3b4f', width: 1.1, t: lt, arm: 0.5 + 0.4 * Math.sin(lt * 0.8) });
      });
    };

    // Shot 6: through the wall, the round woman sings. Khadija stands with her back
    // to the wall and does not turn (segment 197).
    const shot6 = (c, lt, p) => {
      K.sky(c, 'cold');
      const cam = K.camera(c, p, { x: 0, y: 0, z: 1.0 }, { x: -40, y: 0, z: 1.08 });
      cam.layer(0, c2 => {
        c2.fillStyle = K.vgrad(c2, 0, H, ['#2a3a3d', '#1b2729']);
        c2.fillRect(-W, -H, W * 3, H * 3);
        K.lightPool(c2, 380, 180, 260, 160, 0.15, '#cfe3e6');
      });
      cam.layer(0.6, c2 => {
        // the round woman, blurred behind the plaster, with a faint haze over her
        c2.save(); c2.filter = 'blur(10px)';
        K.woman(c2, 960, 570, 1.7, { color: '#2b2321', width: 1.45, robe: 'towel', towel: '#c9875a', scarf: null, t: lt, arm: 0.4 + 0.3 * Math.sin(lt * 2) });
        c2.filter = 'none'; c2.restore();
        c2.fillStyle = 'rgba(20,30,34,0.35)'; c2.fillRect(-W, -H, W * 3, H * 3);
      });
      cam.layer(1, c2 => {
        K.tileFloor(c2, 560, '#4b6266', 'rgba(0,0,0,0.15)');
        K.woman(c2, 360, 575, 1.1, { color: '#2a2230', scarf: '#6b3b4f', width: 1.1, facing: -1, t: lt });
      });
      K.particles(c, lt, { n: 20, color: K.MOODS.cold.dust, rise: 3 });
    };

    // Shot 7: profile, eyes closed, murmuring "Si tu pars, pars". The street door
    // on the left swings open from segment 199 and the light comes in (segments 198-199).
    const shot7 = (c, lt) => {
      const openA = K.ramp(t, B(199), B(199) + 3.5);
      K.sky(c, 'cold');
      const dx = 120, dy = 600, dw = 240, dh = 420;
      K.cut(c, '#2a3238', k => { k.beginPath(); k.rect(-W, -H, W * 3, H * 3); }, 0);
      K.door(c, dx, dy, dw, dh, openA, '#4a2e20');
      c.save();
      K.archPath(c, dx, dy, dw, dh); c.clip();
      K.glow(c, dx + dw * (1 - 0.85 * openA) + 40, 420, 320, '#fff3d6', 0.9 * openA);
      c.restore();
      K.lightShaft(c, dx + dw, 180, 260, 540, lt, 0.12 * openA, '255,240,210');
      K.profile(c, 800, 380, 1.2, { scarf: '#6b3b4f', earring: true, facing: -1, rim: C.lamp, t: lt, tilt: 0.08, eyes: 'closed' });
      K.particles(c, lt, { n: 25, color: K.MOODS.cold.dust, rise: 4 });
    };

    // Shot 8: memory fragments at the till, night mood. Four items, one after the
    // other: the tin, the half tin, the glass counter, the velvet tray (segment 200).
    const shot8 = (c, lt) => {
      const k = K.clamp((t - B(200)) / (B.end(200) - B(200)));
      const step = Math.min(3, Math.floor(k * 4));
      const within = k * 4 - step;                            // 0..1 inside one item
      K.sky(c, 'night');
      K.glow(c, 640, 330, 420, '#ffcf8a', 0.18);
      K.bulb(c, 1040, 0, lt, 220);
      const screen = ['380', '190', '', ''][step];
      K.till(c, 640, 500, 1.0, screen, lt);
      // the scan beam sweeps across the belt once per item
      const sx = K.lerp(330, 900, K.ease(within));
      c.save(); c.globalCompositeOperation = 'lighter';
      c.fillStyle = 'rgba(127,208,224,0.25)'; c.fillRect(sx - 3, 300, 6, 180);
      c.restore();
      const a = K.ramp(within, 0, 0.2) * (0.7 + 0.3 * (1 - within));
      c.save(); c.globalAlpha = a;
      if (step === 0) tin(c, 640, 430, 1.1, false);
      if (step === 1) tin(c, 640, 430, 1.1, true);
      if (step === 2) {
        c.fillStyle = 'rgba(190,225,235,0.14)'; c.fillRect(420, 340, 440, 170);
        c.strokeStyle = 'rgba(220,240,245,0.4)'; c.lineWidth = 2; c.strokeRect(420, 340, 440, 170);
      }
      if (step === 3) {
        K.cut(c, '#5a1f2c', k2 => { k2.beginPath(); k2.roundRect(400, 420, 480, 46, 10); }, 6);
        c.fillStyle = 'rgba(255,200,210,0.12)'; c.fillRect(420, 428, 440, 8);
      }
      c.restore();
      K.particles(c, lt, { n: 25, color: K.MOODS.night.dust, rise: 5 });
    };

    // Shot 9: the alley climbs. Her small figure walks up it while the camera
    // lifts (segment 201, through 204 counting).
    const shot9 = (c, lt, p) => {
      const cam = K.camera(c, p, { x: 0, y: 60, z: 1.0 }, { x: 0, y: -60, z: 1.08 });
      cam.layer(0, c2 => alley(c2, lt));
      cam.layer(1, c2 => {
        K.woman(c2, 640, 560, 0.5, { color: '#2a2230', scarf: '#6b3b4f', width: 1.1, pose: 'walk', t: lt * 1.2 });
      });
      K.particles(c, lt, { n: 25, color: K.MOODS.day.dust, rise: 3 });
    };

    // Shot 10: close on her sandal coming down onto a cobble in the light
    // (segment 204, counting steps). The scene ends on it.
    const shot10 = (c, lt, p) => {
      K.sky(c, 'day');
      const cam = K.camera(c, p, { x: 0, y: 0, z: 1.0 }, { x: 0, y: -20, z: 1.06 });
      cam.layer(0, c2 => {
        c2.fillStyle = K.vgrad(c2, 380, H, ['#9c8a72', '#5c4d41']);
        c2.fillRect(-W, 380, W * 3, H);
        const r = K.rng(21);
        c2.strokeStyle = 'rgba(40,30,22,0.25)'; c2.lineWidth = 2;
        for (let i = 0; i < 40; i++) {
          const x = r() * W, y = 420 + r() * 300, rx = 40 + r() * 40;
          c2.beginPath(); c2.ellipse(x, y, rx, rx * 0.4, 0, 0, 7); c2.stroke();
        }
      });
      cam.layer(1, c2 => {
        K.lightPool(c2, 640, 560, 380, 120, 0.3, '#fff3d6');
        const lift = 1 - K.ease(K.clamp(lt / 1.4));
        K.shoe(c2, 640, 520 - lift * 60, 2.1, 'sandal', '#2b2a2c');
      });
      K.particles(c, lt, { n: 20, color: K.MOODS.day.dust, rise: 3 });
    };

    K.shots(ctx, t, dur, [
      [0,        shot1],
      [B(195),   shot2],
      [B(196),   shot3],
      [at(196, 0.3), shot4],
      [at(196, 0.62), shot5],
      [B(197),   shot6],
      [B(198),   shot7],
      [B(200),   shot8],
      [B(201),   shot9],
      [B(204),   shot10],
    ]);
    K.finish(ctx, t);
    K.fadeEdges(ctx, t, dur, 0.6, 0.6);
  },
});
