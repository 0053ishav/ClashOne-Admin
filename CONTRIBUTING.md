# Contributing

Thanks for improving Clash One Admin. This repository is currently maintained as a small, solo-developed project, so focused and reviewable pull requests are preferred.

## Before changing code

- Check existing behavior and the relevant backend API contract.
- Keep UI concerns separate from backend authorization and persistence.
- Avoid adding secrets to frontend code. Any `VITE_*` variable is public after bundling.
- Prefer small changes that address the underlying cause rather than masking symptoms.

## Development

```bash
npm ci
npm run dev
```

Before opening a PR:

```bash
npm run lint
npm run build
```

## Pull requests

- Use a descriptive title and complete the pull request template.
- Explain behavior changes and backend/API compatibility.
- Include screenshots for meaningful UI changes.
- Do not merge while required CI checks are failing.
