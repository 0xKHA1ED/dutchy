// Scene s13: chapter 3, the hot room. The thin one scrubs the round one, says "Khadija",
// Khadija answers to nothing, then leaves with her eyes on the clock.
SCENE({
  draw(ctx, t, dur, B) {
    const K = KIT, C = K.C, W = K.W, H = K.H;
    // Bathing-room figures (bathhouse decency: towel silhouettes, no detail).
    const FAT = { color: '#1d2a2c', scarf: null, width: 0.8, robe: 'towel', towel: '#9fb4c2' };
    const DIJA = { color: '#2b2321', width: 1.45, robe: 'towel', towel: '#c9875a', scarf: null };
    const KHA = { color: '#2a2230', scarf: null, width: 1.1, robe: 'towel', towel: '#d8cbb4', earring: true };
    const BG_W = { color: '#1c2324', width: 1.0, robe: 'towel', towel: '#7d8f8c', scarf: null };
    const NIGHT_DUST = { color: K.MOODS.night.dust, rise: 8, n: 30 };

    const dim = (c, a) => { c.fillStyle = `rgba(0,0,0,${a})`; c.fillRect(-W, -H, W * 3, H * 3); };

    // Hot room backdrop: dark tiled wall, zellige band, wet floor, optional dome.
    const hot = (c, lt, { dome = false, shade = 0.25 } = {}) => {
      if (dome) K.dome(c, lt, '#2c3e3d', 9);
      else {
        c.fillStyle = K.vgrad(c, 0, H, ['#16201f', '#2a3a3b', '#3e5355']);
        c.fillRect(-W, -H, W * 3, H * 3);
        K.zellige(c, 60, 130, W - 120, 52, 30, ['#2f5e63', '#4a6264', '#1d3a3d'], lt);
      }
      K.tileFloor(c, 470, '#4d6567', 'rgba(0,0,0,0.25)', lt);
      dim(c, shade);
    };

    // Round clock on a white face: the only sharp thing in the room at the end.
    const clock = (c, x, y, r, hA, mA) => {
      c.save();
      K.glow(c, x, y, r * 2.4, '#fff8e4', 0.22);
      K.cut(c, '#f4f1e8', p => { p.beginPath(); p.arc(x, y, r, 0, 7); }, 6);
      c.strokeStyle = '#2a2a2a'; c.lineWidth = r * 0.05;
      c.beginPath(); c.arc(x, y, r * 0.9, 0, 7); c.stroke();
      for (let i = 0; i < 12; i++) {
        const a = i / 12 * Math.PI * 2;
        c.beginPath();
        c.moveTo(x + Math.sin(a) * r * 0.74, y - Math.cos(a) * r * 0.74);
        c.lineTo(x + Math.sin(a) * r * 0.84, y - Math.cos(a) * r * 0.84);
        c.lineWidth = r * 0.04; c.stroke();
      }
      c.lineCap = 'round'; c.strokeStyle = '#1b1b1b';
      const hand = (a, len, w) => {
        c.lineWidth = w; c.beginPath(); c.moveTo(x, y);
        c.lineTo(x + Math.sin(a) * len, y - Math.cos(a) * len); c.stroke();
      };
      hand(hA, r * 0.5, r * 0.07);
      hand(mA, r * 0.76, r * 0.045);
      c.fillStyle = '#1b1b1b'; c.beginPath(); c.arc(x, y, r * 0.05, 0, 7); c.fill();
      c.restore();
    };

    const shotsList = [
      // Shot 1: wide, the scrubbing. Khadija at the wall, watching.
      [0, (c, lt, p) => {
        const cam = K.camera(c, p, { x: -30, y: 0, z: 1.0 }, { x: 30, y: -8, z: 1.08 });
        cam.layer(0, c2 => hot(c2, lt, { dome: true, shade: 0.1 }));
        cam.layer(0.5, c2 => K.woman(c2, 1120, 540, 0.8, { ...BG_W, t: lt, width: 1.1 }));
        cam.layer(1, c2 => {
          K.woman(c2, 220, 560, 0.92, { ...KHA, t: lt });
          K.woman(c2, 520, 575, 1.0, { ...FAT, t: lt, arm: 0.45 + 0.35 * Math.sin(lt * 2.2) });
          K.woman(c2, 800, 575, 1.16, { ...DIJA, t: lt });
        });
        cam.layer(1.4, c2 => K.steam(c2, lt, 0.9, 11));
        K.particles(c, lt, { n: 40, color: 'rgba(240,245,240,0.3)', rise: 6 });
      }],

      // Shot 2: close on the mitt and the soap-slick arm, sleeves pushed up.
      [B(181), (c, lt, p) => {
        const cam = K.camera(c, p, { x: 0, y: 40, z: 1.0 }, { x: 0, y: -10, z: 1.15 });
        cam.layer(0, c2 => hot(c2, lt, { shade: 0.3 }));
        cam.layer(0.4, c2 => K.woman(c2, 1050, 600, 1.9, { ...DIJA, t: lt, color: '#17110f' }));
        cam.layer(1, c2 => {
          const push = K.ease(K.clamp((lt - 0.5) / 2.5));
          const band = 560 - 200 * push;               // towel band pushed up the forearm
          c2.fillStyle = FAT.color;
          c2.beginPath(); c2.roundRect(560, 300, 50, 440, 24); c2.fill();
          c2.fillStyle = FAT.towel;
          c2.beginPath(); c2.roundRect(550, band, 70, 24, 10); c2.fill();
          K.hand(c2, 585, 280 - 14 * Math.sin(lt * 3), 1.3, '#0c0c0f', 0);
        });
        cam.layer(1, c2 => K.steam(c2, lt, 0.7, 5));
      }],

      // Shot 3: Fatiha leans to Dija's shoulder and whispers. Khadija is still at the wall.
      [B(182), (c, lt, p) => {
        const cam = K.camera(c, p, { x: -50, y: 0, z: 1.04 }, { x: 20, y: 0, z: 1.1 });
        cam.layer(0, c2 => hot(c2, lt, { shade: 0.3 }));
        cam.layer(0.5, c2 => K.woman(c2, 1140, 560, 0.85, { ...BG_W, t: lt }));
        cam.layer(1, c2 => {
          K.woman(c2, 230, 560, 0.95, { ...KHA, t: lt });
          K.woman(c2, 600, 575, 1.0, { ...FAT, pose: 'bend', t: lt });
          K.woman(c2, 800, 580, 1.2, { ...DIJA, pose: 'sit', t: lt });
          K.glow(c2, 650, 330, 110, '#f3ead6', 0.18);     // breath in the cold air of the steam
        });
        cam.layer(1, c2 => K.steam(c2, lt, 0.8, 9));
      }],

      // Shot 4: Khadija's back comes off the wall, one centimetre. Profile.
      [B(184), (c, lt, p) => {
        const k = K.ease(K.clamp(lt / 6));
        const cam = K.camera(c, p, { x: -20, y: 0, z: 1.0 }, { x: 10, y: 0, z: 1.08 });
        cam.layer(0, c2 => hot(c2, lt, { shade: 0.35 }));
        cam.layer(0.6, c2 => { c2.fillStyle = '#1a2526'; c2.fillRect(-W, -H, 470 + W, H * 3); });
        cam.layer(1, c2 => {
          const off = 14 * k;
          c2.fillStyle = 'rgba(0,0,0,0.5)'; c2.fillRect(470, -H, 16 + off, H * 3);
          K.profile(c2, 600 + off, 350, 0.95, { color: '#2a2230', scarf: null, earring: true, rim: C.lamp, t: lt });
        });
        K.particles(c, lt, { n: 30, color: 'rgba(240,245,240,0.25)', rise: 5 });
      }],

      // Shot 5: the round woman answers yes without turning. Seen from behind.
      [B(185), (c, lt, p) => {
        const cam = K.camera(c, p, { x: 0, y: 0, z: 1.0 }, { x: 0, y: -12, z: 1.06 });
        cam.layer(0, c2 => hot(c2, lt, { shade: 0.3 }));
        cam.layer(0.5, c2 => {
          K.woman(c2, 260, 560, 0.75, { ...BG_W, t: lt });
          K.woman(c2, 1060, 560, 0.75, { ...BG_W, t: lt, width: 0.9 });
        });
        cam.layer(1, c2 => {
          K.woman(c2, 220, 560, 0.9, { ...KHA, t: lt });
          K.woman(c2, 1000, 575, 0.9, { ...FAT, t: lt });
          K.woman(c2, 640, 560, 1.5, { ...DIJA, pose: 'sit', t: lt });
        });
        cam.layer(1.4, c2 => K.steam(c2, lt, 0.8, 4));
      }],

      // Shot 6: Khadija's inner moment, profile, eyes closed. Her thumb on the earring.
      [B(187), (c, lt, p) => {
        const cam = K.camera(c, p, { x: 30, y: 0, z: 1.0 }, { x: -10, y: 0, z: 1.12 });
        cam.layer(0, c2 => hot(c2, lt, { shade: 0.4 }));
        cam.layer(1, c2 => {
          K.profile(c2, 620, 330, 0.95, { color: '#2a2230', scarf: null, earring: true, eyes: 'closed', rim: C.lamp, t: lt, tilt: 0.04 });
          K.glow(c2, 630, 374, 26, C.gold, 0.25 + 0.15 * Math.sin(lt * 2));
        });
        K.particles(c, lt, { n: 30, color: 'rgba(240,245,240,0.25)', rise: 5 });
      }],

      // Shot 7: the cashier's carnet in the night flashback, with a coin in the fist.
      [B(188), (c, lt, p) => {
        K.sky(c, 'night');
        const cam = K.camera(c, p, { x: 0, y: 0, z: 1.0 }, { x: 0, y: -10, z: 1.06 });
        cam.layer(0, c2 => K.bulb(c2, 1010, 0, lt, 170));
        cam.layer(1, c2 => {
          K.notebook(c2, 640, 260, 1.2, 6, lt, K.ramp(lt, 0.4, 3.5));
          K.hand(c2, 640, 560, 0.8, '#8a5a3c', 0);
          K.coin(c2, 640, 440, 16, lt, 0);
        });
        K.particles(c, lt, NIGHT_DUST);
      }],

      // Shot 8: the coin slides across the till counter, brisk.
      [B(189), (c, lt, p) => {
        K.sky(c, 'night');
        const cam = K.camera(c, p, { x: -20, y: 0, z: 1.0 }, { x: 20, y: 0, z: 1.06 });
        cam.layer(0, c2 => K.bulb(c2, 960, 0, lt, 170));
        cam.layer(1, c2 => {
          K.till(c2, 640, 500, 1.1, '', lt);             // counter top sits at y = 434
          const k = K.ease(K.clamp(lt / 2.6));
          const cx = K.lerp(900, 380, k);
          c2.strokeStyle = 'rgba(230,230,220,0.35)'; c2.lineWidth = 1.5;
          if (k > 0 && k < 1) for (let i = 0; i < 4; i++) {
            c2.beginPath(); c2.moveTo(cx + 20 + i * 14, 428); c2.lineTo(cx + 30 + i * 14, 426); c2.stroke();
          }
          K.coin(c2, cx, 418, 16, lt, 0);
          K.coin(c2, 300, 418, 16, lt, 0);               // the one already counted
        });
        K.particles(c, lt, NIGHT_DUST);
      }],

      // Shot 9: the mitt stops. The round woman begins to turn on the marble.
      [B(190), (c, lt, p) => {
        const turn = K.ease(K.clamp((t - B(191)) / (B(192) - B(191))));
        const cam = K.camera(c, p, { x: 0, y: 0, z: 1.0 }, { x: -20, y: -6, z: 1.07 });
        cam.layer(0, c2 => hot(c2, lt, { shade: 0.35 }));
        cam.layer(1, c2 => {
          c2.fillStyle = '#b9c3c0'; c2.fillRect(430, 470, 640, 34);   // marble slab
          c2.fillStyle = '#7f8c8a'; c2.fillRect(430, 504, 640, 18);
          K.woman(c2, 380, 575, 1.0, { ...FAT, arm: 0.85, t: lt });   // mitt held still
          K.hand(c2, 499, 384, 0.8, '#0c0c0f', Math.PI / 2);
          c2.save(); c2.translate(780, 500); c2.rotate(0.16 * turn);  // left shoulder comes first
          K.woman(c2, 0, 0, 1.25, { ...DIJA, pose: 'sit', t: lt });
          c2.restore();
        });
        cam.layer(1, c2 => K.steam(c2, lt, 0.6, 8));
      }],

      // Shot 10: Khadija's eyes climb from her feet and bag, past the turning woman, to the clock.
      [B(192), (c, lt, p) => {
        const turn = 0.16;
        const cam = K.camera(c, p, { x: 0, y: 270, z: 1.0 }, { x: 0, y: 0, z: 1.0 });
        cam.layer(1, c2 => {
          c2.fillStyle = K.vgrad(c2, -300, 720, ['#1a2526', '#2e3f41', '#3e5355']);
          c2.fillRect(-W, -H * 2, W * 3, H * 5);
          K.zellige(c2, 60, 300, W - 120, 52, 30, ['#2f5e63', '#4a6264', '#1d3a3d'], lt);
          K.door(c2, 520, 560, 240, 380, 0, '#3a2a22');
          K.bundle(c2, 330, 560, 0.9, '#7a4a6a');        // her bag
          K.shoePair(c2, 150, 566, 0.8, 'sandal');       // her sandals
          K.woman(c2, 200, 560, 0.95, { ...KHA, t: lt });
          c2.save(); c2.translate(700, 560); c2.rotate(turn);
          K.woman(c2, 0, 0, 1.3, { ...DIJA, pose: 'sit', t: lt });
          c2.restore();
          K.steam(c2, lt, 0.9, 13);
          dim(c2, 0.15);
          clock(c2, 640, 120, 46, 5.4, 0.94);            // the only sharp thing
        });
      }],

      // Shot 11: the clock, close, holds to the end.
      [B(193), (c, lt, p) => {
        const cam = K.camera(c, p, { x: 0, y: 0, z: 1.0 }, { x: 0, y: -30, z: 1.12 });
        cam.layer(0, c2 => {
          c2.fillStyle = K.vgrad(c2, 0, H, ['#0e1415', '#1c2a2b', '#2a3a3b']);
          c2.fillRect(-W, -H, W * 3, H * 3);
        });
        cam.layer(1, c2 => {
          K.steam(c2, lt, 0.7, 21);
          clock(c2, 640, 330, 150, 5.4, 0.94);
        });
      }],
    ];

    K.shots(ctx, t, dur, shotsList);
    K.finish(ctx, t);
    K.fadeEdges(ctx, t, dur, 0.6, 0.6);
  },
});
