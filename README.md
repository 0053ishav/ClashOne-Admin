# Clash One Admin

The web-based administration panel for **Clash One**, used to manage selected game-data metadata and event configuration served by the Clash One backend.

> This repository contains the admin frontend only. Backend routes, authorization, persistence, and deployment are managed separately.

## Features

- Sign in to the admin API.
- View and edit crafted-defense metadata and event configuration.
- Manage Goblin configuration.
- Export crafted-defense metadata from the browser.
- Run lint and production-build checks in GitHub Actions.

The available operations depend on the backend API version and the permissions enforced by that backend.

## Tech stack

- React
- Vite
- Tailwind CSS
- ESLint
- npm

## Requirements

- Node.js 22 (recommended; CI uses Node 22)
- npm

## Local development

```bash
npm ci
npm run dev
```

Vite prints the local development URL in the terminal.

## Validation

Run the same checks used by CI before opening a pull request:

```bash
npm run lint
npm run build
```

To preview a production build locally:

```bash
npm run preview
```

## API configuration

The current API and CDN origins are configured in `src/App.jsx`. Update these values deliberately when targeting another environment. Do not put private API credentials, admin passwords, or long-lived secrets in frontend code: Vite variables prefixed with `VITE_` are bundled into public client-side assets and are not secret.

Admin authorization must be enforced by the backend for every protected operation. Hiding controls in the UI is not an authorization boundary.

## Repository workflow

1. Create a focused branch from `main`.
2. Make the smallest coherent change.
3. Run lint and build locally.
4. Open a pull request using the repository template.
5. Review the diff and wait for the **Lint & Build** check before merging.

Dependabot checks npm dependencies and GitHub Actions monthly.

## Security

Do not commit credentials, production tokens, private player data, or environment files. If a credential is exposed, revoke or rotate it; adding the file to `.gitignore` does not remove it from Git history.

For vulnerability reports, follow [SECURITY.md](SECURITY.md).

## Official references

- [Clash of Clans API documentation](https://developer.clashofclans.com/)
- [Vite documentation](https://vite.dev/guide/)
- [React documentation](https://react.dev/)
- [GitHub Actions documentation](https://docs.github.com/en/actions)
