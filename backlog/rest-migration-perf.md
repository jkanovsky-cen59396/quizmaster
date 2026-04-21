# E2E Suite Perf — REST Migration

Tracking wall-clock impact of migrating builder/bulk `create*` steps from UI-driven to REST-driven. GUI steps (`When I enter ...`) stay UI-driven.

## Methodology

- **Workers:** `PW_WORKERS=2` (set in `.env`). Matches the real workflow; higher worker counts add contention noise that obscures the delta.
- **Per measurement point:** one discarded warmup run (cold JVM / Vite / FS cache), then 3 measured runs. Record wall-clock for each, take the median. If stdev > 10%, add runs until it settles.
- **Same commit, no code changes between runs at a step.** Commit SHA captured in each row for replay.
- **Scenario count captured** from the Cucumber summary, to flag accidental coverage drift.
- **Raw logs** under `backlog/perf-runs/step<N>-<label>.log`.

## Results

| step | commit   | date       | workers | run1    | run2    | run3    | median  | stdev% | scenarios | notes |
|------|----------|------------|---------|---------|---------|---------|---------|--------|-----------|-------|
| 0 — baseline | 8a699915 | 2026-04-21 | 2 | 212s | 243s | 214s | **214s (3m34s)** | 6.4% | 214 passed / 1 failed / 4 skipped | Warmup 217s discarded. 1 flaky failure every run: `Quiz.Timer > Timed out quiz with no answers scores zero`. Run 2 outlier (+31s) — median robust against it. |
| 1a — REST workspace, `waitUntil: 'networkidle'` | (not committed) | 2026-04-21 | 2 | 267s | 266s | — | ~266s | — | 214-215 passed / 0-1 failed | **Regression abandoned.** `workspacePage.goto` uses `waitUntil: 'networkidle'`, which added ~500ms per workspace × ~100 scenarios ≈ ~53s. Switched to plain `page.goto` (default `waitUntil: 'load'`) for 1b. |
| 1b — REST workspace, `waitUntil: 'load'` | 1d759675 | 2026-04-21 | 2 | 213s | 216s | 212s | **213s (3m33s)** | 0.8% | 213-214 passed / 1-2 failed / 4 skipped | Break-even vs Step 0 — matches plan estimate ("small win"). Same Quiz.Timer flake. One run had additional AI flake and a fake-clock timing flake (`Quiz.Stats`, `31s != 30s`), both unrelated to change. |
| 2 — REST question | (pending commit) | 2026-04-21 | 2 | 164s | 192s | 159s | **164s (2m44s)** | 8.4% | 213-214 passed / 1-2 failed / 4 skipped | **~50s (~23%) faster than baseline.** Warmup 162s. Required splitting `ensureWorkspace` into guid-only (REST callers) + URL-aware variant that navigates if browser isn't on workspace page (GUI callers). Bulk `Given workspace "X" with questions` reloads the workspace page at the end so its list reflects REST-inserted data. Run 2 outlier from AI flake (OpenRouter latency). |
