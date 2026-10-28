"""Assemble the story video: timeline, scene clips, narration, burnt-in subtitles.

python video/render/make.py <story id> [--jobs 4] [--only s03,s04]
Run video/tts/align.sh first so subtitles and scene beats use real word timings.
Output: video/build/<id>/<id>.mp4. Chunks with no audio yet become silence,
so a full preview can be cut before the narration is finished.
"""
import json, os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FPS = 24


def run(cmd, **kw):
    print("+", " ".join(cmd) if len(" ".join(cmd)) < 300 else cmd[0] + " ...", flush=True)
    subprocess.run(cmd, check=True, **kw)


def main():
    sid = sys.argv[1]
    jobs = int(sys.argv[sys.argv.index("--jobs") + 1]) if "--jobs" in sys.argv else 4
    only = sys.argv[sys.argv.index("--only") + 1].split(",") if "--only" in sys.argv else None
    lib, build = os.path.join(ROOT, "library", sid), os.path.join(ROOT, "video", "build", sid)
    run([sys.executable, os.path.join(ROOT, "video/render/timeline.py"), lib, build])
    scenes = json.load(open(os.path.join(build, "scenes.json")))
    clips = os.path.join(build, "clips"); os.makedirs(clips, exist_ok=True)

    def clip(sc):
        name = f"s{sc['scene']:02d}"
        frames = round(sc["end"] * FPS) - round(sc["start"] * FPS)
        src = os.path.join(ROOT, "video/scenes", name + ".js")
        if not os.path.exists(src):
            src = os.path.join(ROOT, "video/scenes/_placeholder.js")
        out = os.path.join(clips, name + ".mp4")
        if only and name not in only and os.path.exists(out):
            return out
        run(["node", os.path.join(ROOT, "video/render/render.js"), src,
             os.path.join(build, "timing", name + ".json"), out, "--frames", str(frames)])
        return out

    with ThreadPoolExecutor(jobs) as ex:
        outs = list(ex.map(clip, scenes))
    lst = os.path.join(build, "clips.txt")
    open(lst, "w").write("".join(f"file '{o}'\n" for o in outs))
    video = os.path.join(build, "video.mp4")
    run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", video])

    # Narration: chunks back to back, silence where a chunk is still missing.
    chunks = json.load(open(os.path.join(build, "audio", "chunks.json")))
    segs = {s["id"]: s for s in json.load(open(os.path.join(build, "segments.json")))}
    inputs, n = [], 0
    for i, ids in enumerate(chunks, 1):
        wav = os.path.join(build, "audio", f"chunk{i:02d}.wav")
        if os.path.exists(wav):
            inputs += ["-i", wav]
        else:
            nxt = segs[chunks[i][0]]["start"] if i < len(chunks) else scenes[-1]["end"]
            dur = nxt - segs[ids[0]]["start"]
            inputs += ["-f", "lavfi", "-t", f"{dur:.3f}", "-i", "anullsrc=r=24000:cl=mono"]
        n += 1
    narration = os.path.join(build, "narration.wav")
    run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex",
         "".join(f"[{k}:a]" for k in range(n)) + f"concat=n={n}:v=0:a=1[a]", "-map", "[a]", "-ar", "24000", narration])

    final = os.path.join(build, f"{sid}.mp4")
    subs = os.path.join(build, "subs.ass")
    run(["ffmpeg", "-y", "-loglevel", "error", "-stats", "-i", video, "-i", narration,
         "-vf", f"ass={subs}", "-c:v", "libx264", "-preset", "medium", "-crf", "21", "-pix_fmt", "yuv420p",
         "-c:a", "aac", "-b:a", "160k", "-ar", "48000", "-movflags", "+faststart", "-shortest", final])
    print("wrote", final)


if __name__ == "__main__":
    main()
