"""Make one story, from dice to package.

    python -m pipeline.run                 # a new story
    python -m pipeline.run --resume ID     # continue a story that stopped
    python -m pipeline.run --dry-run       # no API calls: check the wiring and prompt sizes

Every stage writes its output into library/<id>/work/. A stage whose output
already exists is not run again, so a stopped run resumes where it left off.
The order and the inputs follow prompts/README.md.
"""

import argparse
import datetime
import difflib
import json
import random
import re
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import yaml

from . import dice, vocab
from .llm import LLM
from .prompts import (PROMPTS, ROOT, bare_json, chapters, last_json, load, section,
                      user_message, without_json)

LIBRARY = ROOT / "library"
LEDGER = LIBRARY / "ledger.jsonl"
LENSES = ["core-dramatic", "jungian", "lacanian", "transurfing", "ifs", "defences-attachment", "existential"]
EFFORT = {True: "high", False: "medium"}


class Story:
    def __init__(self, story_id, prefs, llm):
        self.id = story_id
        self.dir = LIBRARY / story_id
        self.work = self.dir / "work"
        self.work.mkdir(parents=True, exist_ok=True)
        self.prefs = prefs
        self.lang = prefs["language"]
        self.level = prefs["level"]
        self.llm = llm
        # A dry run keeps its ledger row to itself, so the real library stays clean.
        self.ledger_path = self.work / "ledger-dry.jsonl" if llm.dry_run else LEDGER

    # -- plumbing -----------------------------------------------------------

    def path(self, name):
        return self.work / name

    def saved(self, name):
        p = self.path(name)
        return p.read_text(encoding="utf-8") if p.exists() else None

    def save(self, name, text):
        p = self.path(name)
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(text, encoding="utf-8")
        return text

    def run(self, prompt, out, **inputs):
        """Run a prompt file once; its output is cached under `out`."""
        cached = self.saved(out)
        if cached is not None:
            return cached
        meta, system = load(prompt, self.lang, self.level)
        effort = meta.get("effort") or EFFORT[bool(meta.get("thinking"))]
        print(f"> {out}", flush=True)
        text, _ = self.llm.call(system, [{"role": "user", "content": user_message(inputs)}],
                                effort, label=out.rsplit(".", 1)[0].replace("../", "").replace("/", "_"))
        return self.save(out, text)

    def parallel(self, jobs):
        """Run several (prompt, out, inputs) jobs at once; results in order."""
        with ThreadPoolExecutor(max_workers=8) as pool:
            futures = [pool.submit(self.run, p, o, **i) for p, o, i in jobs]
            return [f.result() for f in futures]

    def file(self, rel):
        return (PROMPTS / rel).read_text(encoding="utf-8")

    # -- stages -------------------------------------------------------------

    def make(self):
        ledger = read_ledger()
        summary = ledger_summary(ledger)

        # 0. Dice
        roll_text = self.saved("00-roll.yaml")
        if roll_text is None:
            roll_text = self.save("00-roll.yaml", yaml.safe_dump(dice.roll(self.prefs, ledger), allow_unicode=True,
                                                                 sort_keys=False, width=120))
        roll = yaml.safe_load(roll_text)
        mech = roll["mechanism"]["primary"]
        collision = (roll.get("collision_mechanism") or {}).get("primary")

        # 1. Director
        recipe = self.run("01-director/director.md", "01-recipe.md", roll=roll_text,
                          mechanism=self.file(f"universals/{mech}.md"),
                          collision_mechanism=self.file(f"universals/{collision}.md") if collision else "none",
                          ledger_summary=summary)
        swap = last_json(recipe).get("swap")
        if swap == "mechanism":
            mech = roll["mechanism"]["alternate"]
        recipe = without_json(recipe)
        mechanism = self.file(f"universals/{mech}.md")
        collision_text = self.file(f"universals/{collision}.md") if collision else "none"
        pitch_intent = section(recipe, "Pitch intent")
        changed_rule = recipe_field(recipe, "changed_rule") or "none"

        # 2. Concept
        premises = self.run("02-concept/generate-premises.md", "02a-premises.md", recipe=recipe,
                            mechanism=mechanism, collision_mechanism=collision_text)
        judged = self.run("02-concept/judge-premises.md", "02b-premise.md", recipe=recipe,
                          premises=premises, ledger_summary=summary)
        premise = section(judged, "Final premise") or without_json(judged)

        # 3. Character forge
        names = dice.names_for(place_region(roll, recipe), random.Random(self.id))
        dossier = self.run("03-character/dossier.md", "03a-dossier.md", recipe=recipe, premise=premise,
                           mechanism=mechanism, names=names)
        interview = self.run("03-character/interview.md", "03b-interview.md", dossier=dossier)
        cast_text = self.run("03-character/supporting-cast.md", "03d-cast.md", recipe=recipe, premise=premise,
                             mechanism=mechanism, dossier=dossier, interview=interview, names=names)
        jobs = [(f"03-character/lenses/{lens}.md", f"03c-lens-{lens}.md",
                 dict(dossier=dossier, interview=interview, mechanism=mechanism, mode="full"))
                for lens in LENSES]
        cast = last_json(cast_text).get("cast", [])
        for member in cast:
            sheet = cast_section(cast_text, member["name"])
            for lens in member.get("lenses", [])[:2]:
                jobs.append((f"03-character/lenses/{lens}.md", f"03d-cast-lens-{slug(member['name'])}-{lens}.md",
                             dict(dossier=sheet, interview="None: a supporting character, read from the cast sheet "
                                  "alone. Treat the sheet as fact.", mechanism=mechanism, mode="light")))
        results = self.parallel(jobs)
        lenses = "\n\n".join(results[:len(LENSES)])
        cast_lenses = "\n\n".join(results[len(LENSES):]) or "none"
        characters = self.run("03-character/case-conference.md", "03e-characters.md", recipe=recipe,
                              premise=premise, mechanism=mechanism, dossier=dossier, interview=interview,
                              lenses=lenses, cast=without_json(cast_text), cast_lenses=cast_lenses)

        shared = dict(recipe=recipe, premise=premise, mechanism=mechanism, characters=characters,
                      lenses=lenses, pitch_intent=pitch_intent, changed_rule=changed_rule, summary=summary)

        # 4-9. Plot onwards; a structural failure sends the story back to the plot once.
        replot_notes = None
        tries = 1 + self.prefs["pipeline"].get("plot_retries_max", 1)
        for attempt in range(1, tries + 1):
            result = self.from_plot(f"plot-{attempt}", shared, replot_notes)
            if result["status"] != "back to plot" or attempt == tries:
                break
            replot_notes = result["notes"]

        roll_used = used_ingredients(roll, recipe, swap, mech)
        if result["status"] != "publish":
            write_ledger(self.ledger_path, {"id": self.id, "date": today(), "status": "discarded",
                          "reason": result["status"], "roll": roll_used})
            print(f"Discarded: {result['status']}. Notes are in {self.work}")
            return
        self.package(result, shared, roll_used)

    def from_plot(self, d, s, replot_notes):
        """Stages 4 to 9 for one plot attempt, in work/<d>/."""
        cfg = self.prefs["pipeline"]
        skeletons = self.run("04-plot/skeletons.md", f"{d}/04a-skeletons.md", recipe=s["recipe"],
                             premise=s["premise"], mechanism=s["mechanism"], characters=s["characters"],
                             replot_notes=replot_notes)
        judged = self.run("04-plot/judge-skeletons.md", f"{d}/04b-skeleton.md", recipe=s["recipe"],
                          characters=s["characters"], skeletons=skeletons)
        skeleton = section(judged, "Chosen skeleton") or without_json(judged)
        beats = re.search(r"Rejected likely beats:\s*(.+)", skeleton)
        rejected_beats = beats.group(1).strip() if beats else "none recorded"
        ending = without_json(self.run("04-plot/ending.md", f"{d}/04c-ending.md", recipe=s["recipe"],
                                       characters=s["characters"], skeleton=skeleton))
        plan = self.run("04-plot/scene-plan.md", f"{d}/04d-scene-plan.md", recipe=s["recipe"],
                        characters=s["characters"], skeleton=skeleton, ending=ending)
        fair = self.run("04-plot/fair-play-check.md", f"{d}/04e-fair-play.md", scene_plan=plan, ending=ending)
        if last_json(fair).get("fixes_needed", 0):
            plan = self.run("04-plot/scene-plan.md", f"{d}/04d-scene-plan-2.md", recipe=s["recipe"],
                            characters=s["characters"], skeleton=skeleton, ending=ending,
                            fair_play=f"{without_json(fair)}\n\nYour earlier plan:\n\n{plan}")

        world = self.run("05-world/world.md", f"{d}/05-world.md", recipe=s["recipe"], characters=s["characters"],
                         scene_plan=plan, ending=ending, changed_rule=s["changed_rule"])
        palette = section(world, "Palette") or ""

        brief_out = self.run("06-assembler/build-brief.md", f"{d}/06-brief.md", recipe=s["recipe"],
                             premise=s["premise"], characters=s["characters"], skeleton=skeleton, ending=ending,
                             scene_plan=plan, fair_play=without_json(fair), world=world,
                             exemplars=self.file(f"_shared/exemplars/{self.lang}-{self.level}.md"))
        brief = brief_out.split("# Assembler log")[0].strip()

        # 7. Two drafts, then a blind comparison.
        drafts = self.parallel([("07-writer/writer-base.md", f"{d}/07-draft-{x}.md", dict(brief=brief))
                                for x in "ab"[:cfg.get("drafts", 2)]])
        order = random.Random(self.id + d).sample(range(len(drafts)), len(drafts))
        if len(drafts) > 1:
            cmp_ = self.run("08-critique/compare.md", f"{d}/08a-chosen.md", pitch_intent=s["pitch_intent"],
                            draft_x=drafts[order[0]], draft_y=drafts[order[1]])
            c = last_json(cmp_)
            story = drafts[order[0] if c.get("choice", "X").upper() == "X" else order[1]]
            borrow = c.get("borrow") or None
        else:
            story, borrow = drafts[0], None

        # 8. Story loop.
        versions, notes_all, plans_all = [story], [], []
        decision = {"decision": "done"}
        for rnd in range(1, cfg.get("story_rounds_max", 2) + 1):
            notes = self.story_critics(f"{d}/r{rnd}", story, s, rejected_beats)
            notes_all.append(notes)
            plan_out = self.run("08-critique/editor.md", f"{d}/r{rnd}/08c-plan.md", brief=brief, story=story,
                                notes=notes, round=str(rnd))
            plans_all.append(plan_out)
            decision = last_json(plan_out)
            kind = str(decision.get("decision", "")).lower()
            if "plot" in kind:
                return {"status": "back to plot", "notes": without_json(plan_out)}
            if kind != "revise":
                break
            story = self.run("09-revise/rewrite.md", f"{d}/r{rnd}/08d-draft.md", brief=brief, story=story,
                             plan=without_json(plan_out), borrow=borrow)
            versions.append(story)
            borrow = None
        # 9. Language loop on the latest version, then the blind final judge.
        polished, changes = self.language_loop(f"{d}/lang-latest", story, palette)
        reread = self.run("08-critique/cold-reread.md", f"{d}/lang-latest/09c-reread.md", story=polished)
        candidates = versions[:-1] + [polished]
        labels = "ABCDEFGH"
        shuffled = random.Random(self.id + d + "judge").sample(range(len(candidates)), len(candidates))
        version_text = "\n\n".join(f'<version id="{labels[i]}">\n{candidates[k]}\n</version>'
                                   for i, k in enumerate(shuffled))
        final_out = self.run("08-critique/final-judge.md", f"{d}/09d-final.md", pitch_intent=s["pitch_intent"],
                             versions=version_text, reread=reread)
        final = last_json(final_out)
        if not final.get("publish", False):
            return {"status": "back to plot", "notes": without_json(final_out)}
        chosen = shuffled[labels.index(final.get("choice", "A"))]
        if chosen != len(candidates) - 1:
            polished, changes = self.language_loop(f"{d}/lang-chosen", candidates[chosen], palette)
            reread = self.run("08-critique/cold-reread.md", f"{d}/lang-chosen/09c-reread.md", story=polished)

        return {"status": "publish", "story": polished, "world": world, "palette": palette, "skeleton": skeleton,
                "final": final_out, "final_json": final, "reread": reread, "changes": changes,
                "notes": "\n\n".join(notes_all), "plans": "\n\n".join(plans_all)}

    def story_critics(self, d, story, s, rejected_beats):
        jobs = [("08-critique/cold-reader.md", f"{d}/08b-notes-cold-reader.md", dict(story=story)),
                ("08-critique/character-truth.md", f"{d}/08b-notes-character-truth.md",
                 dict(story=story, characters=s["characters"], lenses=s["lenses"])),
                ("08-critique/cliche.md", f"{d}/08b-notes-cliche.md",
                 dict(story=story, ledger_summary=s["summary"], rejected_beats=rejected_beats))]
        with ThreadPoolExecutor(max_workers=4) as pool:
            futures = [pool.submit(self.run, p, o, **i) for p, o, i in jobs]
            predictor = pool.submit(self.predictor, f"{d}/08b-notes-predictor.md", story, rejected_beats)
            reports = [f.result() for f in futures] + [predictor.result()]
        names = ["cold reader", "character truth", "cliché", "predictor"]
        return "\n\n".join(f'<report critic="{n}">\n{r}\n</report>' for n, r in zip(names, reports))

    def predictor(self, out, story, rejected_beats):
        """The predictor reads one chapter per turn, guessing what comes next."""
        cached = self.saved(out)
        if cached is not None:
            return cached
        meta, system = load("08-critique/predictor.md", self.lang, self.level)
        title, chs = chapters(story)
        messages, transcript = [], []
        print(f"> {out} ({len(chs)} chapters)", flush=True)
        for n, text in enumerate(chs, 1):
            body = (f"# {title}\n\n" if n == 1 else "") + f'<chapter n="{n}">\n{text}\n</chapter>'
            if n == len(chs):
                body += f"\n\n<end/>\n\n<rejected_beats>\n{rejected_beats}\n</rejected_beats>"
            messages.append({"role": "user", "content": body})
            reply, content = self.llm.call(system, messages, EFFORT[bool(meta.get("thinking"))],
                                           label=f"predictor-{Path(out).parent.name}-ch{n}")
            messages.append({"role": "assistant", "content": content})
            transcript.append(reply)
        self.save(out.replace(".md", "-turns.md"), "\n\n---\n\n".join(transcript))
        return self.save(out, transcript[-1])

    def language_loop(self, d, story, palette):
        title, chs = chapters(story)
        report = vocab.report(story, chs, self.lang, self.level, palette)
        self.save(f"{d}/09a-vocab-report.md", report)
        level, ear, aloud = self.parallel([
            ("08-critique/level.md", f"{d}/09a-notes-level.md", dict(story=story, palette=palette, vocab_report=report)),
            ("08-critique/native-ear.md", f"{d}/09a-notes-native-ear.md", dict(story=story)),
            ("08-critique/read-aloud.md", f"{d}/09a-notes-read-aloud.md", dict(story=story))])
        out = self.run("09-revise/language-pass.md", f"{d}/09b-story.md", story=story, palette=palette,
                       level_notes=level, native_ear_notes=ear, read_aloud_notes=aloud)
        parts = re.split(r"^---\s*$", out, maxsplit=1, flags=re.M)
        return parts[0].strip(), (parts[1].strip() if len(parts) > 1 else "")

    def package(self, r, s, roll_used):
        story = r["story"]
        self.save("../story.md", story + "\n")
        jobs = [("10-package/translation.md", "10-translation.json", dict(story=story, palette=r["palette"])),
                ("10-package/report-card.md", "../report-card.md",
                 dict(recipe=s["recipe"], premise=s["premise"], characters=s["characters"], final_judge=r["final"],
                      critic_notes=r["notes"], editor_plans=r["plans"], language_changes=r["changes"],
                      reread=r["reread"])),
                ("10-package/tts-script.md", "10-tts-script.json", dict(story=story, characters=s["characters"])),
                ("10-package/image-prompt.md", "../image-prompt.md",
                 dict(story=story, world=r["world"], characters=s["characters"])),
                ("10-package/ledger-entry.md", "10-ledger-entry.json",
                 dict(recipe=s["recipe"], premise=s["premise"], characters=s["characters"], skeleton=r["skeleton"],
                      world=r["world"], story=story, final_judge=r["final"]))]
        translation, _, tts, _, entry = self.parallel(jobs)
        for name, text in (("translation.json", translation), ("tts-script.json", tts)):
            try:
                self.save(f"../{name}", json.dumps(bare_json(text), ensure_ascii=False, indent=1))
            except ValueError:
                print(f"warning: {name} is not valid JSON; the raw output is in work/")
        row = bare_json(entry)
        row.update({"id": self.id, "date": today(), "status": "published", "roll": roll_used,
                    "scores": r["final_json"].get("scores", row.get("scores"))})
        write_ledger(self.ledger_path, row)
        print(f"Done: {self.dir}  (cost ${self.llm.cost:.2f})")


