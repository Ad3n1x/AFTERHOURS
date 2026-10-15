# AFTERHOURS — Gameplay Roadmap

The goal is a convincing Nigerian neighbourhood life simulator in the browser. Protect the playable core loop before increasing map size or feature count.

## Stage 1 — Stable playable loop

- [ ] Verify movement and collision at keyboard and touch controls.
- [ ] Make every visible interactable show a clear action and outcome.
- [ ] Validate hunger, energy, hygiene, cash and in-game time transitions.
- [ ] Make work shifts, purchases and transport pay/cost the correct amount exactly once.
- [ ] Verify save/load, corrupted save recovery, and a clean new-game option.
- [ ] Provide a clear pause/help panel and readable mobile HUD.

## Stage 2 — A neighbourhood with purpose

- [ ] Give a small set of NPCs distinct schedules and interaction lines.
- [ ] Add a handful of short jobs and repeatable errands with understandable rewards.
- [ ] Make shops, home, transport and work connect into one useful gameplay loop.
- [ ] Add a compact map legend and clear navigation landmarks.
- [ ] Keep the setting broadly Nigerian rather than treating one city as the whole country.

## Stage 3 — Performance and usability

- [ ] Test on a modest Android phone and a low-powered laptop.
- [ ] Cap rendering resolution based on device capability and handle WebGL failure gracefully.
- [ ] Reduce unnecessary per-frame React updates and repeated scene allocations.
- [ ] Add loading, pause, resume and graphics-quality states.
- [ ] Respect reduced-motion preferences where applicable and keep UI text legible.

## Stage 4 — Only after the loop is fun

- [ ] Add cloud saves/accounts only with a clear privacy model.
- [ ] Evaluate vehicles, larger districts and optional multiplayer against performance and scope.
- [ ] Keep multiplayer and online persistence explicitly out of scope until the single-player game is stable.

## Acceptance criteria

A new player should be able to start, explore, enter the home, complete a paid activity, spend money, and return later with their progress intact—without a broken control or unexplained state change.

This roadmap is a plan, not a claim that these tests have passed.
