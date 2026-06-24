export class MarkdownBuilder {

  static build({ title, messages, platform, options = {} }) {
    const {
      includeThinking    = true,
      includeTimestamps  = true,
      includeMetadata    = true,
    } = options;

    const lines = [];

    // Document header
    lines.push(`# ${title}`);
    lines.push('');

    if (includeMetadata) {
      lines.push(`> **Platform:** ${platform}`);
      lines.push(`> **Exported:** ${new Date().toLocaleString()}`);
      lines.push(`> **Messages:** ${messages.length}`);
      lines.push('');
    }

    lines.push('---');
    lines.push('');

    for (const message of messages) {
      lines.push(...this._renderMessage(message, { includeThinking, includeTimestamps }));
    }

    return lines.join('\n');
  }

  static _renderMessage(message, options) {
    const lines = [];
    const { includeThinking, includeTimestamps } = options;

    // --- Header ---
    const roleLabel = this._roleLabel(message.role);
    const ts = includeTimestamps && message.timestamp
      ? ` *(${this._formatTimestamp(message.timestamp)})*`
      : '';

    lines.push(`## ${roleLabel}${ts}`);
    lines.push('');

    // --- Thinking block (if present and requested) ---
    if (includeThinking && message.thinking && message.thinking.length > 0) {
      for (const block of message.thinking) {
        lines.push('<details>');
        lines.push(`<summary>💭 Thinking${block.durationMs ? ` (${(block.durationMs / 1000).toFixed(1)}s)` : ''}</summary>`);
        lines.push('');
        lines.push(block.content);
        lines.push('');
        lines.push('</details>');
        lines.push('');
      }
    }

    // --- Main content ---
    lines.push(message.content);
    lines.push('');

    // --- Attachments ---
    if (message.attachments && message.attachments.length > 0) {
      lines.push('**Attachments:**');
      for (const att of message.attachments) {
        if (att.url) {
          lines.push(`- [${att.name}](${att.url})`);
        } else {
          lines.push(`- \`${att.name}\` *(${att.type})*`);
        }
      }
      lines.push('');
    }

    lines.push('---');
    lines.push('');

    return lines;
  }

  static _roleLabel(role) {
    const map = { user: 'Human', assistant: 'Assistant', system: 'System' };
    return map[role] ?? role;
  }

  static _formatTimestamp(iso) {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit',
    });
  }
}