# -- helpers ----------------------------------------------------------------

def today():
    return datetime.date.today().isoformat()


def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def read_ledger():
    if not LEDGER.exists():
        return []
    return [json.loads(l) for l in LEDGER.read_text(encoding="utf-8").splitlines() if l.strip()]


def write_ledger(path, row):
    path.parent.mkdir(exist_ok=True)
    with path.open("a", encoding="utf-8") as f:
        f.write(json.dumps(row, ensure_ascii=False) + "\n")


def ledger_summary(ledger, n=25):
    rows = [r for r in ledger if r.get("status") == "published"][-n:]
    if not rows:
        return "The library is empty. This is the first story."
    return "\n".join(f"- {r.get('title_en')}: {r.get('logline')} | {r.get('mechanism')} | {r.get('costume')} | "
                     f"{r.get('structure')} | {r.get('place')} | {r.get('ending_type')}" for r in rows)


def recipe_field(recipe, key):
    m = re.search(rf"^{key}:\s*(.+)$", recipe, re.M)
    return m.group(1).strip() if m else None


def place_region(roll, recipe):
    """The names region follows the place the director kept."""
    p = roll["place"]
    used = recipe_field(recipe, "place") or p["primary"]
    if p.get("alternate") and (difflib.SequenceMatcher(None, used, p["alternate"]).ratio()
                               > difflib.SequenceMatcher(None, used, p["primary"]).ratio()):
        return p.get("alternate_region")
    return p.get("primary_region")


