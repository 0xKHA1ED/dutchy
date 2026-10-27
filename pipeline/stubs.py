"""Fake outputs for --dry-run: just enough structure (headings and JSON) for
every later stage to find what it reads, so the wiring can be tested free."""

STORY = """# Le titre

## 1

Il a ouvert la porte. Il faisait froid. Le rétroviseur était cassé.

## 2

Elle a souri. Il n'a rien dit.
"""

STUBS = {
    "01-recipe": "## Recipe\n\nmechanism: projection\nplace: stub place\ncostume: noir\nchanged_rule: none\n\n"
                 "## Pitch intent\n\nStub intent.\n\n## Swap\n\nNo swap.\n\n```json\n{\"swap\": null}\n```",
    "02b-premise": "## Final premise\n### Stub\nA premise.\n\n```json\n{\"winner\": 1, \"graft_from\": null}\n```",
    "03d-cast": "## Sylvie, 50\nA neighbour.\n\n## The cast as system\nStub.\n\n"
                "```json\n{\"cast\": [{\"name\": \"Sylvie\", \"lenses\": [\"jungian\", \"ifs\"]}]}\n```",
    "04b-skeleton": "## Chosen skeleton (final)\nStub.\nRejected likely beats: a, b, c\n\n"
                    "```json\n{\"winner\": 1, \"graft_from\": null, \"gates_passed\": true}\n```",
    "04c-ending": "## Ending type\nStub.\n\n```json\n{\"tests_passed\": true}\n```",
    "04e-fair-play": "## Fixes\nOne.\n\n```json\n{\"fair\": false, \"fixes_needed\": 1}\n```",
    "05-world": "## Places\nStub.\n\n## Palette\n| Word | English | Stretch? | Scenes |\n| rétroviseur | mirror | yes | 1, 3 |\n",
    "06-brief": "# Brief\n\nStub brief.\n\n# Assembler log\n\nStub log.",
    "07-draft": STORY,
    "08a-chosen": "## Choice\nY.\n\n```json\n{\"choice\": \"Y\", \"borrow\": \"\"}\n```",
    "08b-notes": "## Notes\nStub.\n\n```json\n{\"critic\": \"stub\", \"scores\": {}, \"fatal\": 0, \"serious\": 0, \"minor\": 0}\n```",
    "r1_08c-plan": "## Decision\nrevise\n\n```json\n{\"decision\": \"revise\", \"recognition_pass\": true, "
                   "\"surprise_pass\": false, \"changes\": 2}\n```",
    "r2_08c-plan": "## Decision\ndone\n\n```json\n{\"decision\": \"done\", \"recognition_pass\": true, "
                   "\"surprise_pass\": true, \"changes\": 0}\n```",
    "08d-draft": STORY,
    "09b-story": STORY + "\n---\n\n## Changes\n- stub\n",
    "09d-final": "## Choice\nA.\n\n```json\n{\"choice\": \"A\", \"scores\": {\"hook\": 4}, \"publish\": true}\n```",
    "10-translation": "{\"title\": {\"original\": \"Le titre\", \"english\": \"The title\"}, \"sentences\": []}",
    "10-tts-script": "{\"voices\": [], \"segments\": []}",
    "10-ledger-entry": "{\"title\": \"Le titre\", \"title_en\": \"The title\", \"logline\": \"Stub.\"}",
}


def stub(label):
    for key, text in STUBS.items():
        if label.endswith(key) or key in label and key.startswith(("07", "08b", "08d")):
            return text
    return f"Stub output for {label}."
