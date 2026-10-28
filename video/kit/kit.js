// Dutchy video kit: shared look, props and helpers for every scene.
// Style: layered paper-cut silhouettes in lamplight. Flat shapes, soft
// gradients, drifting steam and dust, film grain, vignette. 1280x720 canvas.
// Every draw is a pure function of time, so any frame can be rendered alone.
(function () {
  const W = 1280, H = 720;

  // Palette. Night street: ink blue and sodium amber. Hammam: damp grey,
  // umber, chalky blue. Gold is rare: buckles, coins, earrings.
  const C = {
    ink: '#141821', night: '#1f2a3a', dusk: '#34445a', chalk: '#9fb4c2',
    mist: '#d9e2e4', steam: 'rgba(235,240,240,0.10)',
    umber: '#5a3d2b', clay: '#8a5a3c', sand: '#c9a77c', plaster: '#e8dcc6',
    tile: '#6f8b8f', tileDark: '#3d5558', teal: '#2f5e63',
    amber: '#f2a65a', lamp: '#ffd59a', red: '#b8433a', orange: '#e0732c',
    gold: '#e8b84a', goldHi: '#fff0b8', black: '#0c0c0f', shadow: 'rgba(8,8,14,0.55)',
  };

  // Scene moods: background gradient stops and particle tint.
  const MOODS = {
    street: { sky: ['#0f1624', '#263650', '#5b4a52'], glow: C.amber, dust: 'rgba(255,214,150,0.5)' },
    day:    { sky: ['#8fb3c4', '#d9c9a8', '#e8b98a'], glow: '#fff3d6', dust: 'rgba(255,250,230,0.55)' },
    hammam: { sky: ['#2a3a3d', '#56706f', '#a9b9b4'], glow: '#f3ead6', dust: 'rgba(240,245,240,0.35)' },
    warm:   { sky: ['#2b1d17', '#6b4330', '#c9875a'], glow: C.lamp, dust: 'rgba(255,220,170,0.45)' },
    cold:   { sky: ['#0e1418', '#22343a', '#4b6266'], glow: '#cfe3e6', dust: 'rgba(200,230,235,0.30)' },
    night:  { sky: ['#07090f', '#141c2b', '#2a2f45'], glow: '#ffcf8a', dust: 'rgba(255,210,150,0.35)' },
  };

  // ---------- math and time ----------
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => (t = clamp(t), t * t * (3 - 2 * t));
  const easeOut = t => 1 - Math.pow(1 - clamp(t), 3);
  const easeIn = t => Math.pow(clamp(t), 3);
  // 0 before a, 1 after b, smooth between. The workhorse for timed reveals.
  const ramp = (t, a, b) => ease((t - a) / Math.max(1e-6, b - a));
  // Rises from 0 to 1 over `fade` seconds at a, holds, falls back by b.
  const pulse = (t, a, b, fade = 0.8) => Math.min(ramp(t, a, a + fade), 1 - ramp(t, b - fade, b));
  function rng(seed) { // deterministic, so frames rendered in any order agree
    let s = seed >>> 0 || 1;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }
  const wobble = (t, speed = 1, seed = 0) => Math.sin(t * speed + seed) * 0.6 + Math.sin(t * speed * 0.37 + seed * 2.1) * 0.4;

  // ---------- canvas helpers ----------
  function vgrad(ctx, y0, y1, stops) {
    const g = ctx.createLinearGradient(0, y0, 0, y1);
    stops.forEach((c, i) => g.addColorStop(i / (stops.length - 1), c));
    return g;
  }
  function sky(ctx, mood) {
    const m = MOODS[mood] || mood;
    ctx.fillStyle = vgrad(ctx, 0, H, m.sky);
    ctx.fillRect(-W, -H, W * 3, H * 3);
  }
  function glow(ctx, x, y, r, color = C.lamp, a = 0.6) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, withAlpha(color, a)); g.addColorStop(1, withAlpha(color, 0));
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
    ctx.restore();
  }
  function withAlpha(hex, a) {
    if (hex.startsWith('rgba')) return hex.replace(/[\d.]+\)$/, a + ')');
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
  }
  function rrect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
  }
  // Paper-cut fill: flat colour plus a soft drop shadow so layers separate.
  function cut(ctx, color, path, depth = 6) {
    ctx.save();
    ctx.shadowColor = C.shadow; ctx.shadowBlur = depth * 2; ctx.shadowOffsetY = depth * 0.6;
    ctx.fillStyle = color; path(ctx); ctx.fill();
    ctx.restore();
  }

  // ---------- camera ----------
  // Slow drift that every scene should use: from {x,y,z} to {x,y,z} over the shot.
  // Draw world layers inside cam.layer(depth, fn): depth 0 = far (moves least),
  // 1 = the focal plane, >1 = foreground (moves most).
  function camera(ctx, t, from, to) {
    const k = ease(t);
    const cx = lerp(from.x || 0, to.x || 0, k), cy = lerp(from.y || 0, to.y || 0, k);
    const z = lerp(from.z || 1, to.z || 1, k);
    return {
      layer(depth, fn) {
        ctx.save();
        ctx.translate(W / 2, H / 2);
        const s = 1 + (z - 1) * depth;
        ctx.scale(s, s);
        ctx.translate(-W / 2 - cx * depth, -H / 2 - cy * depth);
        fn(ctx); ctx.restore();
      },
    };
  }

  // ---------- atmosphere ----------
  function particles(ctx, t, { n = 60, color = 'rgba(255,230,190,0.5)', seed = 7, rise = 12, size = 2.2, area = [0, 0, W, H] } = {}) {
    const r = rng(seed);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = color;
    for (let i = 0; i < n; i++) {
      const x0 = r() * area[2], y0 = r() * area[3], sp = 0.4 + r(), ph = r() * 100, s = size * (0.4 + r());
      const x = area[0] + ((x0 + Math.sin(t * 0.3 * sp + ph) * 30) % area[2] + area[2]) % area[2];
      const y = area[1] + ((y0 - t * rise * sp) % area[3] + area[3]) % area[3];
      ctx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(t * 0.7 + ph));
      ctx.beginPath(); ctx.arc(x, y, s, 0, 7); ctx.fill();
    }
    ctx.restore();
  }
  // Soft rolling steam banks. Use in the hammam; strength 0..1.
  function steam(ctx, t, strength = 0.6, seed = 3, tint = '235,240,238') {
    const r = rng(seed);
    ctx.save();
    for (let i = 0; i < 14; i++) {
      const x = (r() * W * 1.4 + t * (8 + r() * 14)) % (W * 1.4) - W * 0.2;
      const y = H * (0.2 + r() * 0.8) - Math.sin(t * 0.2 + i) * 20;
      const rad = 180 + r() * 260;
      const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
      g.addColorStop(0, `rgba(${tint},${0.16 * strength})`); g.addColorStop(1, `rgba(${tint},0)`);
      ctx.fillStyle = g; ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
    ctx.restore();
  }
  function lightShaft(ctx, x, y, w, h, t, a = 0.18, color = '255,244,214') {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createLinearGradient(x, y, x + w * 0.3, y + h);
    const k = a * (0.85 + 0.15 * Math.sin(t * 0.5));
    g.addColorStop(0, `rgba(${color},${k})`); g.addColorStop(1, `rgba(${color},0)`);
    ctx.fillStyle = g; ctx.beginPath();
    ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w * 1.6, y + h); ctx.lineTo(x + w * 0.4, y + h);
    ctx.fill(); ctx.restore();
  }
  let grainCanvas = null, paperCanvas = null;
  function finish(ctx, t, { vignette = 0.55, grain = 0.06, bars = true } = {}) {
    const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.95);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${vignette})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    if (!grainCanvas) {
      grainCanvas = document.createElement('canvas'); grainCanvas.width = 256; grainCanvas.height = 256;
      const gc = grainCanvas.getContext('2d'), im = gc.createImageData(256, 256), r = rng(99);
      for (let i = 0; i < im.data.length; i += 4) { const v = r() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
      gc.putImageData(im, 0, 0);
    }
    ctx.save(); ctx.globalAlpha = grain; ctx.globalCompositeOperation = 'overlay';
    const f = Math.floor(t * 12);
    ctx.translate(-(f * 37) % 256, -(f * 91) % 256);
    ctx.fillStyle = ctx.createPattern(grainCanvas, 'repeat'); ctx.fillRect(0, 0, W + 256, H + 256);
    ctx.restore();
    if (!paperCanvas) { // large soft blotches: reads as printed paper
      paperCanvas = document.createElement('canvas'); paperCanvas.width = W; paperCanvas.height = H;
      const pc = paperCanvas.getContext('2d'), r = rng(42);
      for (let i = 0; i < 260; i++) { const x = r() * W, y = r() * H, rr = 30 + r() * 140, v = r() < 0.5 ? 0 : 255;
        const g = pc.createRadialGradient(x, y, 0, x, y, rr); g.addColorStop(0, `rgba(${v},${v},${v},0.10)`); g.addColorStop(1, `rgba(${v},${v},${v},0)`); pc.fillStyle = g; pc.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
    }
    ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.drawImage(paperCanvas, 0, 0); ctx.restore();
    if (bars) { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, 36); ctx.fillRect(0, H - 36, W, 36); }
  }
  // Fade from/to black at the shot edges. Call last.
  function fadeEdges(ctx, t, dur, inS = 1.2, outS = 1.2) {
    const a = Math.max(1 - clamp(t / inS), clamp((t - (dur - outS)) / outS));
    if (a > 0) { ctx.fillStyle = `rgba(0,0,0,${a})`; ctx.fillRect(0, 0, W, H); }
  }

  // ---------- architecture ----------
  // Horseshoe/pointed arch opening. Fill with `color`; `inner` draws what is seen through it.
  function archPath(ctx, x, y, w, h) { // x,y = bottom-left
    const r = w / 2;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - h + r);
    ctx.bezierCurveTo(x - r * 0.12, y - h + r * 0.2, x + r * 0.55, y - h, x + r, y - h);
    ctx.bezierCurveTo(x + r * 1.45, y - h, x + w + r * 0.12, y - h + r * 0.2, x + w, y - h + r);
    ctx.lineTo(x + w, y); ctx.closePath();
  }
  function arch(ctx, x, y, w, h, color = C.night) { cut(ctx, color, c => archPath(c, x, y, w, h)); }
  // A wall with arch-shaped holes: draws wall colour everywhere except the arches.
  function archWall(ctx, color, arches, y0 = 0, y1 = H) {
    ctx.save(); ctx.fillStyle = color; ctx.beginPath(); ctx.rect(-W, y0, W * 3, y1 - y0);
    arches.forEach(a => { archPath(ctx, a[0], a[1], a[2], a[3]); });
    ctx.fill('evenodd'); ctx.restore();
  }
  // Eight-point star zellige band. Cheap and very Moroccan.
  function zellige(ctx, x, y, w, h, size = 40, colors = [C.teal, C.plaster, C.tileDark], t = 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.fillStyle = colors[1]; ctx.fillRect(x, y, w, h);
    for (let j = 0; j * size < h + size; j++) for (let i = 0; i * size < w + size; i++) {
      const cx = x + i * size + (j % 2) * size / 2, cy = y + j * size;
      star8(ctx, cx, cy, size * 0.42, (i + j) % 3 === 0 ? colors[2] : colors[0]);
    }
    ctx.restore();
  }
  function star8(ctx, cx, cy, r, color) {
    ctx.fillStyle = color; ctx.beginPath();
    for (let k = 0; k < 16; k++) {
      const a = k * Math.PI / 8, rr = k % 2 ? r * 0.62 : r;
      ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
    }
    ctx.fill();
  }
  // Wet tiled floor in perspective, with a soft sheen.
  function tileFloor(ctx, y0, color = C.tile, line = 'rgba(0,0,0,0.18)', t = 0) {
    ctx.fillStyle = vgrad(ctx, y0, H, [color, C.tileDark]); ctx.fillRect(-W, y0, W * 3, H - y0 + 50);
    ctx.strokeStyle = line; ctx.lineWidth = 1.5;
    for (let i = 0; i < 12; i++) { const y = y0 + Math.pow(i / 11, 1.8) * (H - y0); ctx.beginPath(); ctx.moveTo(-W, y); ctx.lineTo(2 * W, y); ctx.stroke(); }
    for (let i = -20; i <= 20; i++) { ctx.beginPath(); ctx.moveTo(W / 2 + i * 40, y0); ctx.lineTo(W / 2 + i * 160, H + 50); ctx.stroke(); }
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createLinearGradient(0, y0, 0, H); g.addColorStop(0, 'rgba(255,255,255,0.10)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.fillRect(-W, y0, W * 3, H - y0); ctx.restore();
  }
  // A row of medina buildings as a silhouette strip with a few lit windows.
  function medina(ctx, yBase, color = C.ink, seed = 1, lit = 0.3, t = 0) {
    const r = rng(seed); let x = -200;
    ctx.fillStyle = color;
    const wins = [];
    while (x < W + 200) {
      const w = 60 + r() * 120, h = 120 + r() * 220;
      ctx.fillRect(x, yBase - h, w + 1, h + 400);
      if (r() < 0.25) { ctx.beginPath(); ctx.arc(x + w / 2, yBase - h, w * 0.3, Math.PI, 0); ctx.fill(); }
      for (let k = 0; k < 3; k++) if (r() < lit) wins.push([x + 10 + r() * (w - 30), yBase - h + 20 + r() * (h - 60)]);
      x += w;
    }
    wins.forEach(([wx, wy], i) => {
      ctx.save(); ctx.fillStyle = C.lamp; ctx.globalAlpha = 0.75 + 0.25 * Math.sin(t * 0.5 + i);
      ctx.beginPath(); archPath(ctx, wx, wy + 22, 12, 22); ctx.fill(); ctx.restore();
      glow(ctx, wx + 6, wy + 10, 30, C.amber, 0.25);
    });
  }
  // A big rounded bab (city gate) with tile bands, seen from the front.
  function gate(ctx, cx, yBase, w = 360, h = 420, color = '#2c5f8a', inner = C.night) {
    cut(ctx, color, c => { c.beginPath(); c.rect(cx - w * 0.75, yBase - h * 1.15, w * 1.5, h * 1.15); }, 8);
    zellige(ctx, cx - w * 0.75, yBase - h * 1.15, w * 1.5, 40, 22, ['#1e4a72', '#e9d9b2', C.gold]);
    cut(ctx, inner, c => archPath(c, cx - w / 2, yBase, w, h), 4);
  }

  // ---------- people ----------
  // Silhouette woman. Calm, readable, no faces. opts:
  //  color, scarf (headscarf colour or null), robe ('djellaba'|'towel'|'dress'),
  //  pose ('stand'|'sit'|'bend'|'walk'), t (for walk cycle/breath), facing (1 or -1),
  //  width (1 = average, 1.35 = round, 0.8 = thin), earring (true: a gold glint), arm (-1..1 raise)
  function woman(ctx, x, y, s = 1, o = {}) {
    const col = o.color || C.ink, facing = o.facing || 1, wid = o.width || 1, t = o.t || 0;
    const breath = Math.sin(t * 1.6) * 1.2;
    ctx.save(); ctx.translate(x, y); ctx.scale(s * facing, s);
    // ground shadow
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(0, 2, 60 * wid, 10, 0, 0, 7); ctx.fill();
    const sit = o.pose === 'sit', bend = o.pose === 'bend';
    const bodyH = sit ? 120 : 200, hipW = 46 * wid, shW = 34 * wid;
    const step = o.pose === 'walk' ? Math.sin(t * 5) : 0;
    ctx.fillStyle = col;
    ctx.save();
    if (bend) ctx.rotate(0.35);
    // robe
    const robe = c => {
      c.beginPath();
      c.moveTo(-hipW - step * 6, 0);
      c.quadraticCurveTo(-hipW * 0.9, -bodyH * 0.55, -shW, -bodyH - breath);
      c.lineTo(shW, -bodyH - breath);
      c.quadraticCurveTo(hipW * 0.95, -bodyH * 0.55, hipW + step * 6, 0);
      c.closePath();
    };
    robe(ctx); ctx.fill();
    if (o.robe === 'towel') { // towel wrapped from armpit to knee, clipped to the body
      ctx.save(); robe(ctx); ctx.clip(); ctx.fillStyle = o.towel || '#d8cbb4';
      ctx.beginPath(); ctx.moveTo(-200, -bodyH * 0.78); ctx.quadraticCurveTo(0, -bodyH * 0.84, 200, -bodyH * 0.76);
      ctx.lineTo(200, -bodyH * 0.22); ctx.quadraticCurveTo(0, -bodyH * 0.16, -200, -bodyH * 0.24); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.12)'; for (let k = 0; k < 3; k++) ctx.fillRect(-200, -bodyH * (0.7 - k * 0.17), 400, 3);
      ctx.restore(); ctx.fillStyle = col;
    }
    if (sit) { ctx.beginPath(); ctx.roundRect(-hipW, -36, hipW * 2 + 50, 36, 14); ctx.fill(); }
    // arm
    const ar = o.arm || 0;
    ctx.save(); ctx.translate(shW * 0.8, -bodyH + 12); ctx.rotate(-0.25 - ar * 1.6);
    ctx.beginPath(); ctx.roundRect(-9, 0, 18, 92, 9); ctx.fill(); ctx.restore();
    // head + scarf
    const hy = -bodyH - 34 - breath;
    ctx.beginPath(); ctx.ellipse(4, hy, 24, 28, 0, 0, 7); ctx.fill();
    if (o.scarf) {
      ctx.fillStyle = o.scarf;
      ctx.beginPath(); ctx.moveTo(-28, hy + 30); ctx.quadraticCurveTo(-34, hy - 40, 6, hy - 34);
      ctx.quadraticCurveTo(38, hy - 30, 30, hy + 8); ctx.quadraticCurveTo(10, hy + 40, -28, hy + 30); ctx.fill();
    }
    if (o.earring) { ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(-6, hy + 18, 3.2, 0, 7); ctx.fill(); glow(ctx, -6, hy + 18, 14, C.gold, 0.5); }
    ctx.restore(); ctx.restore();
  }

  // ---------- props ----------
  function shoe(ctx, x, y, s, kind, color, buckle) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(0, 6, 70, 10, 0, 0, 7); ctx.fill();
    ctx.fillStyle = color;
    if (kind === 'ballet') {
      for (let k = 0; k < 4; k++) { ctx.fillStyle = k % 2 ? '#2a2420' : '#1a1614'; ctx.fillRect(38, -4 - k * 4, 26, 5); } // stacked heels
      ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(-64, 0); ctx.quadraticCurveTo(-70, -26, -30, -28);
      ctx.lineTo(50, -24); ctx.quadraticCurveTo(66, -20, 64, -16); ctx.lineTo(64, 0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#3a3634'; ctx.beginPath(); ctx.ellipse(10, -24, 30, 6, 0, 0, 7); ctx.fill();
    } else { // velcro pharmacy sandal
      ctx.beginPath(); ctx.roundRect(-66, -12, 132, 14, 6); ctx.fill();
      ctx.beginPath(); ctx.roundRect(-40, -34, 46, 24, 8); ctx.fill();
      ctx.beginPath(); ctx.roundRect(12, -30, 40, 20, 8); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 2; ctx.strokeRect(-36, -28, 38, 12);
    }
    if (buckle) { ctx.fillStyle = C.gold; ctx.beginPath(); ctx.roundRect(-24, -34, 18, 12, 3); ctx.fill(); glow(ctx, -15, -28, 26, C.gold, 0.6); }
    ctx.restore();
  }
  // Two shoes side by side: kind 'sandal' or 'ballet'.
  function shoePair(ctx, x, y, s = 1, kind = 'sandal', o = {}) {
    const col = o.color || '#151414';
    shoe(ctx, x, y, s, kind, col, kind === 'ballet' && o.buckle !== false);
    shoe(ctx, x + 30 * s, y + 26 * s, s, kind, col, kind === 'ballet' && o.buckle !== false);
  }
  function slipper(ctx, x, y, s = 1, color = '#c4473f', rot = 0) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(0, 0, 50, 18, 0, 0, 7); ctx.fill();
    ctx.fillStyle = withAlpha('#000000', 0.25); ctx.beginPath(); ctx.ellipse(10, -4, 22, 12, 0, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.ellipse(-20, -6, 10, 3, 0, 0, 7); ctx.fill();
    ctx.restore();
  }
  function coin(ctx, x, y, r = 16, t = 0, spin = 0) {
    const sx = spin ? Math.abs(Math.cos(t * spin)) : 1;
    ctx.save(); ctx.translate(x, y); ctx.scale(Math.max(0.08, sx), 1);
    ctx.fillStyle = '#b8b2a0'; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill();
    ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(0, 0, r * 0.62, 0, 7); ctx.fill();
    ctx.restore(); glow(ctx, x, y, r * 2.4, C.goldHi, 0.25);
  }
  function bucket(ctx, x, y, s = 1, color = '#3f7f8c', fill = 0) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(-40, -80); ctx.lineTo(40, -80); ctx.lineTo(30, 0); ctx.lineTo(-30, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(-30, -74, 8, 70);
    ctx.strokeStyle = '#222'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, -80, 40, Math.PI, 0); ctx.stroke();
    if (fill > 0) { ctx.fillStyle = 'rgba(200,230,235,0.8)'; ctx.beginPath(); ctx.ellipse(0, -80 + 4, 38, 7, 0, 0, 7); ctx.fill(); }
    ctx.restore();
  }
  // A brass tap with an optional stream of water (flow 0..1).
  function tap(ctx, x, y, s = 1, flow = 0, t = 0) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = C.gold; ctx.fillRect(-6, -40, 12, 40); ctx.beginPath(); ctx.roundRect(-4, -8, 40, 12, 6); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -44, 12, 0, 7); ctx.fill();
    if (flow > 0) {
      ctx.fillStyle = `rgba(220,240,245,${0.55 * flow})`;
      for (let i = 0; i < 6; i++) { const w = 6 * flow + Math.sin(t * 20 + i) * 1.2; ctx.fillRect(30 - w / 2, 4 + i * 30, w, 32); }
    }
    ctx.restore();
  }
  function parkingMeter(ctx, x, y, s = 1, screen = '', bag = true) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = '#2b2f36'; ctx.fillRect(-8, -220, 16, 220);
    cut(ctx, '#3d4450', c => { c.beginPath(); c.roundRect(-46, -330, 92, 120, 14); });
    ctx.fillStyle = '#9fd3a8'; ctx.fillRect(-30, -310, 60, 30);
    if (screen) { ctx.fillStyle = '#163a20'; ctx.font = 'bold 18px DejaVu Sans Mono, monospace'; ctx.textAlign = 'center'; ctx.fillText(screen, 0, -289); }
    glow(ctx, 0, -295, 60, '#9fd3a8', 0.25);
    ctx.fillStyle = '#111'; ctx.fillRect(-10, -260, 20, 6); ctx.fillRect(-14, -230, 28, 10);
    if (bag) { ctx.fillStyle = 'rgba(230,230,220,0.55)'; ctx.beginPath(); ctx.moveTo(-50, -262); ctx.quadraticCurveTo(0, -240, 50, -262); ctx.lineTo(30, -236); ctx.quadraticCurveTo(0, -226, -30, -236); ctx.fill(); }
    ctx.restore();
  }
  // Little old Fiat from the side.
  function car(ctx, x, y, s = 1, color = '#c9b48a', t = 0) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    cut(ctx, color, c => { c.beginPath(); c.moveTo(-160, -20); c.lineTo(-150, -70); c.lineTo(-90, -78); c.lineTo(-60, -125); c.lineTo(70, -125); c.lineTo(105, -78); c.lineTo(160, -70); c.lineTo(165, -20); c.closePath(); });
    ctx.fillStyle = 'rgba(30,40,55,0.85)'; ctx.beginPath(); ctx.moveTo(-50, -80); ctx.lineTo(-30, -115); ctx.lineTo(60, -115); ctx.lineTo(90, -80); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#111'; [-95, 105].forEach(wx => { ctx.beginPath(); ctx.arc(wx, -18, 26, 0, 7); ctx.fill(); });
    ctx.fillStyle = '#777'; [-95, 105].forEach(wx => { ctx.beginPath(); ctx.arc(wx, -18, 10, 0, 7); ctx.fill(); });
    ctx.restore();
  }
  function taxi(ctx, x, y, s = 1) { car(ctx, x, y, s, '#b8352d'); }
  // Cashier's carnet (notebook), open, with handwritten-looking lines.
  function notebook(ctx, x, y, s = 1, lines = 6, t = 0, write = 1) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-0.04);
    cut(ctx, '#efe6d2', c => { c.beginPath(); c.roundRect(-160, -110, 320, 220, 6); });
    ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.moveTo(0, -110); ctx.lineTo(0, 110); ctx.stroke();
    ctx.strokeStyle = '#2a4a8a'; ctx.lineWidth = 2.2;
    const total = lines * 2, shown = Math.floor(total * clamp(write));
    for (let i = 0; i < shown; i++) {
      const side = i < lines ? -1 : 1, row = i % lines, r = rng(i + 3);
      const x0 = side < 0 ? -145 : 15, len = 80 + r() * 50;
      ctx.beginPath(); for (let k = 0; k <= len; k += 6) ctx.lineTo(x0 + k, -80 + row * 30 + Math.sin(k * 0.5 + i) * 2.5); ctx.stroke();
    }
    ctx.restore();
  }
  function jar(ctx, x, y, s = 1, fill = 0.4) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = 'rgba(200,220,230,0.25)'; ctx.beginPath(); ctx.roundRect(-36, -110, 72, 110, 12); ctx.fill();
    if (fill > 0) { ctx.fillStyle = '#5a3a22'; ctx.fillRect(-32, -fill * 100, 64, fill * 100 - 4); }
    ctx.fillStyle = C.red; ctx.fillRect(-38, -124, 76, 18);
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillRect(-26, -100, 8, 80);
    ctx.restore();
  }
  // Folded paper (voucher, receipt). folds 0..2 animates folding in four.
  function paper(ctx, x, y, s = 1, folds = 0, color = '#f4efe2', rot = 0) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    const w = 160 / (1 + clamp(folds, 0, 1)), h = 100 / (1 + clamp(folds - 1, 0, 1));
    cut(ctx, color, c => { c.beginPath(); c.rect(-w / 2, -h / 2, w, h); }, 3);
    ctx.strokeStyle = 'rgba(40,60,140,0.6)'; ctx.lineWidth = 2;
    if (folds < 1) for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-w / 2 + 14, -h / 2 + 24 + i * 22); ctx.lineTo(w / 2 - 20 - i * 18, -h / 2 + 24 + i * 22); ctx.stroke(); }
    ctx.restore();
  }
  function bench(ctx, x, y, w = 400, color = C.umber) {
    cut(ctx, color, c => { c.beginPath(); c.rect(x, y, w, 26); c.rect(x + 20, y + 26, 18, 70); c.rect(x + w - 38, y + 26, 18, 70); });
  }
  // A bundle of clothes knotted in a scarf.
  function bundle(ctx, x, y, s = 1, color = '#7a4a6a') {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    cut(ctx, color, c => { c.beginPath(); c.ellipse(0, -30, 60, 34, 0, 0, 7); });
    ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(-6, -66, 16, 12, 0.4, 0, 7); ctx.ellipse(12, -64, 16, 10, -0.4, 0, 7); ctx.fill();
    ctx.restore();
  }
  function door(ctx, x, y, w = 220, h = 380, open = 0, color = '#4a2e20') {
    ctx.fillStyle = '#0a0a0c'; ctx.beginPath(); archPath(ctx, x, y, w, h); ctx.fill();
    ctx.save(); ctx.beginPath(); archPath(ctx, x, y, w, h); ctx.clip();
    ctx.translate(x, 0); ctx.scale(1 - 0.85 * clamp(open), 1);
    ctx.fillStyle = color; ctx.fillRect(0, y - h, w, h);
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; for (let i = 1; i < 6; i++) ctx.fillRect(i * w / 6, y - h, 3, h);
    ctx.fillStyle = C.gold; for (let j = 0; j < 6; j++) for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(30 + i * (w - 60) / 3, y - h + 90 + j * 45, 4, 0, 7); ctx.fill(); }
    ctx.restore();
  }
  // Water drop falling from (x,y0) to (x,y1) during [a,b]; ripple after.
  function drop(ctx, t, x, y0, y1, a, b) {
    if (t < a) return;
    if (t < b) { const k = easeIn((t - a) / (b - a)); ctx.fillStyle = 'rgba(220,240,250,0.9)'; ctx.beginPath(); ctx.ellipse(x, lerp(y0, y1, k), 4, 7, 0, 0, 7); ctx.fill(); return; }
    const k = clamp((t - b) / 1.2);
    if (k < 1) { ctx.strokeStyle = `rgba(220,240,250,${1 - k})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y1, 10 + 60 * k, 3 + 12 * k, 0, 0, 7); ctx.stroke(); }
  }

  // ---------- type ----------
  // Big elegant title card text (French), e.g. chapter numbers. Fades with `a`.
  function title(ctx, text, a = 1, { y = H / 2, size = 96, color = C.plaster, sub = '', font = 'DejaVu Serif' } = {}) {
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 24;
    ctx.fillStyle = color; ctx.font = `${size}px "${font}", serif`; ctx.fillText(text, W / 2, y);
    if (sub) { ctx.font = `italic ${size * 0.28}px "${font}", serif`; ctx.globalAlpha = a * 0.8; ctx.fillText(sub, W / 2, y + size * 0.85); }
    ctx.restore();
  }
  // Small in-world label, e.g. a meter screen or a notebook line. Keep rare.
  function label(ctx, text, x, y, size = 22, color = C.plaster, a = 1) {
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = color; ctx.font = `italic ${size}px "DejaVu Serif", serif`; ctx.textAlign = 'center'; ctx.fillText(text, x, y); ctx.restore();
  }


  // ---------- shots ----------
  // Cut the scene into shots that crossfade. list = [[startSeconds, fn], ...]
  // in time order; fn(ctx, localT, progress 0..1 through the shot). Change shot
  // every 8-20 s, on narration beats (use B(id) for start times).
  function shots(ctx, t, dur, list, fade = 0.9) {
    let i = 0;
    while (i + 1 < list.length && t >= list[i + 1][0]) i++;
    const run = k => {
      const a = list[k][0], b = k + 1 < list.length ? list[k + 1][0] : dur;
      ctx.save(); list[k][1](ctx, t - a, clamp((t - a) / Math.max(0.1, b - a))); ctx.restore();
    };
    const since = t - list[i][0];
    if (i > 0 && since < fade) {
      run(i - 1);
      const off = document.createElement('canvas'); // draw the new shot on top, fading in
      off.width = W; off.height = H; const o = off.getContext('2d');
      const a = list[i][0], b = i + 1 < list.length ? list[i + 1][0] : dur;
      list[i][1](o, since, clamp(since / Math.max(0.1, b - a)));
      ctx.save(); ctx.globalAlpha = ease(since / fade); ctx.drawImage(off, 0, 0); ctx.restore();
    } else run(i);
  }

  // ---------- close-ups ----------
  // Side-profile bust of a woman in a headscarf, facing right (facing -1 = left).
  // The best shot for inner moments. o: color, scarf, rim (rim-light colour),
  // earring, eyes ('open'|'closed'), t (breathing), tilt (radians, head down > 0).
  function profile(ctx, x, y, s = 1, o = {}) {
    const col = o.color || C.ink, rim = o.rim || C.lamp, t = o.t || 0;
    ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.facing || 1), s);
    const breath = Math.sin(t * 1.4) * 2;
    // shoulders
    ctx.fillStyle = col; ctx.beginPath();
    ctx.moveTo(-260, 360); ctx.quadraticCurveTo(-250, 150 + breath, -90, 120 + breath);
    ctx.lineTo(60, 110 + breath); ctx.quadraticCurveTo(200, 140 + breath, 230, 360); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.translate(0, breath); ctx.rotate(o.tilt || 0);
    // neck and face, drawn as one path from the nape round the front of the face
    const face = c => {
      c.beginPath();
      c.moveTo(-40, 130); c.lineTo(-50, 40);
      c.bezierCurveTo(-120, 0, -110, -150, -20, -170);       // back of head
      c.bezierCurveTo(50, -180, 95, -130, 98, -70);           // forehead
      c.lineTo(104, -40); c.lineTo(122, -8);                  // brow to nose tip
      c.lineTo(102, 2); c.quadraticCurveTo(110, 14, 104, 22); // lips
      c.quadraticCurveTo(112, 32, 100, 40);
      c.quadraticCurveTo(96, 62, 70, 66);                     // chin
      c.lineTo(40, 70); c.lineTo(46, 130); c.closePath();
    };
    ctx.fillStyle = col; face(ctx); ctx.fill();
    // rim light along the face edge
    ctx.save(); face(ctx); ctx.clip();
    ctx.strokeStyle = withAlpha(rim, 0.85); ctx.lineWidth = 7; ctx.filter = 'blur(2px)';
    ctx.translate(-3, 0); face(ctx); ctx.stroke(); ctx.restore();
    if ((o.eyes || 'open') === 'closed') { ctx.strokeStyle = withAlpha(rim, 0.6); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(70, -48, 9, 0.2, Math.PI - 0.6); ctx.stroke(); }
    else { ctx.fillStyle = withAlpha(rim, 0.7); ctx.beginPath(); ctx.ellipse(76, -50, 4, 2.5, 0, 0, 7); ctx.fill(); }
    // headscarf wraps the head and falls on the shoulder
    if (o.scarf !== null) {
      ctx.fillStyle = o.scarf || '#4a2a3a'; ctx.beginPath();
      ctx.moveTo(-60, 150); ctx.bezierCurveTo(-150, 40, -140, -170, -10, -186);
      ctx.bezierCurveTo(70, -192, 110, -140, 104, -86); ctx.quadraticCurveTo(70, -110, 52, -60);
      ctx.quadraticCurveTo(40, 20, 30, 80); ctx.quadraticCurveTo(10, 140, -60, 150); ctx.fill();
      ctx.strokeStyle = withAlpha(rim, 0.35); ctx.lineWidth = 3; ctx.stroke();
    }
    if (o.earring) { ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(o.scarf === null ? 10 : 36, o.scarf === null ? 46 : 60, 6, 0, 7); ctx.fill(); glow(ctx, o.scarf === null ? 10 : 36, o.scarf === null ? 46 : 60, 28, C.gold, 0.7); }
    ctx.restore(); ctx.restore();
  }
  // A hand seen from above, palm up or down, for counting coins etc.
  function hand(ctx, x, y, s = 1, color = '#8a5a3c', rot = 0) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    cut(ctx, color, c => {
      c.beginPath(); c.roundRect(-55, -40, 110, 120, 40);
      for (let i = 0; i < 4; i++) c.roundRect(-50 + i * 27, -110 + Math.abs(i - 1.5) * 10, 22, 90, 11);
      c.roundRect(46, -10, 70, 24, 12);
    }, 5);
    ctx.restore();
  }
  // Bare bulb on a cord with a warm halo, swaying a little.
  function bulb(ctx, x, y, t = 0, len = 160, color = C.lamp) {
    const sw = Math.sin(t * 0.8) * 0.04;
    ctx.save(); ctx.translate(x, y - len); ctx.rotate(sw);
    ctx.strokeStyle = '#111'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -400); ctx.lineTo(0, len); ctx.stroke();
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(0, len + 12, 12, 0, 7); ctx.fill();
    glow(ctx, 0, len + 12, 260, color, 0.45); glow(ctx, 0, len + 12, 60, '#ffffff', 0.5);
    ctx.restore();
  }
  // Supermarket till: counter, conveyor belt, small screen. For the cashier memories.
  function till(ctx, x, y, s = 1, screen = '', t = 0) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    cut(ctx, '#2c3038', c => { c.beginPath(); c.rect(-300, -60, 600, 160); });
    ctx.fillStyle = '#16181c'; ctx.fillRect(-300, -70, 420, 14);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 2;
    for (let i = 0; i < 14; i++) { const xx = -300 + ((i * 32 + t * 30) % 420); ctx.beginPath(); ctx.moveTo(xx, -70); ctx.lineTo(xx, -56); ctx.stroke(); }
    cut(ctx, '#3d4450', c => { c.beginPath(); c.roundRect(150, -190, 120, 90, 8); });
    ctx.fillStyle = '#7fd0e0'; ctx.fillRect(162, -178, 96, 50); glow(ctx, 210, -153, 90, '#7fd0e0', 0.3);
    if (screen) { ctx.fillStyle = '#0d2a33'; ctx.font = 'bold 20px DejaVu Sans Mono, monospace'; ctx.textAlign = 'center'; ctx.fillText(screen, 210, -146); }
    ctx.fillStyle = '#2c3038'; ctx.fillRect(200, -100, 20, 40);
    ctx.restore();
  }
  function stars(ctx, t, n = 120, seed = 5) {
    const r = rng(seed); ctx.save(); ctx.fillStyle = '#fff';
    for (let i = 0; i < n; i++) { const x = r() * W, y = r() * H * 0.6, ph = r() * 10; ctx.globalAlpha = 0.2 + 0.6 * Math.abs(Math.sin(t * 0.6 + ph)); ctx.fillRect(x, y, 1.6, 1.6); }
    ctx.restore();
  }
  // Large circular light pools on the floor or wall (hammam skylight stars, lamps).
  function lightPool(ctx, x, y, rx, ry, a = 0.25, color = '#fff6dc') {
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, y); ctx.scale(1, ry / rx);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx); g.addColorStop(0, withAlpha(color, a)); g.addColorStop(1, withAlpha(color, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rx, 0, 7); ctx.fill(); ctx.restore();
  }
  // Hammam dome ceiling with star-shaped skylights casting shafts. Great establishing shot.
  function dome(ctx, t, color = '#3e5452', holes = 9) {
    ctx.fillStyle = vgrad(ctx, 0, H, [color, '#25302f']); ctx.fillRect(-W, -H, W * 3, H * 3);
    ctx.save(); ctx.globalAlpha = 0.5; ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 3;
    for (let i = 1; i < 6; i++) { ctx.beginPath(); ctx.ellipse(W / 2, -200, i * 260, i * 160, 0, 0, Math.PI); ctx.stroke(); }
    ctx.restore();
    for (let i = 0; i < holes; i++) {
      const x = W / 2 + (i - (holes - 1) / 2) * 120, y = 60 + Math.abs(i - (holes - 1) / 2) * 18;
      star8(ctx, x, y, 12, '#fff8e4'); glow(ctx, x, y, 40, '#fff8e4', 0.6);
      lightShaft(ctx, x - 10, y, 20, H, t + i, 0.08);
    }
  }

  window.KIT = {
    W, H, C, MOODS, clamp, lerp, ease, easeIn, easeOut, ramp, pulse, rng, wobble, withAlpha,
    vgrad, sky, glow, rrect, cut, camera, particles, steam, lightShaft, finish, fadeEdges,
    archPath, arch, archWall, zellige, star8, tileFloor, medina, gate,
    woman, shoe, shoePair, slipper, coin, bucket, tap, parkingMeter, car, taxi, notebook, jar, paper, bench, bundle, door, drop,
    title, label, shots, profile, hand, bulb, till, stars, lightPool, dome,
  };
})();
