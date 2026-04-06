# Code Quality Backlog

## Oxlint rule expansion

- Enable `suspicious` and `perf` rule categories for broader bug detection
- Enable `react` plugin for hooks rules and React-specific lint checks

## Formatting

- Enable oxfmt member sorting within import braces once supported (e.g., `{ b, a }` → `{ a, b }`)
- Eliminate `#fe/` catch-all alias by moving root-level files (`helpers.ts`, `urls.ts`, `app.tsx`) into a proper directory (e.g., `src/lib/` or `src/utils/`)

## IDE integration

- Verify and configure IntelliJ oxc plugin for IntelliJ/WebStorm users

## Dependencies

- Upgrade `concurrently` 9.1.2 → 9.2.1 in root `package.json5`
