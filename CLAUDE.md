# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Contexte
Jeu "sectional checkerboard" en react/vite 
Développé par Laurent Baudrillard avec Claude Code
La documentation est dans le répertoire @docs

## Objectif
Permettre aux utilisateurs de jouer a ce casse tete via une interface graphique, la sourie, du drag'n drop. A chaque étape du jeu, il faut afficher le nombre de possibilité restant pour faire le casse tete

## Conventions
- Commits en anglais
- Tests obligatoires pour chaque nouvelle fonction

## Commands

```bash
npm install       # Install dependencies
npm run dev       # Start dev server (http://localhost:5173)
npm run build     # Production build (outputs to dist/)
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

No test framework is configured yet.

## Stack

- React 19 + Vite 8 (JavaScript, not TypeScript)
- ESLint with `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`

## Architecture

Standard Vite/React scaffold:

- `index.html` — entry point, mounts `#root`
- `src/main.jsx` — renders `<App />` into `#root`
- `src/App.jsx` — root component (currently the default Vite placeholder)
- `src/index.css` — global styles
- `src/App.css` — component-level styles for `App`
- `public/` — static assets served as-is

Chess logic and components have not been added yet.
