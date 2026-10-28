# Story runner

A small runner for the prompt tree in `prompts/`: it rolls the dice, runs every stage in order with Claude Opus 5.5, and packages the result. The prompts are where the craft is. This code just moves text between them.

## Run

```
pip install -r pipeline/requirements.txt
export DUTCHY_ANTHROPIC_KEY=...   # or ANTHROPIC_API_KEY
python -m pipeline.run
```

A story takes about 55 model calls and a while to finish. Everything lands in `library/<id>/`:

- `story.md`, `report-card.md`, `image-prompt.md`, `translation.json`, `translation-en.md` (the English translation as a page to read), `tts-script.json`
- `work/`: every stage's output, the vocabulary reports, `calls.jsonl` (tokens and cost of each call), `requests/` (the full request each call sent) and `thinking/` (the model's summarised thinking for each call)

The finished story is added as one row to `library/ledger.jsonl`. A discarded story also gets a row, with `status: discarded`. The ledger feeds the cooldowns and the director's view of what the library already holds.

If a run stops (network, rate limit), `python -m pipeline.run --resume <id>` continues it. Stages whose output already exists are skipped.

`python -m pipeline.run --dry-run` makes no API calls. It returns stub outputs and saves every request it would send to `work/requests/`, as real runs do, so you can check how prompts are assembled and how big they are. Dry runs go to `library/<id>-dry/`, which git ignores.

## Files

- `run.py`: the stages, in the order of the table in `prompts/README.md`
- `dice.py`: the dice, seed banks, weights and cooldowns from `config/preferences.yaml`
- `prompts.py`: frontmatter, `{{include}}`, placeholders, and reading headings and JSON from outputs
- `llm.py`: the one function that calls the API (adaptive thinking; effort comes from each prompt's `thinking:` flag, or an `effort:` key if a prompt sets one; refusals fall back server-side)
- `vocab.py` and `data/fr-frequency.txt`: the mechanical vocabulary check for the level critic
- `stubs.py`: fake outputs for dry runs
