## Core Concepts

Before using the exporter, understand these three core concepts:
1. **Network Interception**: The extension does not read what you see on the screen. It intercepts the hidden data transmission between the LLM's server and your browser.
2. **Reasoning Blocks**: Models like OpenAI o1 or Claude 3.5 Sonnet (with Extended Thinking) produce invisible "thought chains". The exporter captures these natively and renders them inside collapsible `<details>` blocks in the markdown output.
3. **Transient Memory**: The extension only holds your conversation data while the tab is open. If you close the tab, the intercepted data is gone until you reopen it.

## Common Workflows

### 1. Exporting a Claude Conversation
- **Goal:** Save a Claude discussion regarding code refactoring to disk.
- **Steps:**
  1. Open a conversation on `claude.ai`.
  2. Locate the "Export" button in the top right corner of the Claude UI.
  3. Click it once.
- **Output:** A file named `claude_2026-05-30_Code_Refactoring.md` appears in your downloads folder.
- **Common Mistakes:** Clicking the button immediately before the page finishes loading. The button will flash a toast if data is still buffering.

### 2. Exporting a ChatGPT o-series Conversation
- **Goal:** Export a complex reasoning chain from an o1-preview model.
- **Steps:**
  1. Complete your chat on `chatgpt.com`.
  2. Click the "Export" button in the header.
- **Output:** The markdown file will contain collapsible blocks titled `> Thinking Process (12 seconds)`.
- **Common Mistakes:** Exporting while the model is still generating text. The interceptor only caches the final complete payload when streaming finishes.

## Advanced Usage

### Customizing Filenames
You can alter the `filenameTemplate` in the extension options to group exports automatically. 
Example template: `{platform}_export_{date}`

## Integration Examples

**Obsidian Workflow**
This tool is highly optimized for Personal Knowledge Management (PKM) apps like Obsidian.
Save the markdown file directly into your Obsidian vault directory. The extension generates standard YAML-like frontmatter that Obsidian recognizes, tagging the file with `model` and `date`.

## Limitations

- **Streaming Interception**: The extension cannot export partial conversations while text is actively streaming onto the screen. You must wait for the generation to finish.
- **Shared URLs**: Opening a direct link to a ChatGPT shared conversation does not currently trigger the interceptor endpoint correctly. You must export from your personal history.
- **Image Extraction**: While image URLs are preserved, the extension does not download the raw binary images to disk.

*Last updated: 2026-05-30*
