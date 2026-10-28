"""Build timing for scenes and subtitles from the TTS chunks.

python video/render/timeline.py library/<id> video/build/<id>
Writes build/<id>/segments.json (every segment with start/end and its English
sentences), scenes.json, timing/sNN.json per scene and subs.ass. Chunks
without audio yet get estimated times, so scenes can be drafted early.
"""
import json, os, re, subprocess, sys, unicodedata

CPS = 14.4          # measured on chunk 1
GAP = 0.6           # seconds of silence assumed between segments when estimating
SCENE_CHARS = 1300  # about 90 seconds of narration per scene


def norm(s):
    s = unicodedata.normalize("NFKD", s.lower())
    return re.sub(r"[^a-z0-9]", "", s)


def attach_english(segments, sentences):
    """Give each segment the translated sentences that start inside it."""
    owner = []
    for s in segments:
        s["en"] = []
        if s["id"] == 1 or s["text"].strip().isdigit():
            continue
        owner += [s] * len(norm(s["text"]))
    pos = 0
    for x in sentences:
        owner[min(pos, len(owner) - 1)]["en"].append(x["english"].lstrip("— ").strip())
        pos += len(norm(x["original"]))


def silences(wav):
    out = subprocess.run(["ffmpeg", "-hide_banner", "-i", wav, "-af", "silencedetect=n=-38dB:d=0.25", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", out)]
    en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", out)]
    dur = float(re.search(r"Duration: (\d+):(\d+):([\d.]+)", out).expand(r"\1")) * 3600 + \
          float(re.search(r"Duration: (\d+):(\d+):([\d.]+)", out).group(2)) * 60 + \
          float(re.search(r"Duration: (\d+):(\d+):([\d.]+)", out).group(3))
    return list(zip(st, en)), dur


def weight(s):
    return len(s["text"]) / CPS + GAP + s.get("pause_after", 0)


def align_chunk(segs, wav):
    """Segment boundaries = expected positions snapped to real silences."""
    if not wav or not os.path.exists(wav):
        t, out = 0.0, []
        for s in segs:
            d = weight(s); out.append((t, t + d - GAP - s.get("pause_after", 0))); t += d
        return out, t, False
    sil, dur = silences(wav)
    sil = [x for x in sil if x[1] - x[0] >= 0.25]
    lead = sil[0][1] if sil and sil[0][0] < 0.05 else 0.0
    tail = sil[-1][0] if sil and abs(sil[-1][1] - dur) < 0.05 else dur
    ws = [weight(s) for s in segs]
    scale = (tail - lead) / sum(ws)
    bounds, acc, used = [(lead, lead)], lead, -1
    for i, w in enumerate(ws[:-1]):
        acc += w * scale
        # nearest unused silence after the previous boundary, within 4 s
        best = None
        for k in range(used + 1, len(sil)):
            mid = (sil[k][0] + sil[k][1]) / 2
            if mid <= bounds[-1][1] + 0.3:
                continue
            if abs(mid - acc) < 4 and (best is None or abs(mid - acc) < abs(best[1] - acc)):
                best = (k, mid)
            if mid > acc + 4:
                break
        if best:
            used = best[0]; b = sil[best[0]]
            bounds.append(b); acc = b[1]
        else:
            bounds.append((acc, acc))
    out = []
    for i in range(len(segs)):
        start = bounds[i][1]
        end = bounds[i + 1][0] if i + 1 < len(bounds) else tail
        out.append((start, max(end, start + 0.3)))
    return out, dur, True


def spoken(s):
    t = " ".join(s["text"].split())
    if s["id"] == 1:
        return "La Paire."
    return {"1": "Un.", "2": "Deux.", "3": "Trois.", "4": "Quatre."}.get(t, t)


def words_of(timeline):
    for e in timeline:
        if e["type"] == "word":
            yield e
        elif e.get("timeline"):
            yield from words_of(e["timeline"])


def align_words(segs, path):
    """Forced-alignment word times (echogarden, see video/tts/align.sh) mapped
    onto each segment: s["ct"] holds a (start, end) per normalised character."""
    import difflib
    words = list(words_of(json.load(open(path))))
    chars, times = [], []
    for w in words:
        n = norm(w["text"])
        for k in range(len(n)):
            d = (w["endTime"] - w["startTime"]) / len(n)
            chars.append(n[k]); times.append((w["startTime"] + d * k, w["startTime"] + d * (k + 1)))
    want = "".join(norm(spoken(x)) for x in segs)
    got = "".join(chars)
    if want == got:
        mapped = times
    else:  # small tokenisation differences: map through a diff
        mapped = [None] * len(want)
        m = difflib.SequenceMatcher(None, want, got, autojunk=False)
        for a, b, size in m.get_matching_blocks():
            for k in range(size):
                mapped[a + k] = times[b + k]
        last = (0.0, 0.0)
        for k in range(len(mapped)):
            mapped[k] = mapped[k] or (last[1], last[1])
            last = mapped[k]
    pos, spans = 0, []
    for x in segs:
        n = len(norm(spoken(x)))
        x["ct"] = mapped[pos:pos + n]
        spans.append((x["ct"][0][0], x["ct"][-1][1]) if n else (0, 0))
        pos += n
    return spans


def ass_time(t):
    h, t = divmod(t, 3600); m, s = divmod(t, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}"


def snap_cues(cues, sil):
    """Move each cue start onto the end of a nearby pause: sentences usually
    start right after one, and this corrects the even-spread estimate."""
    ends = sorted(b for a, b in sil)
    import bisect
    for c in cues:
        k = bisect.bisect_left(ends, c[0] - 1.2)
        near = [e for e in ends[k:k + 6] if abs(e - c[0]) <= 1.2]
        if near:
            c[0] = min(near, key=lambda e: abs(e - c[0])) - 0.08
    for i in range(len(cues) - 1):
        a, b = cues[i], cues[i + 1]
        if b[0] <= a[0] + 0.5:
            b[0] = a[0] + 0.5
        a[1] = min(max(a[1], a[0] + 1.2), b[0] - 0.04)
        if 0 < b[0] - a[1] < 0.6:
            a[1] = b[0] - 0.04
    # Cues too short to read join the next line from the same voice type.
    out = []
    for c in cues:
        if out and out[-1][1] - out[-1][0] < 1.0 and out[-1][3] == c[3]:
            out[-1] = [out[-1][0], c[1], out[-1][2] + " " + c[2], c[3]]
        else:
            out.append(list(c))
    return out


def sentence_cues(ordered, sentences):
    """Time each translated sentence by where its French text falls in the
    narration: characters are spread evenly over their segment's span."""
    stream = []  # (segment, char index within segment, segment length)
    for s in ordered:
        if s["id"] == 1 or s["text"].strip().isdigit():
            continue
        n = len(norm(s["text"]))
        stream += [(s, i, n) for i in range(n)]

    def at(pos, end=False):
        s, i, n = stream[min(pos, len(stream) - 1)]
        if "ct" in s:  # real word timing
            return s["chunk_t0"] + s["ct"][i][1 if end else 0]
        k = (i + (1 if end else 0)) / n
        return s["start"] + (s["end"] - s["start"]) * k

    cues, pos = [], 0
    for x in sentences:
        n = len(norm(x["original"]))
        a, b = at(pos), at(pos + n - 1, end=True)
        en = x["english"].strip()
        dialogue = stream[min(pos, len(stream) - 1)][0]["voice"] != "narrator"
        en = en.lstrip("— ").strip()
        cues.append([a, b, en, dialogue])
        pos += n
    # Keep each cue on screen at least 1.2 s and close small gaps, without overlaps.
    for i, c in enumerate(cues):
        nxt = cues[i + 1][0] if i + 1 < len(cues) else c[1] + 2
        c[1] = min(max(c[1], c[0] + 1.2), nxt - 0.04) if nxt - c[1] > 0.04 else c[1]
        if 0 < nxt - c[1] < 0.6:
            c[1] = nxt - 0.04
    return cues


def main():
    lib, build = sys.argv[1], sys.argv[2]
    script = json.load(open(os.path.join(lib, "tts-script.json")))
    trans = json.load(open(os.path.join(lib, "translation.json")))
    segs = {s["id"]: dict(s) for s in script["segments"]}
    ordered = [segs[i] for i in sorted(segs)]
    attach_english(ordered, trans["sentences"])
    chunks = json.load(open(os.path.join(build, "audio", "chunks.json")))
    t, real, files, allsil, aligned = 0.0, [], [], [], []
    for i, ids in enumerate(chunks, 1):
        wav = os.path.join(build, "audio", f"chunk{i:02d}.wav")
        spans, dur, ok = align_chunk([segs[x] for x in ids], wav)
        words = os.path.join(build, "align", f"chunk{i:02d}.json")
        if ok and os.path.exists(words):
            spans = align_words([segs[x] for x in ids], words)
            aligned.append(i)
        real.append(ok)
        if ok:
            files.append(wav)
            allsil += [(t + a, t + b) for a, b in silences(wav)[0]]
        for x, (a, b) in zip(ids, spans):
            segs[x]["start"], segs[x]["end"], segs[x]["chunk"], segs[x]["chunk_t0"] = t + a, t + b, i, t
        t += dur
    total = t
    json.dump([{k: v for k, v in x.items() if k != "ct"} for x in ordered],
              open(os.path.join(build, "segments.json"), "w"), ensure_ascii=False, indent=1)

    # Scenes: about SCENE_CHARS each, cut only before narrator lines, always at chapters.
    scenes, cur, n = [], [], 0
    for s in ordered:
        new_ch = cur and s["chapter"] != cur[-1]["chapter"] and cur[-1]["chapter"] > 0
        if cur and s["voice"] == "narrator" and (new_ch or n > SCENE_CHARS):
            scenes.append(cur); cur, n = [], 0
        cur.append(s); n += len(s["text"])
    scenes.append(cur)
    out = []
    os.makedirs(os.path.join(build, "timing"), exist_ok=True)
    for k, sc in enumerate(scenes, 1):
        start = 0.0 if k == 1 else sc[0]["start"]
        end = scenes[k][0]["start"] if k < len(scenes) else total
        tm = {"dur": round(end - start, 3),
              "starts": {s["id"]: round(s["start"] - start, 3) for s in sc},
              "ends": {s["id"]: round(s["end"] - start, 3) for s in sc}}
        json.dump(tm, open(os.path.join(build, "timing", f"s{k:02d}.json"), "w"))
        out.append({"scene": k, "start": round(start, 3), "end": round(end, 3), "dur": tm["dur"],
                    "chapter": sc[0]["chapter"], "segments": [s["id"] for s in sc]})
    json.dump(out, open(os.path.join(build, "scenes.json"), "w"), indent=1)

    head = """[Script Info]
ScriptType: v4.00+
PlayResX: 1280
PlayResY: 720
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Sub,DejaVu Sans,30,&H00F2F2F2,&H00FFFFFF,&H00101010,&H90000000,0,0,0,0,100,100,0,0,1,2.2,0.8,2,140,140,46,1
Style: Speaker,DejaVu Sans,30,&H00A8D8F0,&H00FFFFFF,&H00101010,&H90000000,0,1,0,0,100,100,0,0,1,2.2,0.8,2,140,140,46,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    lines = []
    cues = sentence_cues(ordered, trans["sentences"])
    # With word timing the cues are already right; otherwise snap them to pauses.
    cues = snap_cues(cues, [] if len(aligned) == len(chunks) else allsil)
    for a, b, x, dialogue in cues:
        style = "Speaker" if dialogue else "Sub"
        lines.append(f"Dialogue: 0,{ass_time(a)},{ass_time(b)},{style},,0,0,0,,{x}")
    open(os.path.join(build, "subs.ass"), "w").write(head + "\n".join(lines) + "\n")
    print(f"{len(scenes)} scenes, total {total/60:.1f} min, chunks with audio: {sum(real)}/{len(real)}, word-aligned: {len(aligned)}")
    for o in out:
        print(f"  s{o['scene']:02d} ch{o['chapter']} {o['dur']:6.1f}s segs {o['segments'][0]}-{o['segments'][-1]}")


if __name__ == "__main__":
    main()
