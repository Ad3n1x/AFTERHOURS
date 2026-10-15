# AFTERHOURS 🇳🇬

**A browser-first Nigerian 3D open-world life simulator.**

AFTERHOURS is being rebuilt around an explorable Nigerian neighbourhood and the everyday choices that shape a life: getting around, meeting residents, finding work, earning naira, looking after yourself, and making a home.

## Playable foundation

- **3D neighbourhood:** a walkable grid of streets and blocks with homes, shops, food spots, a workshop, community locations, trees, residents and danfo buses.
- **Third-person exploration:** keyboard controls on desktop and a touch movement pad on mobile.
- **Enterable starter home:** explore the room, rest, inspect storage and return to the street.
- **Life-simulation loop:** manage cash, energy, hunger and hygiene; buy a meal; take a paid shift; use local transport; advance in-game time.
- **Nigerian setting:** naira-based economy, danfo transport, neighbourhood vendors and local street-life details.
- **Local save:** game progress is saved in the current browser when local storage is available.
- **Responsive interface:** designed for desktop browsers and mobile screens, with conservative rendering settings for lower-powered devices.

## Tech stack

- React 19 + TypeScript
- Vite 6
- Three.js
- React Three Fiber + Drei
- Lucide icons

## Run locally

```bash
npm install
npm run dev
```

Create a production build:

```bash
npm run build
npm run preview
```

## Controls

- **Desktop:** WASD or arrow keys to move; click buildings and residents to interact.
- **Mobile:** hold the on-screen directional pad to move; tap buildings and residents.
- **City map:** use the map toggle beneath the 3D scene.

## Current scope

This is an actively evolving browser game prototype. Multiplayer, online accounts, cloud saves, a full-size Nigeria map, and advanced vehicle systems are not yet enabled. The current priority is making the offline open-world loop fun and stable before expanding the world.

## Performance

The 3D scene uses a capped device-pixel ratio and low-power WebGL preference to help support modest hardware. Further optimisation should be based on real production testing across target desktop and Android devices.

---
Made by **AD3N1X** · AFTERHOURS
