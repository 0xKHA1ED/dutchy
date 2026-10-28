# Universal mechanisms

Every story in this project starts from a **mechanism**: a process that runs in every human mind and reliably makes people act against their own interest, misread each other or want the wrong thing. Not a theme. A theme ("loneliness", "AI") tells a model what to talk about, and it will talk about it, which is exactly the lecture we want to avoid. A mechanism tells the model *how a person malfunctions*, and malfunction produces plot, conflict and twists on its own.

The genre is a costume the mechanism wears. Projection can be a noir, a workplace comedy or a science-fiction story. The listener's recognition comes from the mechanism, not the costume, which is why these stories can reach anyone.

## How the library is used

- The dice roll one **primary mechanism** per story, and about 30% of the time a **collision mechanism** that grinds against it (mimetic desire plus a scapegoat is close to a complete plot on its own). Each mechanism has a cooldown so the library stays varied; see `config/preferences.yaml`.
- The director, premise generator, character forge and plot stage all read the mechanism file. The lenses then explain how *this particular person* runs it.
- The cold-reader critic is never shown the mechanism. If it names something close to it unprompted, the story is doing its job.

## File format

Each file follows the same headings, so stages can find what they need:

- **In one line** — the mechanism as a single sentence a non-psychologist would understand.
- **How it runs** — the inner sequence: the trigger, the inner move, the visible behaviour, the cost.
- **From outside** — what other people see; behaviours a camera could film.
- **Under pressure** — how it escalates, and how it breaks.
- **Lenses that see it best** — which of the seven character lenses illuminate it most.
- **Story shapes** — structures and surface-question types it suits.
- **Collisions** — mechanisms that make good partners for it.
- **Seeds** — a few one-line story ideas to show its range (examples, never to be reused as-is).
- **Traps** — the ways a model typically gets it wrong.

## Growing the library

The starter set holds sixteen mechanisms. The aim is 40 to 60. New entries can be drafted in bulk by a model and then curated by hand: keep only mechanisms that are universal (everyone has done this), specific (they predict concrete behaviour) and dramatic (they produce conflict when they run). Candidates for the next batch: displacement, reaction formation, learned helplessness, the sunk-cost trap, the impostor feeling, idealisation and devaluation, rescuer fantasies, nostalgia for a home that never existed, the need to be needed, revenge as a form of attachment, the Pygmalion effect, magical thinking, the bystander effect, splitting, scarcity mindset, the fear of being seen, loyalty to a dead person's wishes, identifying with the aggressor.