def cast_section(cast_text, name):
    """A supporting character's sheet: the '## <name>, <age>' section."""
    m = re.search(rf"^##\s+{re.escape(name)}\b.*?(?=^##\s|\Z)", cast_text, re.S | re.M)
    return m.group(0).strip() if m else name


def used_ingredients(roll, recipe, swap, mech):
    """What the story actually used, for cooldowns."""
    used = {"mechanism": mech, "costume": recipe_field(recipe, "costume")}
    for key in dice.BANKS.values():
        if roll.get(key):
            used[key] = roll[key]["alternate" if swap == key else "primary"]
    return used


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--resume", metavar="ID", help="continue the story in library/ID")
    ap.add_argument("--dry-run", action="store_true", help="no API calls; save each request for inspection")
    args = ap.parse_args()

    prefs = yaml.safe_load((ROOT / "config" / "preferences.yaml").read_text(encoding="utf-8"))
    if args.resume:
        story_id = args.resume
    else:
        n = len(read_ledger()) + 1  # numbered by ledger rows, published or discarded
        story_id = f"{today()}-{n:03d}" + ("-dry" if args.dry_run else "")
        while (LIBRARY / story_id).exists():
            n += 1
            story_id = f"{today()}-{n:03d}" + ("-dry" if args.dry_run else "")
    (LIBRARY / story_id / "work").mkdir(parents=True, exist_ok=True)
    llm = LLM(prefs.get("runner", {}).get("model", "claude-opus-5-5"),
              LIBRARY / story_id / "work" / "calls.jsonl", dry_run=args.dry_run)
    print(f"Story {story_id}")
    try:
        Story(story_id, prefs, llm).make()
    finally:
        print(f"Spent ${llm.cost:.2f} in this run. Call log: library/{story_id}/work/calls.jsonl")


if __name__ == "__main__":
    sys.exit(main())
