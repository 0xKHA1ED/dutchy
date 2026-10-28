// Scene s12: chapter 3, the hot room. Khadija is joined on the bench by the bucket woman,
// who asks her a question. Behind them the thin woman scrubs the round woman on the marble.
SCENE({
  draw(ctx, t, dur, B) {
    const K = KIT, C = K.C, W = K.W, H = K.H;
    const span = id => B.end(id) - B(id);
    const prog = (a, b) => K.clamp((t - a) / (b - a));

    // Hot-room backdrop: warm sky, arched wall, marble floor.
    const backdrop = cam => {
      cam.layer(0, c => {
        K.sky(c, 'warm');
        K.glow(c, 640, 130, 560, C.lamp, 0.35);
        K.archWall(c, '#3b2a22', [[90, 480, 230, 380], [525, 480, 230, 420], [960, 480, 230, 380]], 0, 480);
        c.fillStyle = 'rgba(10,6,4,0.42)'; c.fillRect(-W, -H, W * 3, H * 3);
      });
      cam.layer(0.6, c => {
        c.fillStyle = K.vgrad(c, 470, H, ['#a8704c', '#4e3324']);
        c.fillRect(-W, 470, W * 3, H);
        c.strokeStyle = 'rgba(0,0,0,0.14)'; c.lineWidth = 2;
        for (let i = 1; i < 7; i++) { c.beginPath(); c.moveTo(-W, 470 + i * i * 5); c.lineTo(2 * W, 470 + i * i * 5); c.stroke(); }
      });
    };

    // The thin scrubber, standing, arm reaching right. Draws the black mitt at the arm's end.
    const fatiha = (c, x, y, s, ar, tt) => {
      K.woman(c, x, y, s, { color: '#1d2a2c', scarf: null, robe: 'towel', towel: '#9fb4c2', width: 0.8, arm: ar, t: tt });
      const th = -0.25 - ar * 1.6, L = 92, ox = 21.76;
      const mx = x + s * (ox - L * Math.sin(th)), my = y + s * (-188 + L * Math.cos(th));
      c.fillStyle = '#0c0c0f'; c.beginPath(); c.ellipse(mx, my, 15 * s, 19 * s, th, 0, 7); c.fill();
      c.strokeStyle = 'rgba(159,180,194,0.45)'; c.lineWidth = 2; c.stroke();
    };

    // The round woman lying face down on the marble, head to the right, towel from hip to knee.
    const lying = (c, x, y, tt, fat = 1, bob = 0) => {
      const br = Math.sin(tt * 1.4) * 1.5 + bob;
      c.save(); c.translate(x, y);
      c.fillStyle = 'rgba(0,0,0,0.3)'; c.beginPath(); c.ellipse(10, 4, 280, 16, 0, 0, 7); c.fill();
      c.fillStyle = '#2b2321';
      c.beginPath(); c.ellipse(0, -66 * fat - br, 200, 66 * fat, 0, 0, 7); c.fill();
      c.beginPath(); c.ellipse(226, -70 * fat - br * 1.4, 46, 42, 0, 0, 7); c.fill();
      c.save(); c.beginPath(); c.ellipse(0, -66 * fat - br, 200, 66 * fat, 0, 0, 7); c.clip();
      c.fillStyle = '#c9875a'; c.fillRect(-150, -140, 150, 160);
      c.fillStyle = 'rgba(0,0,0,0.14)'; for (let k = 0; k < 3; k++) c.fillRect(-150, -110 + k * 34, 150, 4);
      c.restore();
      c.restore();
    };

    // Khadija, seated, in her towel, earring showing.
    const khadija = (c, x, y, tt) => K.woman(c, x, y, 1, { color: '#2a2230', scarf: null, robe: 'towel', towel: '#d8cbb4', pose: 'sit', width: 1.0, earring: true, t: tt });
    // The bucket woman (Souad) in her headscarf.
    const souad = (c, x, y, pose, tt) => K.woman(c, x, y, 1, { color: '#221c1a', scarf: '#7a2f2a', width: 1.05, pose, t: tt });

    // Hand seen from above, fingers spread; one finger shorter (index 2).
    const hand5 = (c, x, y, s, col, short = 2) => {
      c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = col;
      c.beginPath(); c.roundRect(-60, -10, 120, 80, 44); c.fill();
      for (let i = 0; i < 4; i++) {
        const len = i === short ? 36 : 84 - Math.abs(i - 1.5) * 9;
        c.beginPath(); c.roundRect(-52 + i * 28, -10 - len, 22, len + 20, 11); c.fill();
      }
      c.beginPath(); c.roundRect(42, 0, 26, 60, 13); c.fill();
      c.restore();
    };
    // Closed fist, seen from above.
    const fist = (c, x, y, s, col) => {
      c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = col;
      c.beginPath(); c.roundRect(-60, -40, 120, 90, 34); c.fill();
      for (let i = 0; i < 4; i++) { c.beginPath(); c.roundRect(-54 + i * 27, -62, 24, 34, 12); c.fill(); }
      c.beginPath(); c.roundRect(44, -30, 24, 50, 12); c.fill();
      c.restore();
    };

    // Round woman's left-hip mitt progress: the mitt goes from the shoulder down to the hip.
    const mittT = K.ease(prog(B(175), B.end(175)));

    const shots = [
      // 0: wide hot room. The bag on its dry step, the drop falling on the slipper.
      [0, B(158), (c, lt, L) => {
        const cam = K.camera(c, lt / L, { x: -30, y: 0, z: 1 }, { x: 40, y: -10, z: 1.06 });
        backdrop(cam);
        cam.layer(0.8, c2 => {
          c2.fillStyle = '#7d5a40'; c2.fillRect(60, 620, 380, 120);
          K.bundle(c2, 230, 620, 1.0, '#6b3b4f');
          K.slipper(c2, 340, 640, 1, '#c4473f', 0.1);
          for (let k = 0; k < 3; k++) K.drop(c2, lt, 340, 250, 628, 1.6 + k * 3.1, 2.7 + k * 3.1);
        });
        cam.layer(1.0, c2 => { fatiha(c2, 560, 700, 1.0, 0.3, t); lying(c2, 820, 640, t, 1.25); });
        cam.layer(1.6, c2 => K.steam(c2, t, 0.6, 5));
      }],

      // 1: Khadija on the bench. The bucket woman sits beside her, bucket at the foot, hand on the knee.
      [B(158), B(159), (c, lt, L) => {
        const cam = K.camera(c, lt / L, { x: 0, y: 0, z: 1.0 }, { x: -20, y: 0, z: 1.05 });
        backdrop(cam);
        cam.layer(1, c2 => {
          K.bench(c2, 330, 600, 560, '#4e3324');
          khadija(c2, 500, 600, t);
          souad(c2, 800, 600, 'sit', t);
          K.bucket(c2, 690, 690, 0.9, '#3f7fa8', 0);
          hand5(c2, 548, 548, 0.55, '#221c1a', 1);
        });
        cam.layer(1.4, c2 => K.steam(c2, t, 0.8, 9));
      }],

      // 2: the bucket woman, close in profile, speaking low.
      [B(159), B(162), (c, lt, L) => {
        const cam = K.camera(c, lt / L, { x: 0, y: 0, z: 1 }, { x: -30, y: -10, z: 1.15 });
        cam.layer(0, c2 => { K.sky(c2, 'warm'); K.glow(c2, 360, 160, 420, C.lamp, 0.3); });
        cam.layer(1, c2 => K.profile(c2, 760, 420, 1.15, { color: '#221c1a', scarf: '#7a2f2a', rim: C.amber, facing: -1, t, tilt: 0.06 }));
        cam.layer(1.4, c2 => K.steam(c2, t, 0.7, 11));
      }],

      // 3: Khadija in profile: "twenty-six minutes", not an hour.
      [B(162), B(165), (c, lt, L) => {
        const cam = K.camera(c, lt / L, { x: 0, y: 0, z: 1 }, { x: 20, y: 0, z: 1.08 });
        cam.layer(0, c2 => { K.sky(c2, 'warm'); K.glow(c2, 900, 200, 300, C.lamp, 0.3); });
        cam.layer(1, c2 => K.profile(c2, 640, 430, 1.2, { color: '#2a2230', scarf: null, earring: true, rim: C.lamp, t, tilt: 0.04 }));
        cam.layer(1.4, c2 => K.steam(c2, t, 0.8, 13));
      }],

      // 4: wide hot room; a laugh in the steam; the camera pushes toward the scrubbing hand.
      [B(165), B(167), (c, lt, L) => {
        const cam = K.camera(c, lt / L, { x: 0, y: 0, z: 1 }, { x: 60, y: 150, z: 1.5 });
        backdrop(cam);
        cam.layer(1, c2 => {
          fatiha(c2, 560, 700, 1.0, 0.3, t);
          lying(c2, 820, 640, t, 1.25, Math.max(0, Math.sin(t * 2.2)) * 3);
        });
        cam.layer(1.4, c2 => K.steam(c2, t, 0.6, 3));
      }],

      // 5: close on the fingers on the knee; one finger is shorter. The scarf knot with two dirhams.
      [B(167), B(169), (c, lt, L) => {
        const cam = K.camera(c, lt / L, { x: -60, y: 0, z: 1.25 }, { x: 160, y: -20, z: 1.35 });
        backdrop(cam);
        cam.layer(1, c2 => {
          c2.fillStyle = '#2b2321'; c2.beginPath(); c2.ellipse(600, 620, 260, 190, 0, 0, 7); c2.fill();
          c2.strokeStyle = K.withAlpha(C.lamp, 0.5); c2.lineWidth = 4; c2.beginPath(); c2.ellipse(600, 620, 258, 188, 0, 3.5, 4.8); c2.stroke();
          hand5(c2, 600, 470, 1.7, '#1d2a2c', 2);
          // headscarf knot on the step, with two coins in it
          K.cut(c2, '#2f5e63', c3 => { c3.beginPath(); c3.ellipse(1010, 580, 130, 60, 0, 0, 7); });
          c2.fillStyle = '#26504f'; c2.beginPath(); c2.ellipse(1010, 520, 42, 34, 0, 0, 7); c2.fill();
          K.coin(c2, 990, 506, 16, t, 0);
          K.coin(c2, 1034, 512, 16, t, 0);
        });
        cam.layer(1.4, c2 => K.steam(c2, t, 0.8, 17));
      }],

      // 6: Khadija in profile, silent. The tap climbs toward its high note, the drop falls once more.
      [B(169), B(170), (c, lt, L) => {
        const cam = K.camera(c, lt / L, { x: 0, y: 0, z: 1 }, { x: -40, y: -20, z: 1.12 });
        backdrop(cam);
        cam.layer(1, c2 => {
          K.profile(c2, 520, 430, 1.2, { color: '#2a2230', scarf: null, earring: true, rim: C.lamp, t, tilt: 0.05 });
          K.tap(c2, 1000, 300, 1.3, 0.3 + 0.7 * K.ease(lt / L), t);
          for (let k = 0; k < 4; k++) K.drop(c2, lt, 1031, 360, 560, 2.0 + k * 2.6, 3.2 + k * 2.6);
        });
        cam.layer(1.4, c2 => K.steam(c2, t, 0.9, 19));
      }],

      // 7: the bucket woman stands up, and walks off with her bucket into the steam.
      [B(170), B(174), (c, lt, L) => {
        const cam = K.camera(c, lt / L, { x: 0, y: 0, z: 1 }, { x: 30, y: 0, z: 1.05 });
        backdrop(cam);
        const sx = K.lerp(560, 860, K.ease(lt / L));
        cam.layer(1, c2 => {
          K.bench(c2, 230, 600, 400, '#4e3324');
          khadija(c2, 360, 600, t);
          K.bucket(c2, sx + 60, 690, 0.8, '#3f7fa8', 0);
          souad(c2, sx, 600, 'stand', t);
        });
        cam.layer(1.4, c2 => K.steam(c2, t, 0.6, 21));
      }],

      // 8: Khadija's hand closes on her knee out of habit; the bucket is far off in the steam.
      [B(174), B(175), (c, lt, L) => {
        const cam = K.camera(c, lt / L, { x: 0, y: 0, z: 1 }, { x: 40, y: 10, z: 1.1 });
        backdrop(cam);
        const bx = K.lerp(860, 1150, K.ease(lt / L));
        cam.layer(0.8, c2 => K.bucket(c2, bx, 420, 0.35, '#3f7fa8', 0));
        cam.layer(1, c2 => {
          c2.fillStyle = '#2a2230'; c2.beginPath(); c2.ellipse(600, 650, 300, 190, 0, 0, 7); c2.fill();
          fist(c2, 600, 470, 1.7, '#2a2230');
        });
        cam.layer(1.4, c2 => K.steam(c2, t, 0.6, 23));
      }],

      // 9: the mitt goes down toward the left hip while the round woman sings low.
      [B(175), B(175) + span(175) * 0.5, (c, lt, L) => {
        const cam = K.camera(c, lt / L, { x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: 1.02 });
        backdrop(cam);
        cam.layer(1, c2 => {
          fatiha(c2, 560, 700, 1.0, K.lerp(0.9, 0.3, mittT), t);
          lying(c2, 820, 640, t, 1.25, Math.sin(t * 5) * 1.0);
        });
        cam.layer(1.4, c2 => K.steam(c2, t, 0.6, 25));
      }],

      // 10: the mitt reaches the hip; she sings louder and claps once over her head.
      [B(175) + span(175) * 0.5, B(176), (c, lt, L) => {
        const cam = K.camera(c, lt / L, { x: 0, y: 0, z: 1.05 }, { x: 60, y: 40, z: 1.25 });
        backdrop(cam);
        cam.layer(1, c2 => {
          fatiha(c2, 560, 700, 1.0, K.lerp(0.9, 0.3, mittT), t);
          lying(c2, 820, 640, t, 1.25, Math.sin(t * 5) * 1.2);
          // the clap, just before "Ah! There"
          const clap = B.end(175) - 1.0, hx = 1052, hy = 470;
          const k = K.clamp((t - clap + 0.4) / 0.4);
          const d = 70 * (1 - K.easeOut(k));
          c2.fillStyle = '#2b2321';
          c2.beginPath(); c2.ellipse(hx - d, hy, 26, 16, -0.3, 0, 7); c2.fill();
          c2.beginPath(); c2.ellipse(hx + d, hy, 26, 16, 0.3, 0, 7); c2.fill();
          K.glow(c2, hx, hy, 120, C.lamp, 0.5 * K.pulse(t, clap, clap + 0.8, 0.2));
        });
        cam.layer(1.4, c2 => K.steam(c2, t, 0.6, 27));
      }],

      // 11: "Ah! There." The round woman laughs. Then the bill: a memory cut to the cashier's notebook.
      [B(176), dur, (c, lt, L) => {
        const cam = K.camera(c, lt / L, { x: 0, y: 0, z: 1 }, { x: -20, y: 0, z: 1.05 });
        backdrop(cam);
        cam.layer(1, c2 => {
          fatiha(c2, 560, 700, 1.0, K.lerp(0.3, 0.7, K.ease(lt / 2)), t);
          lying(c2, 820, 640, t, 1.25, Math.max(0, Math.sin(t * 4)) * 6);
        });
        cam.layer(1.4, c2 => K.steam(c2, t, 0.6, 29));
        const a = K.ramp(t, B(178) - 0.3, B(178) + 0.9);
        if (a > 0) {
          c.save(); c.globalAlpha = a;
          K.sky(c, 'night');
          K.bulb(c, 980, 120, t, 140);
          K.notebook(c, 600, 330, 1.5, 6, t, K.ramp(t, B(178) + 0.2, B.end(178)));
          c.restore();
        }
      }],
    ];

    K.shots(ctx, t, dur, shots.map(([a, b, fn]) => [a, (c, lt) => fn(c, lt, b - a)]));
    K.finish(ctx, t);
    K.fadeEdges(ctx, t, dur, 0.6, 0.6);
  },
});
