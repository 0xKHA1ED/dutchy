// Scene s15: chapter 4. The alley past the oven, the mule, the square, the Fiat and the ticket.
// Shots: alley at the oven -> shutter and sleeping cat -> hand on the slick wall -> profile breathing
// -> mule and gas canisters -> sandals and coin -> the square -> profile "Zero" -> Fiat with ticket -> ticket close.
SCENE({
  draw(ctx, t, dur, B) {
    const K = KIT, C = K.C, W = K.W, H = K.H;

    // ---------- local helpers ----------
    // Narrow alley in perspective, vanishing point near (640, 390).
    const alley = (c, wallCol, groundCol, farCol) => {
      c.fillStyle = farCol; c.fillRect(420, 170, 440, 430);
      c.fillStyle = wallCol;
      c.beginPath(); c.moveTo(-300, -200); c.lineTo(420, 170); c.lineTo(420, 600); c.lineTo(-300, 940); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(1580, -200); c.lineTo(860, 170); c.lineTo(860, 600); c.lineTo(1580, 940); c.closePath(); c.fill();
      c.fillStyle = groundCol;
      c.beginPath(); c.moveTo(-300, 940); c.lineTo(420, 600); c.lineTo(860, 600); c.lineTo(1580, 940); c.closePath(); c.fill();
    };
    // Silhouette man. o: color, vest (colour), seated, facing.
    const man = (c, x, y, s, o = {}) => {
      const col = o.color || C.ink;
      c.save(); c.translate(x, y); c.scale(s * (o.facing || 1), s); c.fillStyle = col;
      if (o.seated) {
        c.beginPath(); c.roundRect(-34, -120, 68, 100, 22); c.fill();
        c.beginPath(); c.roundRect(-30, -24, 96, 24, 8); c.fill();
        c.beginPath(); c.roundRect(-30, -24, 22, 60, 8); c.fill();
      } else {
        c.beginPath(); c.roundRect(-34, -200, 68, 200, 26); c.fill();
      }
      if (o.vest) { c.fillStyle = o.vest; c.beginPath(); c.roundRect(-34, o.seated ? -118 : -170, 68, o.seated ? 78 : 90, 14); c.fill(); }
      c.fillStyle = col; c.beginPath(); c.ellipse(0, o.seated ? -150 : -226, 22, 26, 0, 0, 7); c.fill();
      c.restore();
    };
    // Simple café chair.
    const chair = (c, x, y, s = 1, col = '#2e2a28') => {
      c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = col;
      c.fillRect(-30, -44, 60, 7); c.fillRect(-28, -37, 5, 37); c.fillRect(23, -37, 5, 37);
      c.fillRect(-30, -92, 5, 50); c.fillRect(-30, -92, 60, 6);
      c.restore();
    };
    // Round bread with a mark: 0 cross, 1 dot, 2 bottle cap.
    const loaf = (c, x, y, mark) => {
      c.fillStyle = '#c9a77c'; c.beginPath(); c.ellipse(x, y, 26, 13, 0, 0, 7); c.fill();
      c.fillStyle = '#5a3d2b';
      if (mark === 0) { c.fillRect(x - 8, y - 1.5, 16, 3); c.fillRect(x - 1.5, y - 7, 3, 14); }
      else if (mark === 1) { c.beginPath(); c.arc(x, y, 3.5, 0, 7); c.fill(); }
      else { c.fillStyle = '#8a8f96'; c.beginPath(); c.arc(x, y, 6.5, 0, 7); c.fill(); }
    };
    // Wooden board with loaves on top.
    const board = (c, x0, y0, w) => {
      c.fillStyle = '#5a3d2b'; c.fillRect(x0, y0, w, 18); c.fillRect(x0 + 20, y0 + 18, 16, 70); c.fillRect(x0 + w - 36, y0 + 18, 16, 70);
      for (let i = 0; i < 5; i++) { c.save(); c.translate(x0 + 60 + i * (w - 120) / 4, y0 - 4); c.scale(1.6, 1.6); loaf(c, 0, 0, i % 3); c.restore(); }
    };
    // Roll-up shutter. k: 0 closed, 1 fully open (bottom edge retracts upwards).
    const shutter = (c, x, y, w, h, k) => {
      c.fillStyle = '#0a0a0c'; c.fillRect(x, y, w, h);
      const vh = Math.max(0, h * (1 - k));
      c.fillStyle = '#4a525a'; c.fillRect(x, y, w, vh);
      c.fillStyle = 'rgba(0,0,0,0.35)';
      for (let yy = y + 14; yy < y + vh; yy += 14) c.fillRect(x, yy, w, 3);
    };
    // Sleeping cat, curled on a crate.
    const cat = (c, x, y, s = 1) => {
      c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = '#0c0c0f';
      c.beginPath(); c.ellipse(0, 0, 40, 14, 0, 0, 7); c.fill();
      c.beginPath(); c.arc(-34, -6, 12, 0, 7); c.fill();
      c.beginPath(); c.moveTo(-42, -14); c.lineTo(-40, -28); c.lineTo(-32, -17); c.fill();
      c.beginPath(); c.moveTo(-30, -16); c.lineTo(-26, -28); c.lineTo(-20, -12); c.fill();
      c.beginPath(); c.moveTo(30, 4); c.quadraticCurveTo(54, 6, 48, -12); c.lineTo(52, -14); c.quadraticCurveTo(60, 8, 32, 10); c.fill();
      c.restore();
    };
    // Mule with two gas canisters on its back. dir: 1 faces left, -1 faces right.
    const mule = (c, x, y, s, t, dir = 1) => {
      c.save(); c.translate(x, y); c.scale(s * dir, s); c.fillStyle = '#4a3a30';
      c.beginPath(); c.ellipse(0, -120, 120, 46, 0, 0, 7); c.fill();
      c.beginPath(); c.moveTo(-70, -130); c.lineTo(-150, -210); c.lineTo(-175, -190); c.lineTo(-100, -100); c.closePath(); c.fill();
      c.beginPath(); c.ellipse(-168, -196, 34, 28, -0.5, 0, 7); c.fill();
      c.beginPath(); c.moveTo(-186, -218); c.lineTo(-198, -262); c.lineTo(-166, -226); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(-160, -222); c.lineTo(-166, -256); c.lineTo(-146, -228); c.closePath(); c.fill();
      [-90, -45, 40, 85].forEach((x0, i) => {
        const sw = Math.sin(t * 6 + i * Math.PI * 0.5) * 12;
        c.fillRect(x0 - 7, -84, 14, 84); c.fillRect(x0 - 8 + sw, -8, 16, 8);
      });
      [-50, 30].forEach(bx => {
        c.save(); c.translate(bx, -150); c.rotate(Math.sin(t * 11 + bx) * 0.08);
        c.fillStyle = '#8a3b35'; c.beginPath(); c.roundRect(-20, -96, 40, 96, 14); c.fill();
        c.fillStyle = '#c9a77c'; c.fillRect(-10, -108, 20, 14);
        c.restore();
      });
      c.strokeStyle = 'rgba(255,214,154,0.45)'; c.lineWidth = 3; c.beginPath(); c.ellipse(0, -120, 121, 47, 0, -2.6, -0.6); c.stroke();
      c.restore();
    };
    // Old-style paper-cut stone wall with blocks and mortar.
    const stoneWall = (c, col, mortar) => {
      c.fillStyle = col; c.fillRect(-200, -200, 1700, 1100);
      c.fillStyle = mortar;
      for (let r = 0; r < 9; r++) {
        const y = -40 + r * 84;
        c.fillRect(-200, y, 1700, 4);
        for (let k = -2; k < 14; k++) c.fillRect(-200 + k * 150 + (r % 2) * 75, y, 4, 84);
      }
    };

    // ---------- shots ----------
    K.shots(ctx, t, dur, [
      // 1. Alley at the oven: boards of loaves, Khadija passing them.
      [B(205), (c, lt, p) => {
        const cam = K.camera(c, p, { x: -30, y: 0, z: 1.0 }, { x: 40, y: -10, z: 1.08 });
        cam.layer(0, c2 => { K.sky(c2, 'cold'); K.glow(c2, 640, 300, 360, '#cfe3e6', 0.18); });
        cam.layer(0.5, c2 => alley(c2, '#3a4656', '#56656b', '#1b2129'));
        cam.layer(0.7, c2 => K.glow(c2, 60, 470, 240, C.amber, 0.4));
        cam.layer(0.9, c2 => board(c2, -30, 560, 520));
        cam.layer(1.0, c2 => K.woman(c2, lerp(860, 700, p), 650, 0.9, { color: '#2a2230', scarf: '#6b3b4f', width: 1.1, pose: 'walk', t: lt, facing: -1 }));
        cam.layer(1.4, c2 => K.particles(c2, lt, { n: 30, color: K.MOODS.cold.dust, rise: 5 }));
      }],

      // 2. The shutter goes up beside her; a cat sleeps in a crate of mint; she walks past.
      [B(207), (c, lt, p) => {
        const cam = K.camera(c, p, { x: -60, y: 0, z: 1.0 }, { x: 50, y: 0, z: 1.1 });
        cam.layer(0, c2 => K.sky(c2, 'cold'));
        cam.layer(0.5, c2 => {
          alley(c2, '#3a4656', '#56656b', '#1b2129');
          shutter(c2, 880, 300, 240, 290, K.ramp(lt, 0.0, 5.0));
        });
        cam.layer(1.0, c2 => {
          c2.fillStyle = '#5a3d2b'; c2.fillRect(1000, 590, 150, 60);
          c2.fillStyle = '#3f6f4f';
          for (let i = 0; i < 9; i++) { c2.beginPath(); c2.ellipse(1010 + i * 16, 586 + (i % 2) * 4, 7, 4, 0.5, 0, 7); c2.fill(); }
          c2.fillStyle = '#4a2e20'; for (let i = 0; i < 4; i++) c2.fillRect(1000, 600 + i * 14, 150, 3);
          cat(c2, 1075, 578, 1.0);
          K.woman(c2, lerp(300, 820, ease2(p)), 690, 1.0, { color: '#2a2230', scarf: '#6b3b4f', width: 1.1, pose: 'walk', t: lt, facing: 1 });
        });
        cam.layer(1.4, c2 => K.particles(c2, lt, { n: 25, color: K.MOODS.cold.dust, rise: 4 }));
      }],

      // 3. Close on a hand flat against the wall; the cobbles are slick as soap; a sandal steps down.
      [B(209), (c, lt, p) => {
        const cam = K.camera(c, p, { x: 0, y: 0, z: 1.0 }, { x: -20, y: 10, z: 1.12 });
        cam.layer(0, c2 => { K.sky(c2, 'cold'); K.glow(c2, 640, 280, 420, '#cfe3e6', 0.15); });
        cam.layer(0.6, c2 => stoneWall(c2, '#3a4656', 'rgba(0,0,0,0.25)'));
        cam.layer(0.9, c2 => {
          K.hand(c2, 640, 360, 1.6, '#1d1a22', 0);
          c2.fillStyle = '#4d5b61'; c2.fillRect(-200, 560, 1700, 300);
          const r = K.rng(7);
          for (let i = 0; i < 16; i++) {
            const x = r() * 1400 - 60, y = 600 + r() * 110, w = 60 + r() * 120;
            c2.save(); c2.globalCompositeOperation = 'lighter'; c2.fillStyle = 'rgba(200,225,235,0.13)';
            c2.beginPath(); c2.ellipse(x, y, w, 5, 0, 0, 7); c2.fill(); c2.restore();
          }
          K.shoePair(c2, 700, 600, 1.7, 'sandal');
        });
        cam.layer(1.4, c2 => K.particles(c2, lt, { n: 20, color: K.MOODS.cold.dust, rise: 3 }));
      }],

      // 4. Profile: the vest starts at the bottom of the street; out of breath, hoping.
      [B(210), (c, lt, p) => {
        const cam = K.camera(c, p, { x: -20, y: 0, z: 1.0 }, { x: 30, y: 0, z: 1.06 });
        cam.layer(0, c2 => { K.sky(c2, 'cold'); K.glow(c2, 600, 300, 420, '#cfe3e6', 0.22); });
        cam.layer(1.0, c2 => K.profile(c2, 640 + 14 * p, 400, 1.25, { scarf: '#6b3b4f', earring: true, rim: C.lamp, t: lt * 1.3, tilt: 0.04 + 0.04 * p, color: '#2a2230' }));
        cam.layer(1.4, c2 => K.particles(c2, lt, { n: 20, color: K.MOODS.cold.dust, rise: 3 }));
      }],

      // 5. A mule comes down the alley, gas canisters knocking. Khadija presses against the stone.
      [B(215), (c, lt, p) => {
        const cam = K.camera(c, p, { x: -40, y: 0, z: 1.0 }, { x: 40, y: 0, z: 1.08 });
        cam.layer(0, c2 => { K.sky(c2, 'cold'); K.glow(c2, 640, 380, 300, '#cfe3e6', 0.12); });
        cam.layer(0.5, c2 => alley(c2, '#34404d', '#4b5a60', '#151a21'));
        cam.layer(1.0, c2 => K.woman(c2, 170, 650, 0.95, { color: '#2a2230', scarf: '#6b3b4f', width: 1.0, pose: 'stand', t: lt, facing: 1, earring: true }));
        const mp = clamp01((p - 0.08) / 0.72);
        cam.layer(1.0, c2 => man(c2, lerp(1500, -420, mp) + 330, 640, 0.9, { color: '#1d1a22' }));
        cam.layer(1.2, c2 => mule(c2, lerp(1500, -420, mp), 660, 1.15, lt, 1));
        cam.layer(1.4, c2 => K.particles(c2, lt, { n: 25, color: K.MOODS.cold.dust, rise: 4 }));
      }],

      // 6. She sets off again and counts: sandals on the stones, a two-dirham coin turning.
      [B(216), (c, lt, p) => {
        const cam = K.camera(c, p, { x: 0, y: 0, z: 1.05 }, { x: -30, y: -10, z: 1.14 });
        cam.layer(0, c2 => { K.sky(c2, 'cold'); K.glow(c2, 640, 300, 320, '#cfe3e6', 0.16); });
        cam.layer(0.6, c2 => alley(c2, '#3a4656', '#56656b', '#1b2129'));
        cam.layer(1.0, c2 => {
          K.shoePair(c2, 500, 520, 2.4, 'sandal');
          K.hand(c2, 980, 380, 1.5, '#1d1a22', 0);
          K.coin(c2, 980, 230 - p * 20, 22, lt, 2);
        });
        cam.layer(1.4, c2 => K.particles(c2, lt, { n: 20, color: K.MOODS.cold.dust, rise: 3 }));
      }],

      // 7. The square: red taxis, café chairs turned to the street, the seed seller, the orange vest.
      [B(218), (c, lt, p) => {
        const cam = K.camera(c, p, { x: -50, y: 0, z: 1.0 }, { x: 60, y: 0, z: 1.08 });
        cam.layer(0, c2 => { K.sky(c2, 'day'); K.glow(c2, 1000, 120, 320, '#fff3d6', 0.3); });
        cam.layer(0.3, c2 => K.medina(c2, 470, '#8c7b6c', 9, 0.2, lt));
        cam.layer(1.0, c2 => {
          c2.fillStyle = '#c9b08a'; c2.fillRect(-200, 590, 1700, 200);
          c2.fillStyle = '#a88f6c'; c2.fillRect(-200, 596, 1700, 4);
          K.taxi(c2, 300, 600, 0.9); K.taxi(c2, 760, 610, 0.8); K.taxi(c2, 1120, 600, 0.7);
          c2.fillStyle = '#f2f2ea'; c2.fillRect(300 + 150 * 0.9, 600 - 24 * 0.9, 22, 10);
          c2.fillRect(760 + 150 * 0.8, 610 - 24 * 0.8, 20, 9);
          chair(c2, 880, 600, 1.0); chair(c2, 1080, 622, 1.1); chair(c2, 960, 632, 0.9);
          c2.fillStyle = '#3b2f2a'; c2.beginPath(); c2.ellipse(980, 560, 60, 12, 0, 0, 7); c2.fill();
          c2.fillRect(975, 560, 10, 40);
          c2.fillStyle = 'rgba(230,170,80,0.9)'; c2.fillRect(1005, 534, 16, 26);
          man(c2, 935, 616, 1.0, { color: '#2a2220', vest: C.orange, seated: true });
          man(c2, 200, 620, 1.1, { color: '#221c1a' });
          c2.fillStyle = '#efe6d2'; c2.beginPath(); c2.moveTo(228, 520); c2.lineTo(206, 580); c2.lineTo(250, 580); c2.closePath(); c2.fill();
          c2.fillStyle = '#2a2420'; for (let i = 0; i < 6; i++) c2.fillRect(214 + (i * 7) % 30, 540 + (i * 9) % 30, 3, 3);
        });
        cam.layer(1.4, c2 => K.particles(c2, lt, { n: 25, color: K.MOODS.day.dust, rise: 5 }));
      }],

      // 8. Profile: "Zero," flat and out of breath.
      [B(219), (c, lt, p) => {
        const cam = K.camera(c, p, { x: 0, y: 0, z: 1.0 }, { x: 0, y: 0, z: 1.05 });
        cam.layer(0, c2 => { K.sky(c2, 'cold'); K.glow(c2, 640, 280, 360, '#cfe3e6', 0.18); });
        cam.layer(1.0, c2 => K.profile(c2, 640, 420, 1.45, { scarf: '#6b3b4f', earring: true, rim: C.amber, tilt: 0.22, color: '#2a2230', t: lt }));
      }],

      // 9. The white Fiat at the kerb; the ticket under the wiper. Khadija walks up to it.
      [B(221), (c, lt, p) => {
        const cam = K.camera(c, p, { x: -40, y: 0, z: 1.0 }, { x: 30, y: -6, z: 1.08 });
        cam.layer(0, c2 => K.sky(c2, 'day'));
        cam.layer(0.3, c2 => K.medina(c2, 470, '#8c7b6c', 4, 0.15, lt));
        cam.layer(1.0, c2 => {
          c2.fillStyle = '#c9b08a'; c2.fillRect(-200, 590, 1700, 200);
          c2.fillStyle = '#a88f6c'; c2.fillRect(-200, 596, 1700, 4);
          K.car(c2, 640, 600, 1.4, '#e6e2d8', lt);
          K.paper(c2, 668, 482, 0.5, 0, '#f4efe2', -0.08);
          K.parkingMeter(c2, 1060, 600, 1.1, '', true);
          K.woman(c2, lerp(180, 430, ease2(p)), 640, 1.0, { color: '#2a2230', scarf: '#6b3b4f', width: 1.1, pose: 'walk', t: lt, facing: 1, earring: true });
        });
        cam.layer(1.4, c2 => K.particles(c2, lt, { n: 20, color: K.MOODS.day.dust, rise: 5 }));
      }],

      // 10. The ticket, close. Hot metal, flat print: 11 h 20, then 11 h 24.
      [B(222), (c, lt, p) => {
        const cam = K.camera(c, p, { x: 0, y: 0, z: 1.0 }, { x: 0, y: -10, z: 1.06 });
        cam.layer(0, c2 => { K.sky(c2, 'cold'); K.glow(c2, 640, 60, 240, C.amber, 0.25); });
        cam.layer(1.0, c2 => {
          c2.save(); c2.translate(640, 380); c2.rotate(-0.03); c2.scale(2.6, 2.6);
          K.cut(c2, '#f4efe2', q => { q.beginPath(); q.rect(-80, -50, 160, 100); }, 3);
          c2.fillStyle = 'rgba(40,60,140,0.6)'; c2.fillRect(-64, -36, 128, 2);
          c2.fillStyle = '#2b2a25'; c2.textAlign = 'center'; c2.textBaseline = 'middle';
          c2.font = 'bold 22px "DejaVu Sans Mono", monospace';
          c2.globalAlpha = K.ramp(p, 0.6, 0.66); c2.fillText('11 h 20', 0, -10);
          c2.globalAlpha = K.ramp(p, 0.82, 0.88); c2.fillText('11 h 24', 0, 22);
          c2.restore();
        });
        cam.layer(1.4, c2 => K.particles(c2, lt, { n: 14, color: K.MOODS.cold.dust, rise: 2 }));
      }],
    ]);

    K.finish(ctx, t);
    K.fadeEdges(ctx, t, dur, 0.6, 0.6);

    function lerp(a, b, k) { return a + (b - a) * k; }
    function clamp01(k) { return Math.max(0, Math.min(1, k)); }
    function ease2(k) { k = Math.max(0, Math.min(1, k)); return k * k * (3 - 2 * k); }
  },
});
