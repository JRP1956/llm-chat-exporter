# Universal LLM Chat Exporter

A Manifest V3 Chrome Extension that exports LLM conversations from major platforms into pristine GitHub-Flavored Markdown.

## Why This Project Exists

Traditional DOM-scraping extensions break constantly due to upstream frontend UI changes and frequently miss hidden states like reasoning chains. This project intercepts raw backend JSON payloads via the Chrome DevTools Protocol, ensuring 100% extraction fidelity, stability across UI updates, and the capture of hidden data.

## Features

- Exports perfect GitHub-Flavored Markdown with a single click.
- Extracts hidden reasoning and thinking blocks (like OpenAI's o-series reasoning or Claude's extended thinking) natively.
- Operates entirely locally without requiring external proxies, API keys, or third-party servers.
- Preserves exact UNIX timestamps for every message, not just visible frontend approximations.
- Maintains a persistent export UI seamlessly across Single Page Application navigations without page reloads.

## Quick Start

Ensure you have Node.js and npm installed.

```bash
git clone https://github.com/JRP1956/llm-chat-exporter.git
cd llm-chat-exporter
npm install
npm run zip
```

Load the extension:
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable "Developer mode".
3. Click "Load unpacked" and select the `dist/` directory.

Export a chat:
1. Open a conversation on Claude or ChatGPT.
2. Click the injected "Export" button in the top right of the screen.
3. Check your downloads folder for the Markdown file.

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture](docs/ARCHITECTURE.md) | High-level system design, data flow, and extension points. |
| [Installation](docs/INSTALLATION.md) | Step-by-step developer setup and user installation guides. |
| [Configuration](docs/CONFIGURATION.md) | Comprehensive reference of all user preferences and options. |
| [API Reference](docs/API.md) | Developer documentation for all core classes and interfaces. |
| [Usage Guide](docs/USAGE.md) | End-user workflows, advanced usage, and project limitations. |
| [Contributing](docs/CONTRIBUTING.md) | Development workflows, testing, and PR submission guidelines. |
| [Troubleshooting](docs/TROUBLESHOOTING.md) | Diagnostic checklist and exhaustive error code reference. |
| [Security](docs/SECURITY.md) | Security model, permissions justification, and reporting policies. |
| [Changelog](CHANGELOG.md) | Version history and release notes. |

## Supported Platforms / Environments

| Platform | Version | Status |
|----------|---------|--------|
| Claude (`claude.ai`) | All Models | ✅ Supported |
| ChatGPT (`chatgpt.com`) | All Models (incl. o-series) | ✅ Supported |
| Gemini | N/A | ⏳ Roadmap |
| DeepSeek | N/A | ⏳ Roadmap |
| Perplexity | N/A | ⏳ Roadmap |
| Grok | N/A | ⏳ Roadmap |

## Roadmap

1. Implement DeepSeek Adapter with `<think>` tag extraction.
2. Implement Perplexity Adapter with reasoning step aggregation.
3. Add PDF export support alongside Markdown.
4. Support batch exporting from the conversation history sidebar.

## Contributing

We welcome contributions from the open-source community. Whether you are adding a new platform adapter or fixing a bug, please start by reading the [Contributing Guide](docs/CONTRIBUTING.md) for local setup and PR conventions.

## License

MIT License
