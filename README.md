# Evolutionary Creatures

Genetic algorithm simulation where simple creatures evolve behaviors to survive on a 2D canvas by seeking food, avoiding poison, and reproducing based on fitness.

Live demo: https://evocre.ashkankardan.com/

## How to Run
- Recommended: serve the `public` folder over HTTP because ES modules are used.
- Quick local server (Python):
  - `cd public`
  - `python3 -m http.server 8000`
  - Open http://localhost:8000 in a modern browser.
- Alternative: `npx serve public` (requires Node) or deploy with `firebase deploy` if the Firebase CLI is installed and configured.

## Controls and Gameplay
- Setup: click the canvas to place up to 20 poison spots, then press `Start`.
- Simulation: creatures move, eat food to gain health, and die on poison. Stats update each second; evolution runs periodically to add offspring.
- `Stop` ends the run early; `Reset` restarts fresh. Toggle `Perception` to show each creature’s sensing/weight vectors.

## Project Structure
- `public/index.html` – Main page; loads the canvas UI and JS modules.
- `public/css/style.css` – Layout/styling for canvas, panels, and buttons.
- `public/js/vector.js` – Minimal 2D vector math utilities (add/subtract, magnitude, limit, heading).
- `public/js/dna.js` – Encodes weights and perception radii; crossover/mutation for evolution.
- `public/js/creature.js` – Creature agent: movement, health, steering behaviors, consumption logic, boundary handling, canvas rendering.
- `public/js/food.js` – Food manager; spawns/draws food, exposes collection helpers.
- `public/js/poison.js` – Poison manager; caps total poison, draw logic, reset helper.
- `public/js/ga.js` – Genetic algorithm helper; selects fittest parents, creates/mutates offspring DNA, returns a new creature.
- `public/js/stats.js` – Stats panel renderer/updater; polls simulation state and updates the UI/status text.
- `public/js/history.js` – Keeps a scrolling history log of generation snapshots.
- `public/js/main.js` – Simulation orchestrator: initializes state, wires UI events, runs the animation loop, applies GA, updates stats/history, and determines win/lose conditions.
- `public/404.html` – Default Firebase hosting 404 page.
- `firebase.json` – Firebase Hosting config pointing to the `public` directory.
- `.gitignore` – Standard ignore rules.

## Dependencies
- Runtime: modern browser with ES module support and Canvas 2D context (no external libraries needed).
- Local serving: Python 3 or Node.js (for `npx serve`), optional Firebase CLI for deployment.
