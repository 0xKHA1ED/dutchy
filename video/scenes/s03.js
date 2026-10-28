// Scene s03: chapter 1, the changing room. The door closes behind Khadija, she sets
// her sandals beside the ballet flats with the same buckle, a memory of the box under
// the bed, the lost-property nail, undressing, and a nod at the mirror.
// Shots: entrance -> changing room -> shoes -> buckle -> memory -> reception ->
// nail and receipt -> undressing -> mirror -> nod.
SCENE({
  draw(ctx, t, dur, B) {
    const K = KIT, C = K.C, W = K.W, H = K.H;

    // Hammam interior: tiled wall, zellige band, wet tiled floor, skylight and steam.
    const room = (c, lt, lamp = 0.18) => {
      K.sky(c, 'hammam');
      c.fillStyle = K.vgrad(c, 0, 380, ['#2f4649', '#4f6a68']); c.fillRect(-W, 0, W * 3, 380);
      K.zellige(c, -40, 60, W + 80, 80, 36, ['#2f5e63', '#8fa7a4', '#3d5558'], lt);
      K.tileFloor(c, 380, C.tile, 'rgba(0,0,0,0.18)', lt);
      K.lightPool(c, W / 2, 120, 520, 240, lamp, '#fff6dc');
    };
    // Memory room: dark, with a single warm bulb (flashback mood).
    const night = (c, lt) => {
      K.sky(c, 'night');
      c.fillStyle = K.vgrad(c, 380, H, ['#1a1f2a', '#0b0d12']); c.fillRect(-W, 380, W * 3, H);
      K.particles(c, lt, { n: 30, color: K.MOODS.night.dust, rise: 6 });
    };

    K.shots(ctx, t, dur, [
      // 0: Khadija comes in through the heavy door, which swings shut behind her.
      [0, (c, lt, p) => {
        room(c, lt, 0.12);
        const cam = K.camera(c, p, { x: 0, y: 0, z: 1 }, { x: 0, y: -10, z: 1.06 });
        cam.layer(0.6, c2 => K.door(c2, 560, 430, 160, 240, 0.75 * (1 - K.ease(lt / 6.5)), '#4a2e20'));
        cam.layer(1, c2 => {
          K.slipper(c2, 800, 640, 0.8, '#3f7fbf', -0.1);
          K.woman(c2, 640, lerp480(lt), lerpS(lt), { color: '#2a2230', scarf: '#6b3b4f', width: 1.1, earring: true, pose: 'walk', t: lt });
        });
        cam.layer(1.4, c2 => K.particles(c2, lt, { n: 30, color: K.MOODS.hammam.dust, rise: 6 }));
      }],

      // 1: The changing room, wide. Benches, knotted clothes, slippers in a crooked line.
      [B(28), (c, lt, p) => {
        room(c, lt);
        const cam = K.camera(c, p, { x: -40, y: 0, z: 1 }, { x: 40, y: 0, z: 1.08 });
        cam.layer(0.4, c2 => {
          K.bench(c2, 60, 430, 520, C.umber);
          K.bench(c2, 700, 430, 520, C.umber);
        });
        cam.layer(0.8, c2 => {
          K.bundle(c2, 200, 436, 1, '#7a4a6a');
          K.bundle(c2, 440, 436, 0.9, '#3f6d7a');
          K.bundle(c2, 860, 436, 1, '#8b3d3a');
          K.bundle(c2, 1060, 436, 0.8, '#5a6a3a');
        });
        cam.layer(1, c2 => {
          K.cut(c2, '#b09070', cc => { cc.beginPath(); cc.rect(170, 560, 400, 110); }, 4); // flattened cardboard
          K.slipper(c2, 230, 600, 0.9, '#c4473f', -0.05);
          K.slipper(c2, 330, 592, 0.9, '#3f7fbf', 0.04);
          K.slipper(c2, 440, 604, 0.9, '#c4473f', -0.03);
          K.shoePair(c2, 640, 690, 1.25, 'sandal', { color: '#3a3430' });
          K.shoePair(c2, 900, 690, 1.25, 'ballet', { color: '#3a3430' });
          K.woman(c2, 1120, 690, 1.0, { color: '#2a2230', scarf: '#6b3b4f', width: 1.1, earring: true, t: lt });
        });
        cam.layer(1.4, c2 => K.particles(c2, lt, { n: 30, color: K.MOODS.hammam.dust, rise: 6 }));
      }],

      // 2: Close on the two pairs of shoes: pharmacy sandals and ballet flats with heels stacked.
      [B(28) + 10, (c, lt, p) => {
        K.sky(c, 'hammam');
        K.tileFloor(c, 300, C.tile, 'rgba(0,0,0,0.18)', lt);
        const cam = K.camera(c, p, { x: -20, y: 0, z: 1 }, { x: 30, y: -10, z: 1.12 });
        cam.layer(0.3, c2 => K.steam(c2, lt, 0.5, 5));
        cam.layer(1, c2 => {
          K.shoePair(c2, 330, 500, 2.3, 'sandal', { color: '#3a3430' });
          K.shoePair(c2, 800, 500, 2.3, 'ballet', { color: '#3a3430' });
        });
        cam.layer(1.3, c2 => K.particles(c2, lt, { n: 24, color: K.MOODS.hammam.dust, rise: 5 }));
      }],

      // 3: The buckle. "The same buckle as mine."
      [B(29), (c, lt, p) => {
        K.sky(c, 'hammam');
        K.tileFloor(c, 360, C.tile, 'rgba(0,0,0,0.18)', lt);
        const cam = K.camera(c, p, { x: 0, y: 0, z: 1 }, { x: -10, y: 0, z: 1.15 });
        cam.layer(0.8, c2 => { c2.fillStyle = 'rgba(0,0,0,0.35)'; c2.fillRect(-W, -H, W * 3, H * 3); });
        cam.layer(1, c2 => K.shoePair(c2, 640, 460, 3.6, 'ballet', { color: '#3a3430' }));
        cam.layer(1.25, c2 => K.shoePair(c2, 200, 620, 1.2, 'sandal', { color: '#3a3430' }));
      }],

      // 4: Memory, night mood, a bulb swaying. The new flats still in their paper, under the bed.
      [B(31), (c, lt, p) => {
        night(c, lt);
        const cam = K.camera(c, p, { x: 0, y: 0, z: 1 }, { x: 0, y: -20, z: 1.1 });
        cam.layer(1, c2 => {
          K.paper(c2, 640, 500, 1.2, 0, '#f4efe2', 0.02); // the box, still wrapped
          K.cut(c2, '#3b2a22', cc => {
            cc.beginPath(); cc.rect(260, 400, 760, 60); cc.rect(260, 460, 30, 80); cc.rect(990, 460, 30, 80);
          }, 6); // bed frame
        });
        cam.layer(0.5, c2 => K.bulb(c2, 640, 130, lt, 160));
        cam.layer(1.3, c2 => K.particles(c2, lt, { n: 20, color: K.MOODS.night.dust, rise: 4 }));
      }],

      // 5: The reception desk. The attendant sits high; the coin drops into the biscuit tin.
      [B(32), (c, lt, p) => {
        room(c, lt, 0.2);
        const cam = K.camera(c, p, { x: -30, y: 0, z: 1 }, { x: 20, y: 0, z: 1.08 });
        cam.layer(1, c2 => {
          K.cut(c2, '#4a3b30', cc => { cc.beginPath(); cc.roundRect(880, 470, 320, 260, 8); }, 6); // raised desk
          K.cut(c2, C.red, cc => { cc.beginPath(); cc.roundRect(900, 420, 60, 50, 6); }, 4); // biscuit tin
          K.woman(c2, 1030, 470, 1.1, { color: '#221c1a', scarf: '#7a2f2a', width: 1.05, pose: 'sit', t: lt });
          if (lt > 4 && lt < 5.8) {
            const k = K.easeIn(K.clamp((lt - 4) / 1.5));
            K.coin(c2, 930, K.lerp(230, 404, k), 14, lt, 3);
          }
          K.woman(c2, 620, 700, 1.0, { color: '#2a2230', scarf: '#6b3b4f', width: 1.1, earring: true, t: lt, arm: 0.35 });
        });
        cam.layer(1.4, c2 => K.particles(c2, lt, { n: 24, color: K.MOODS.hammam.dust, rise: 6 }));
      }],

      // 6: Lost property on a nail (none of the earrings gold). The receipt folds in four.
      [B(32) + 10, (c, lt, p) => {
        room(c, lt, 0.12);
        const cam = K.camera(c, p, { x: 0, y: 0, z: 1 }, { x: 20, y: -20, z: 1.1 });
        cam.layer(0.8, c2 => {
          K.cut(c2, '#5b5f66', cc => { cc.beginPath(); cc.roundRect(630, 118, 18, 20, 4); }, 3); // nail
          c2.strokeStyle = '#b8433a'; c2.lineWidth = 2.5; // red thread
          c2.beginPath(); c2.moveTo(700, 136); c2.lineTo(702, 262); c2.stroke();
          K.cut(c2, '#c46a8f', cc => { cc.beginPath(); cc.roundRect(580, 150, 44, 96, 16); }, 3); // child's sock
          K.cut(c2, '#b8b2a0', cc => { cc.beginPath(); cc.ellipse(702, 276, 10, 16, 0.2, 0, 7); }, 2); // key
          c2.strokeStyle = '#c9ccd0'; c2.lineWidth = 3; // three single earrings on a string
          c2.beginPath(); c2.moveTo(770, 150); c2.quadraticCurveTo(830, 170, 890, 150); c2.stroke();
          [784, 830, 876].forEach(x => { c2.beginPath(); c2.arc(x, 186, 9, 0, 7); c2.stroke(); });
        });
        cam.layer(1, c2 => {
          K.paper(c2, 900, 560, 1.4, 2 * K.ease(K.clamp((lt - 3) / 6)), '#f4efe2', 0.1);
          K.woman(c2, 360, 700, 1.0, { color: '#2a2230', scarf: '#6b3b4f', width: 1.1, earring: true, t: lt, arm: 0.2 + 0.4 * K.ease(lt / 12) });
        });
      }],

      // 7: Undressing. Towel on the shoulders, arm up to the knot of the headscarf.
      [B(32) + 22, (c, lt, p) => {
        room(c, lt, 0.2);
        const cam = K.camera(c, p, { x: 0, y: 0, z: 1 }, { x: 0, y: -10, z: 1.1 });
        cam.layer(1, c2 => {
          K.woman(c2, 640, 700, 1.25, { color: '#2a2230', robe: 'towel', towel: '#d8cbb4', scarf: '#6b3b4f', width: 1.1, t: lt, arm: 0.2 + 0.7 * K.ease(lt / 8) });
        });
        cam.layer(1.4, c2 => K.particles(c2, lt, { n: 20, color: K.MOODS.hammam.dust, rise: 5 }));
      }],

      // 8: The small mirror hung high for headscarves. Scarf off, she looks as far as the shoulders.
      [B(32) + 31, (c, lt, p) => {
        room(c, lt, 0.2);
        const cam = K.camera(c, p, { x: 0, y: 0, z: 1 }, { x: -20, y: -10, z: 1.06 });
        cam.layer(0.7, c2 => {
          K.cut(c2, '#3b3f48', cc => { cc.beginPath(); cc.roundRect(850, 130, 120, 160, 10); }, 4);
          const g = c2.createLinearGradient(860, 140, 960, 280);
          g.addColorStop(0, 'rgba(220,235,240,0.55)'); g.addColorStop(0.5, 'rgba(120,140,150,0.35)'); g.addColorStop(1, 'rgba(220,235,240,0.15)');
          c2.fillStyle = g; c2.fillRect(862, 142, 96, 136);
          K.glow(c2, 910, 210, 200, '#e8f0f0', 0.15);
        });
        cam.layer(1, c2 => K.profile(c2, 560, 470, 0.7, { color: '#1f1b26', scarf: null, earring: true, rim: C.lamp, t: lt, tilt: 0.05 }));
      }],

      // 9: A slow nod, then "Sixty-three years old." Close on the profile to the end.
      [B(32) + 45, (c, lt, p) => {
        room(c, lt, 0.22);
        const nod = K.ramp(t, B.end(32) - 3, B.end(32) - 1);
        const back = K.ramp(t, B(33) + 0.4, B(33) + 1.6);
        const tilt = 0.14 * nod - 0.05 * back;
        const cam = K.camera(c, p, { x: -40, y: -20, z: 1 }, { x: -20, y: -30, z: 1.2 });
        cam.layer(0.6, c2 => K.glow(c2, 880, 220, 260, '#e8f0f0', 0.12));
        cam.layer(1, c2 => K.profile(c2, 580, 470, 1.0, { color: '#1f1b26', scarf: null, earring: true, rim: C.lamp, t: lt, tilt }));
      }],
    ]);

    K.finish(ctx, t);
    K.fadeEdges(ctx, t, dur, 0.6, 0.6);

    // Helpers used by shot 0 (door entrance): she walks out of the doorway towards the viewer.
    function lerp480(lt) { return KIT.lerp(440, 660, KIT.ease(lt / 7)); }
    function lerpS(lt) { return KIT.lerp(0.5, 0.95, KIT.ease(lt / 7)); }
  },
});
