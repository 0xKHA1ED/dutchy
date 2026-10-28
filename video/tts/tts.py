"""Narrate a story's tts-script.json with Gemini TTS, in chunks, resumable.

python video/tts/tts.py library/<id> video/build/<id>/audio [--only N]
"""
import base64, json, os, sys, time, urllib.request, urllib.error, wave

MODEL = os.environ.get("DUTCHY_TTS_MODEL", "gemini-3.8-flash-tts")
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"
KEY = os.environ.get("DUTCHY_GEMINI_KEY") or os.environ["GEMINI_API_KEY"]

# Two speakers per request is the API maximum. Khadija gets her own voice;
# the narrator performs the minor characters, audiobook style.
VOICES = {"Narratrice": "Sulafat", "Khadija": "Gacrux"}
MINOR = {"souad", "dija", "fatiha", "voisine", "passant"}
TARGET_CHARS = 1900


def chunk(segments):
    out, cur, n = [], [], 0
    for s in segments:
        cur.append(s); n += len(s["text"])
        if n > TARGET_CHARS and s["voice"] == "narrator":
            out.append(cur); cur, n = [], 0
    if cur:
        if out and sum(len(s["text"]) for s in cur) < 900:
            out[-1] += cur
        else:
            out.append(cur)
    return out


NAMES = {"souad": "Souad", "dija": "Dija", "fatiha": "Fatiha",
         "voisine": "a neighbour", "passant": "a man in the alley"}
BASE = {
    "narrator": "Audiobook narration in natural, native standard French for B1 learners. "
                "Warm but dry and understated, medium-low, measured and clear, never rushed; "
                "small comic details played deadpan.",
    "khadija": "Khadija, 63, night cashier from Fès: natural French with a light Moroccan colour, "
               "slightly husky, quick and clipped, mostly under her breath, deadpan.",
}


def say(s):
    text = " ".join(s["text"].split())
    if s["id"] == 1:
        return "La Paire."
    if text.isdigit():
        return {"1": "Un.", "2": "Deux.", "3": "Trois.", "4": "Quatre."}[text]
    return text


def style(s, script):
    desc = {x["id"]: x["description"] for x in script["voices"]}
    if s["voice"] in MINOR:
        st = (f"The narrator performs {NAMES[s['voice']]}, shifting her voice clearly but without caricature. "
              f"{NAMES[s['voice']]}: {desc[s['voice']]}")
    else:
        st = BASE[s["voice"]]
    if s["direction"]:
        st += " Direction for this line: " + s["direction"]
    hints = [f"{p['text']}: {p['hint']}" for p in script["pronunciation"] if p["text"] in s["text"]]
    if hints:
        st += " Pronunciation: " + " ".join(hints)
    if s.get("pause_after", 0) >= 1:
        st += f" Leave a pause of about {s['pause_after']:.0f} seconds after this line."
    return st


def parts(script, segs):
    return [{"text": say(s),
             "speechMetadata": {"speaker": "Khadija" if s["voice"] == "khadija" else "Narratrice",
                                "style": style(s, script)}} for s in segs]


def call(ps):
    body = {
        "contents": [{"parts": ps}],
        "generationConfig": {
            "responseModalities": ["AUDIO"],
            "speechConfig": {"languageCode": "fr-FR", "multiSpeakerVoiceConfig": {"speakerVoiceConfigs": [
                {"speaker": k, "voiceConfig": {"prebuiltVoiceConfig": {"voiceName": n}}}
                for k, n in VOICES.items()]}},
        },
    }
    req = urllib.request.Request(URL, json.dumps(body).encode(),
                                 {"Content-Type": "application/json", "x-goog-api-key": KEY})
    with urllib.request.urlopen(req, timeout=600) as r:
        return json.load(r)


def main():
    lib, out = sys.argv[1], sys.argv[2]
    only = int(sys.argv[sys.argv.index("--only") + 1]) if "--only" in sys.argv else None
    os.makedirs(out, exist_ok=True)
    script = json.load(open(os.path.join(lib, "tts-script.json")))
    chunks = chunk(script["segments"])
    json.dump([[s["id"] for s in c] for c in chunks], open(os.path.join(out, "chunks.json"), "w"))
    for i, segs in enumerate(chunks, 1):
        if only and i != only:
            continue
        wav = os.path.join(out, f"chunk{i:02d}.wav")
        if os.path.exists(wav):
            continue
        text = parts(script, segs)
        json.dump(text, open(os.path.join(out, f"chunk{i:02d}.request.json"), "w"), ensure_ascii=False, indent=1)
        for attempt in range(6):
            t0 = time.time()
            try:
                resp = call(text)
                got = resp["candidates"][0]["content"]["parts"]
                part = got[0]["inlineData"]
                pcm = b"".join(base64.b64decode(p["inlineData"]["data"]) for p in got if "inlineData" in p)
                meta = [{k: v for k, v in p.items() if k != "inlineData"} | {"bytes": len(p.get("inlineData", {}).get("data", ""))} for p in got]
                json.dump({"parts": meta, "usage": resp.get("usageMetadata")}, open(wav + ".meta.json", "w"), indent=1)
                break
            except urllib.error.HTTPError as e:
                err = e.read().decode()[:1500]
                print(f"chunk {i} HTTP {e.code}: {err}", flush=True)
                if e.code == 429 and "PerDay" in err:
                    sys.exit("daily quota exhausted; rerun later to resume")
                if e.code == 400:
                    sys.exit("bad request")
                time.sleep(min(30 * 2 ** attempt, 300))
            except Exception as e:  # truncated or odd responses
                print(f"chunk {i} error: {e!r} {str(locals().get('resp'))[:500]}", flush=True)
                time.sleep(30)
        else:
            sys.exit(f"chunk {i} failed")
        if pcm[:4] == b"RIFF":  # 3.8 returns a ready WAV (24 kHz mono s16)
            open(wav, "wb").write(pcm)
        else:
            with wave.open(wav, "wb") as w:
                w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(pcm)
        print(f"chunk {i}/{len(chunks)}: {(len(pcm)-44)/48000:.1f}s audio, {time.time()-t0:.0f}s, mime {part['mimeType']}, usage {resp.get('usageMetadata')}", flush=True)
        time.sleep(25)


if __name__ == "__main__":
    main()
