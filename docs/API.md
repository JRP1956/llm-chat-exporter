## Adapters Module

The Adapters module normalizes raw JSON payloads from proprietary platforms into the standard schema.

### BaseAdapter

**Description:** Abstract base class that all platform-specific adapters must extend.

**Signature:**
```javascript
class BaseAdapter {
  static matches(url)
  getPlatformId()
  getTitle()
  getMessages()
  getButtonMountPointSelector()
}
```

**Parameters (matches):**

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `url` | string | Yes | None | The current browser URL string. |

**Returns:**
- `matches`: Boolean indicating if the adapter handles the given URL.
- `getPlatformId`: String identifying the platform.
- `getTitle`: Promise resolving to the conversation title string.
- `getMessages`: Promise resolving to an array of `ConversationMessage` objects.
- `getButtonMountPointSelector`: String representing a valid CSS selector for UI injection.

**Throws:**
Throws `Error` if abstract methods are not overridden in the child class.

**Example:**
```javascript
const adapter = new ClaudeAdapter();
const messages = await adapter.getMessages();
```

**Notes:** Do not instantiate `BaseAdapter` directly.

---

## Core Module

The Core module orchestrates the extraction logic.

### ExportOrchestrator

**Description:** Coordinates platform resolution, payload extraction, and markdown compilation.

**Signature:**
```javascript
class ExportOrchestrator {
  ingestNetworkData(data)
  export()
}
```

**Parameters (ingestNetworkData):**

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `data` | Object | Yes | None | The raw parsed JSON payload from the interceptor. |

**Returns:**
- `export`: Promise resolving to undefined upon completion of the download workflow.

**Throws:**
Throws `Error` if the current URL cannot be matched to any adapter in the registry.

**Example:**
```javascript
const orchestrator = new ExportOrchestrator();
orchestrator.ingestNetworkData({ chat_messages: [] });
await orchestrator.export();
```

---

### MarkdownBuilder

**Description:** Compiles normalized message arrays into GitHub Flavored Markdown.

**Signature:**
```javascript
static build(params)
```

**Parameters:**

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | string | Yes | None | The conversation title. |
| `messages` | Array | Yes | None | Array of `ConversationMessage` objects. |
| `platform` | string | Yes | None | The source platform identifier. |
| `options` | Object | No | `{}` | Formatting overrides (e.g. timestamps). |

**Returns:** A single string representing the compiled markdown document.

**Throws:** None.

**Example:**
```javascript
const markdown = MarkdownBuilder.build({
  title: "Example Chat",
  messages: [{ role: "user", content: "Hello" }],
  platform: "claude"
});
```

*Last updated: 2026-05-30*
