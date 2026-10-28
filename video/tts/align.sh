#!/usr/bin/env bash
# Word-level forced alignment of each narration chunk against its known text,
# using echogarden (eSpeak reference + DTW, fully offline once installed).
#   video/tts/align.sh video/build/<id>
# Needs: npm i echogarden@2 in $ECHOGARDEN_DIR (default /tmp/claude-0/eg).
# The chunk texts (align/chunkNN.txt) must hold the spoken words; timeline.py
# reads the resulting align/chunkNN.json.
set -euo pipefail
B=$(realpath "$1"); EG=${ECHOGARDEN_DIR:-/tmp/claude-0/eg}
python3 - "$B" <<'P'
import json, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath("video/render/timeline.py"))))
from timeline import spoken
b = sys.argv[1]; lib = os.path.join("library", os.path.basename(b))
segs = {s["id"]: s for s in json.load(open(os.path.join(lib, "tts-script.json")))["segments"]}
os.makedirs(os.path.join(b, "align"), exist_ok=True)
for i, ids in enumerate(json.load(open(os.path.join(b, "audio", "chunks.json"))), 1):
    open(os.path.join(b, "align", f"chunk{i:02d}.txt"), "w").write("\n\n".join(spoken(segs[x]) for x in ids))
P
for wav in "$B"/audio/chunk*.wav; do
  n=$(basename "$wav" .wav)
  [ -f "$B/align/$n.json" ] && continue
  (cd "$EG" && ./node_modules/.bin/echogarden align "$wav" "$B/align/$n.txt" "$B/align/$n.json" --language=fr) | grep -E "Total|rror"
done
