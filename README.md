<div align="center">

# 🌌 Universal LLM Chat Exporter

**A production-grade, commercially scalable Chrome Extension for exporting LLM conversations with perfect fidelity.**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](#)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](#)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-orange.svg)](#)
[![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Enterprise-Grade Features](#-enterprise-grade-features)
- [Supported Platforms](#-supported-platforms)
- [Installation](#-installation)
  - [For End Users](#for-end-users)
  - [For Developers](#for-developers)
- [Development Setup](#-development-setup)
- [Architecture & Documentation](#-architecture--documentation)
- [Security & Privacy](#-security--privacy)
- [Contributing](#-contributing)

---

## 🚀 Overview

**Universal LLM Chat Exporter** completely re-engineers how AI conversations are saved. Traditional bookmarklets and DOM-scraping extensions are notoriously brittle; they break whenever a platform updates its UI. 

This project solves that by utilizing the **Chrome DevTools Protocol (CDP)** to tap directly into the underlying XHR/Fetch API responses of the LLM platforms. By parsing the structured JSON data before it even hits the DOM, we guarantee **100% accurate exports**, preserving structural elements, exact UNIX timestamps, and hidden reasoning chains (e.g., OpenAI's o-series or Claude's extended thinking).

---

## ✨ Enterprise-Grade Features

- **Network-Level Interception:** Bypasses DOM scraping entirely. Intercepts backend API payloads via the `chrome.debugger` API for absolute data fidelity.
- **Hidden State Extraction:** Natively extracts and formats "thinking" or "reasoning" blocks that are dynamically rendered or hidden by the frontend.
- **SPA Resilience:** Advanced History API monkey-patching ensures the extension UI persists seamlessly across React/Angular Single Page Application navigations.
- **Scalable Adapter Pattern:** Core extraction logic is decoupled from platform-specific schemas. Adding a new platform is as simple as writing a single JSON parser class.
- **Zero Third-Party APIs:** Operates 100% locally. Does not require API keys, OAuth, or external proxy servers. Uses the user's existing authenticated session.
- **Clean Markdown Output:** Generates pristine GitHub-Flavored Markdown (GFM), correctly rendering tables, code blocks, LaTeX math, and inline attachments.

---

## 🌐 Supported Platforms

| Platform | Extraction Method | Reasoning Block Support | Status |
| :--- | :--- | :---: | :--- |
| **Claude** (`claude.ai`) | Network Interception | ✅ | Active |
| **ChatGPT** (`chatgpt.com`) | Network Interception | ✅ | Active |
| **Gemini** | Planned (Phase 3) | ⏳ | Roadmap |
| **DeepSeek** | Planned (Phase 2) | ⏳ | Roadmap |
| **Grok** | Planned (Phase 3) | ⏳ | Roadmap |
| **Perplexity** | Planned (Phase 2) | ⏳ | Roadmap |

---

## 🛠 Installation

### For End Users
*(Coming soon to the Chrome Web Store)*
1. Navigate to the Chrome Web Store page.
2. Click **Add to Chrome**.
3. Open any supported LLM platform and click the **Export** button injected into the UI header.

### For Developers (Local Unpacked)
1. Clone the repository:
   ```bash
   git clone https://github.com/JRP1956/llm-chat-exporter.git
   cd llm-chat-exporter
   ```
2. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```
3. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable **Developer mode** (top right toggle)
   - Click **Load unpacked** and select the `/dist` folder.

---

## 💻 Development Setup

The project uses Webpack 5 for bundling and Jest for unit testing.

```bash
# Watch mode for active development
npm run dev

# Run unit tests on API parsers
npm test

# Build for production and generate deployment zip
npm run zip
```

---

## 🏗 Architecture & Documentation

This project is designed for commercial scalability and long-term maintainability. The codebase strictly adheres to the **Adapter Design Pattern**.

For an extremely detailed, technical deep-dive into the subsystem architecture, data flow diagrams, and extension lifecycle, please read the **[Comprehensive Architecture Documentation](./docs/ARCHITECTURE.md)**.

---

## 🛡 Security & Privacy

This extension requests powerful permissions, which are strictly scoped and justified:
- **`debugger`**: Required to intercept raw network responses from LLM endpoints. This permission is active *only* on supported URLs and no data ever leaves the local browser.
- **`downloads`**: Required to trigger the native file-save dialog for the generated Markdown file without relying on brittle DOM anchor-click hacks.
- **`storage`**: Used exclusively for saving user preferences via `chrome.storage.sync`.

**Data Handling Policy:** We do not collect telemetry, analytics, or user conversation data. The extension processes payloads entirely in memory and flushes them immediately after the download is triggered.

---

## 🤝 Contributing

We welcome contributions! To add a new platform:
1. Create a new directory under `src/adapters/<platform>`.
2. Extend the `BaseAdapter` class.
3. Write a stateless API Parser (e.g., `PlatformApiParser`).
4. Add the network endpoint regex to `src/background/network-interceptor.js`.
5. Register your adapter in `src/core/export-orchestrator.js`.
6. Write Jest unit tests against a mocked JSON fixture.

Please ensure all tests pass (`npm test`) and code is linted (`npm run lint`) before opening a Pull Request.

---
*Built with precision for the AI engineering community.*
