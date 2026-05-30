## Prerequisites

| Dependency | Minimum Version | How to Check | How to Install |
|------------|-----------------|--------------|----------------|
| Node.js | 18.0.0 | `node -v` | [Download from Node.js](https://nodejs.org) |
| npm | 8.0.0 | `npm -v` | Installed automatically with Node.js |
| Google Chrome | 100.0 | `chrome://settings/help` | [Download Chrome](https://google.com/chrome) |

## Installation Methods

### 1. From Source (Developer Setup)

Follow these steps to build the extension from source:

1. Clone the repository:
```bash
git clone https://github.com/JRP1956/llm-chat-exporter.git
```
*Expected output: standard git clone success message.*

2. Navigate into the directory:
```bash
cd llm-chat-exporter
```

3. Install npm dependencies:
```bash
npm install
```
*Expected output: "added X packages, and audited Y packages in Zs"*

4. Build the extension:
```bash
npm run build
```
*Expected output: Webpack compilation success log ending with "webpack X.X.X compiled successfully in Y ms"*

5. Load the extension in Chrome:
- Navigate to `chrome://extensions/`
- Enable "Developer mode" in the top right corner.
- Click "Load unpacked".
- Select the `dist/` directory inside the project folder.

## Verifying the Installation

To verify the build was successful, check if the `dist/` folder was generated correctly:

```bash
ls -la dist/manifest.json
```
*Expected output: details of the `manifest.json` file confirming it exists in the build output.*

In Chrome, ensure the extension card for "Universal LLM Chat Exporter" appears in your `chrome://extensions/` list and displays no immediate errors.

## Troubleshooting Installation

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Webpack fails with syntax errors | Outdated Node.js version | Upgrade Node.js to v18+ |
| `npm install` throws EACCES | Permission error | Avoid using `sudo npm`. Fix npm permissions or use `nvm` |
| Chrome says "Manifest file is missing" | Loaded wrong directory | Ensure you selected the `dist/` directory, not the root |
| Chrome throws an unrecognized permission error | Old Chrome version | Upgrade Chrome to a version supporting Manifest V3 |

## Uninstallation

To completely remove the project from your system:

1. In Chrome, navigate to `chrome://extensions/`.
2. Locate "Universal LLM Chat Exporter" and click "Remove".
3. From your terminal, delete the project folder:
```bash
rm -rf path/to/llm-chat-exporter
```
The extension relies on `chrome.storage.sync` which is wiped automatically when the extension is removed. No registry keys or external config files are left behind.

*Last updated: 2026-05-30*
