import { ThinkingExtractor } from '../../core/thinking-extractor.js';

export class ClaudeApiParser {
  static parse(networkData) {
    const messages = [];

    if (!networkData || !networkData.chat_messages) {
      return messages;
    }

    for (const msg of networkData.chat_messages) {
      const role = msg.sender === 'human' ? 'user' : 'assistant';
      let content = '';
      let thinkingBlocks = [];
      const attachments = [];

      if (Array.isArray(msg.content)) {
        for (const block of msg.content) {
          if (block.type === 'text') {
            content += block.text + '\n\n';
          } else if (block.type === 'thinking') {
            thinkingBlocks.push({
              content: block.thinking,
              durationMs: null
            });
          } else if (block.type === 'image') {
            attachments.push({ type: 'image', name: block.source?.media_type || 'image', url: null });
          } else if (block.type === 'document') {
            attachments.push({ type: 'file', name: block.source?.media_type || 'document', url: null });
          }
        }
      } else if (typeof msg.text === 'string') {
        content = msg.text;
      }

      content = content.trim();

      messages.push({
        role,
        content,
        timestamp: msg.created_at || null,
        thinking: thinkingBlocks.length > 0 ? thinkingBlocks : null,
        attachments: attachments.length > 0 ? attachments : null,
        model: networkData.model || null,
      });
    }

    return messages;
  }
}
