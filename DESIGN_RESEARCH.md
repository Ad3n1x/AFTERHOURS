# AFTERHOURS — Game Design Research Notes

Research pass: 15 October 2026

## Scope and honesty

This is a focused review of representative developer talks, game critics, accessibility guidance, player-research practice, onboarding guidance, and game-development newsletter roundups. The games industry is too broad to claim that every website, critic, developer, and newsletter has been read. These sources were selected because they map directly to a browser-based investigative deduction game.

All new cases added in this pass are original fiction. The Nigerian and United States settings provide distinct everyday context; the cases are not presented as reconstructions of real crimes or accusations about real people.

## Sources reviewed

- GDC / Jon Ingold, inkle — [The Burden of Proof: Narrative Deduction Mechanics for Detective Games](https://www.gdcvault.com/play/1027723/The-Burden-of-Proof-Narrative): how a player can assemble a solution while the game distinguishes proof from speculation.
- Metacritic's critic-review collection for [The Case of the Golden Idol](https://www.metacritic.com/game/the-case-of-the-golden-idol/critic-reviews/) and [PC Gamer's review](https://www.pcgamer.com/the-case-of-the-golden-idol-review/): praise for observation, connected clues, deduction, and player-built narrative; also a reminder that searching and managing many clues can become cumbersome.
- Game Developer — [What defines a good puzzle/investigation game?](https://www.gamedeveloper.com/design/what-defines-a-good-puzzle-investigation-game-based-on-s-by-jj-abrams-and-doug-dorst): balance the puzzle, story, satisfaction, and frustration.
- Microsoft Xbox Game Accessibility Guidelines — [Adjusting cognitive demands](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/108): support puzzle solving across different memory and reasoning needs.
- Game Accessibility Guidelines — [Use simple, clear language](https://gameaccessibilityguidelines.com/use-simple-clear-language/) and [offer text-colour choices](https://gameaccessibilityguidelines.com/provide-a-choice-of-text-colour-low-high-contrast-choice-as-a-minimum/): reduce unnecessary reading friction and treat readability as part of inclusion.
- Games User Research — [Find usability issues with playtests](https://gamesuserresearch.com/find-usability-issues-in-games-with-playtests/) and [prioritise playtest issues](https://gamesuserresearch.com/how-to-prioritise-playtest-issues-and-player-feedback/): make expected player actions understandable and prioritise barriers that repeatedly block progress.
- GameAnalytics — [First-time user experience](https://www.gameanalytics.com/blog/tips-for-a-great-first-time-user-experience-ftue-in-f2p-games) and [immersive game intros](https://www.gameanalytics.com/blog/create-immersive-game-intros): let players reach the distinctive part of the experience quickly.
- Game Dev Essentials — [Game-development newsletters to follow](https://gamedevessentials.com/11-game-dev-newsletters-you-need-to-follow/): a map of newsletters and industry news sources for continued review, not evidence that every newsletter issue was read.

## Design principles applied

1. **Proof before accusation.** A record can establish a mismatch without proving who caused it or why. Case explanations now explicitly identify what the evidence supports and what remains unknown.
2. **Make clues easy to revisit.** Case search now includes evidence titles, types, timestamps, body text, case summaries, hints, and explanations—not just case titles and tags.
3. **Make investigation progress visible.** Players can mark exhibits as reviewed, see the reviewed count for the active case, and keep that progress on the same device.
4. **Preserve player access and control.** Larger text and reduced-motion settings now persist locally; reduced motion also defaults to the operating system preference unless the player has saved a choice.
5. **Use grounded, varied everyday contexts.** Added four fictional cases: a dispatch handover in Yaba, an inventory reconciliation at a Nigerian market cooperative, a duplicate accounting export in a U.S. arts office, and a campus archive timeline with UTC/EDT conversion.
6. **Keep the challenge fair.** Each new case has a testable question, a clue that can be cross-checked, one best-supported conclusion, an optional hint, and an explanation that shows the reasoning rather than rewarding dramatic guessing.
7. **Avoid false claims about the product.** No real-world allegations, public leaderboards, multiplayer, cloud sync, or AI case generation are implied by these additions.

## Verification still required

After this research pass, run a production build and inspect the deployed experience on desktop and a narrow mobile viewport. Research findings are design inputs, not a substitute for playtesting with real players. Any future difficulty, pacing, or clarity changes should be checked against observed player behaviour rather than assumed to be improvements.
