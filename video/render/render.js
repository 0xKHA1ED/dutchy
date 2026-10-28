// Render one scene to MP4, or stills for checking.
//   node render.js <scene.js> <timing.json> <out.mp4> [--fps 24]
//   node render.js <scene.js> <timing.json> <out.png> --stills 6   (contact sheet)
// timing.json: { "dur": seconds, "starts": {segId: s}, "ends": {segId: s} }
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path');

const [sceneFile, timingFile, out] = process.argv.slice(2);
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? Number(process.argv[i + 1]) : d; };
const fps = arg('--fps', 24), stills = arg('--stills', 0), frames = arg('--frames', 0);

(async () => {
  const timing = JSON.parse(fs.readFileSync(timingFile, 'utf8'));
  const browser = await chromium.launch({ args: ['--disable-gpu-vsync'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('file://' + path.join(__dirname, 'player.html'));
  await page.addScriptTag({ content: fs.readFileSync(sceneFile, 'utf8') + `\n//# sourceURL=${path.basename(sceneFile)}` });
  await page.evaluate(([d, b]) => window.__setup(d, b), [timing.dur, timing]);
  if (!(await page.evaluate(() => !!window.__scene))) errors.push('scene did not call SCENE({...})');
  const fail = () => { if (errors.length) { console.error('ERRORS:\n' + errors.join('\n')); process.exitCode = 1; } };

  if (stills) {
    // Grid of `stills` frames spread over the scene, each labelled with its time.
    const times = Array.from({ length: stills }, (_, i) => (timing.dur * (i + 0.5)) / stills);
    const imgs = [];
    for (const t of times) { await page.evaluate(t => window.__draw(t), t); imgs.push(await page.locator('canvas').screenshot({ type: 'jpeg', quality: 80 })); }
    const cols = 3, html = `<body style="margin:0;background:#222;display:grid;grid-template-columns:repeat(${cols},640px);gap:4px;font:16px sans-serif;color:#fff">` +
      imgs.map((b, i) => `<div style="position:relative"><img width=640 src="data:image/jpeg;base64,${b.toString('base64')}"><span style="position:absolute;left:6px;top:4px;background:#000a;padding:2px 6px">t=${times[i].toFixed(1)}s</span></div>`).join('');
    await page.setContent(html);
    await page.setViewportSize({ width: cols * 644, height: Math.ceil(stills / cols) * 364 });
    await page.screenshot({ path: out, type: out.endsWith('.png') ? 'png' : 'jpeg' });
    fail(); await browser.close(); return;
  }

  const total = frames || Math.ceil(timing.dur * fps);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', String(fps), out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let f = 0; f < total; f += fps) {
    const n = Math.min(fps, total - f);
    const frames = await page.evaluate(([a, n, fps]) => window.__frames(a, n, fps, 0.9), [f / fps, n, fps]);
    for (const b64 of frames) if (!ff.stdin.write(Buffer.from(b64, 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
    if (errors.length) break;
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  console.log(`${path.basename(out)}: ${total} frames in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  fail(); await browser.close();
})();
