## Configuration Sources

The Universal LLM Chat Exporter resolves configuration in the following priority order:
1. User overrides saved in `chrome.storage.sync` (via the extension Options page).
2. Hardcoded defaults in `src/shared/storage.js`.

The project does not currently utilize CLI flags or `.env` files for runtime configuration, as it executes exclusively within the browser sandbox.

## Complete Configuration Reference

| Key | Type | Default | Required | Description |
|-----|------|---------|----------|-------------|
| `includeThinking` | boolean | `true` | Yes | Includes internal reasoning blocks (e.g. o1/o3 reasoning). |
| `includeTimestamps` | boolean | `true` | Yes | Appends ISO 8601 timestamps to each message header. |
| `includeMetadata` | boolean | `true` | Yes | Generates a YAML-like header block at the top of the file. |
| `downloadFormat` | string | `'markdown'` | Yes | File format for the export output. |
| `filenameTemplate` | string | `'{title}'` | Yes | The template string used to generate file names. |
| `exportButtonEnabled`| boolean | `true` | Yes | Toggles the visibility of the injected UI button. |
| `enabledPlatforms` | object | `{...}` | Yes | A dictionary toggling specific platform adapters on/off. |

### `filenameTemplate`
**Valid tokens:** `{title}`, `{platform}`, `{date}`.
**Behavior:** Characters invalid for OS file paths (like `/`, `\`, `:`, `*`, `?`, `"`, `<`, `>`, `|`) are stripped and replaced with underscores before the final download occurs.

### `enabledPlatforms`
**Behavior:** Disabling a platform in this object will prevent the `network-interceptor` from attaching a debugger on that domain, completely halting execution and improving browser performance on unneeded sites.

## Environment Variables

| Key | Type | Default | Required | Description |
|-----|------|---------|----------|-------------|
| `NODE_ENV` | string | `'development'` | No | Set to `'production'` during `npm run build` to trigger Webpack minification. |

## Example Configurations

### 1. Minimal
The absolute minimum required state in storage (the system falls back to defaults for the rest).
```json
{
  "includeThinking": true
}
```

### 2. Recommended Production
Sensible defaults utilized by standard deployments.
```json
{
  "includeThinking": true,
  "includeTimestamps": true,
  "includeMetadata": true,
  "downloadFormat": "markdown",
  "filenameTemplate": "{platform}_{date}_{title}",
  "exportButtonEnabled": true,
  "enabledPlatforms": {
    "claude": true,
    "chatgpt": true,
    "gemini": true,
    "deepseek": true,
    "grok": true,
    "copilot": true,
    "perplexity": true
  }
}
```

### 3. Full Reference
```json
{
  // Toggle rendering of hidden reasoning chains in the output file
  "includeThinking": true,
  // Toggle the (YYYY-MM-DD HH:MM:SS) stamp on the message header
  "includeTimestamps": true,
  // Include global metadata at the top of the document
  "includeMetadata": true,
  // Output format (must be 'markdown')
  "downloadFormat": "markdown",
  // Target file name string
  "filenameTemplate": "{title}",
  // Toggle injection of the UI component
  "exportButtonEnabled": true,
  // Granular platform toggles
  "enabledPlatforms": {
    "claude": true,
    "chatgpt": true,
    "gemini": true,
    "deepseek": true,
    "grok": true,
    "copilot": true,
    "perplexity": true
  }
}
```

## Configuration Validation

If the storage system returns an invalid data type (e.g., `filenameTemplate` is parsed as an integer), the `FileDownloader` attempts to gracefully coerce it to a string. If the `enabledPlatforms` object is missing entirely, the `ExportOrchestrator` will fail to validate permissions and emit a `ProgressToast` error reading: `Export failed: Export is disabled for this platform in options.`

*Last updated: 2026-05-30*
