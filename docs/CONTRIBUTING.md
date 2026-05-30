## Development Setup

Follow these exact steps to prepare the local repository:

```bash
git clone https://github.com/JRP1956/llm-chat-exporter.git
cd llm-chat-exporter
npm install
npm test
npm run dev
```
*Expected output: Jest tests pass, and Webpack starts a watch compiler.*

## Project Conventions

- **Commit Messages**: Use Conventional Commits.
  - Good: `feat(adapters): add deepseek reasoning extraction`
  - Bad: `added deepseek stuff`
- **Branch Naming**: `feat/platform-name` or `fix/issue-description`
- **Code Style**: Defined in `.eslintrc` (implicitly). We enforce trailing commas, single quotes, and 2-space indentation.
- **File Naming**: Kebab-case strictly (e.g. `claude-api-parser.js`).
- **Test Placement**: Unit tests reside in `tests/unit/`, completely separated from `src/`.

## Adding a New Platform Adapter

To add support for a new platform (e.g. "AcmeAI"), follow these steps:

1. **Create Files:**
   Create `src/adapters/acme/acme-adapter.js` and `src/adapters/acme/acme-api-parser.js`.
2. **Implement BaseAdapter:**
   ```javascript
   import { BaseAdapter } from '../base-adapter.js';
   export class AcmeAdapter extends BaseAdapter {
     static matches(url) { return url.includes('acme.ai'); }
     // ... implement other methods
   }
   ```
3. **Register Adapter:**
   Open `src/core/export-orchestrator.js` and add `AcmeAdapter` to `ADAPTER_REGISTRY`.
4. **Register Endpoint:**
   Open `src/background/network-interceptor.js` and add the API regex to `CONVERSATION_ENDPOINTS`.
5. **Write Tests:**
   Save a real JSON payload to `tests/fixtures/acme.json`. Write `acme-api-parser.test.js`.

## Running Tests

- **Unit tests**: `npm test` (Executes Jest over the `tests/unit` directory).
- **Updating Snapshots/Fixtures**: Manually replace `.json` files in `tests/fixtures/` and rerun `npm test`.

## Pull Request Process

- Ensure all `npm test` suites pass.
- Reviewers look for strict separation of concerns (no DOM logic in the adapters).
- PRs are typically reviewed within 48 hours.
- Only repository administrators hold merge authority to `main`.

## Reporting Bugs

Please include:
1. Extension version
2. Chrome version
3. Platform URL
4. Exact steps to reproduce
5. A screenshot of the DevTools console if errors appear

## Proposing Features

Open a GitHub Discussion using the `Idea` label before drafting a Pull Request.

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms (standard Covenant guidelines).

## Inline Documentation Debt

- `FileDownloader.download()`: Lacks explicit JSDoc parameter documentation.
- `ProgressToast`: Inline comments mostly describe what DOM elements are created rather than why they are styled dynamically.
- `network-interceptor.js`: The Map cleanup logic lacks a comment explaining why tab deletion clears the cache.

*Last updated: 2026-05-30*
