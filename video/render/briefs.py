"""Write one brief per scene for the animators: its lines in French and English
with estimated times. python video/render/briefs.py video/build/<id>"""
import json, os, sys

build = sys.argv[1]
segs = {s["id"]: s for s in json.load(open(os.path.join(build, "segments.json")))}
scenes = json.load(open(os.path.join(build, "scenes.json")))
os.makedirs(os.path.join(build, "briefs"), exist_ok=True)
for sc in scenes:
    k = sc["scene"]
    lines = [f"# Scene s{k:02d}: chapter {sc['chapter']}, about {sc['dur']:.0f} s (story time {sc['start']/60:.1f}-{sc['end']/60:.1f} min)\n",
             "Times are seconds from the start of THIS scene. They are estimates and will shift a little;",
             "always use B(id) / B.end(id) in code, never hard-coded seconds.\n"]
    prev = [segs[i] for i in segs if i < sc["segments"][0]][-3:]
    if prev:
        lines.append("## Just before this scene (for continuity, do not animate)\n")
        lines += [f"- {' '.join(p['en']) or p['text']}" for p in prev]
        lines.append("")
    lines.append("## Lines in this scene\n")
    for i in sc["segments"]:
        s = segs[i]
        a, b = s["start"] - sc["start"], s["end"] - sc["start"]
        lines.append(f"### B({i}) = {a:.1f}s to {b:.1f}s  [{s['voice']}]")
        if s.get("direction"):
            lines.append(f"(direction: {s['direction']})")
        lines.append(f"FR: {' '.join(s['text'].split())}")
        if s["en"]:
            lines.append(f"EN: {' '.join(s['en'])}")
        lines.append("")
    open(os.path.join(build, "briefs", f"s{k:02d}.md"), "w").write("\n".join(lines))
print(len(scenes), "briefs")
