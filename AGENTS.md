# AGENTS.md

## Repo Shape
- Single-package repo for a Chrome Extension.
- Source code lives in `src/`; unit tests live in `tests/unit/` with fixtures in `tests/fixtures/`.
- Real runtime entrypoints are the extension scripts in `src/background/`, `src/content/`, `src/popup/`, and `src/options/`.

## Commands
- Install: `npm install`
- Dev watch build: `npm run dev`
- Production build: `npm run build`
- Tests: `npm test`
- Lint: `npm run lint`
- Package extension zip: `npm run zip` (builds first, then zips `dist/` into `llm-chat-exporter.zip`)

## Build / Runtime Notes
- Webpack outputs to `dist/` and copies `manifest.json`, popup/options HTML, `assets/`, and `src/content/ui/styles.css`.
- Load the unpacked extension from `dist/`, not the repo root.
- `manifest.json` uses MV3 and the `chrome.debugger` permission; the extension only attaches on the host URLs listed there.
- `service-worker.js` handles debugger attachment and download requests; it does not parse or format conversations.
- `export-orchestrator.js` resolves adapters from the current page URL and currently registers only `ClaudeAdapter` and `ChatGPTAdapter`.

## Testing Notes
- Jest tests target parser behavior with JSON fixtures; keep fixture-driven cases in `tests/fixtures/`.
- When changing parser logic, update the matching unit test and fixture together.

## Conventions
- Use the existing file naming pattern: kebab-case filenames.
- Follow the repo's stated style: single quotes, trailing commas, and 2-space indentation.
- Commit messages are expected to use Conventional Commits.

## Reference Docs
- `docs/CONTRIBUTING.md` describes the expected setup flow and adapter-registration path.
- `docs/ARCHITECTURE.md` explains the debugger-based data flow and component boundaries.
