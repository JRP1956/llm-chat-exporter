export class ChatGptApiParser {
  static parse(networkData) {
    const messages = [];

    if (!networkData || !networkData.mapping) {
      return messages;
    }

    const mapping = networkData.mapping;
    let currentNodeId = networkData.current_node;
    const path = [];

    while (currentNodeId) {
      const node = mapping[currentNodeId];
      if (!node) break;
      path.unshift(node);
      currentNodeId = node.parent;
    }

    for (const node of path) {
      if (!node.message) continue;
      
      const msg = node.message;
      if (!msg.author || !['user', 'assistant'].includes(msg.author.role)) continue;
      
      const role = msg.author.role;
      let content = '';
      const thinkingBlocks = [];
      const attachments = [];

      if (msg.content && msg.content.parts) {
        if (msg.content.content_type === 'text') {
          content = msg.content.parts.join('\n');
        } else if (msg.content.content_type === 'multimodal_text') {
          for (const part of msg.content.parts) {
            if (typeof part === 'string') {
              content += part + '\n';
            } else if (part.content_type === 'image_asset_pointer') {
              attachments.push({ type: 'image', name: part.asset_pointer, url: null });
            }
          }
        }
      }

      if (msg.content && msg.content.content_type === 'reasoning') {
        thinkingBlocks.push({
          content: msg.content.parts ? msg.content.parts.join('\n') : msg.content.body || '',
          durationMs: null
        });
      } else if (msg.author && msg.author.role === 'tool' && msg.author.name === 'reasoning') {
         thinkingBlocks.push({
          content: msg.content.parts ? msg.content.parts.join('\n') : msg.content.body || '',
          durationMs: null
        });
        continue;
      }

      if (msg.metadata && msg.metadata.attachments) {
        for (const att of msg.metadata.attachments) {
          attachments.push({ type: 'file', name: att.name, url: null });
        }
      }

      if (content.trim() || thinkingBlocks.length > 0 || attachments.length > 0) {
        messages.push({
          role,
          content: content.trim(),
          timestamp: msg.create_time ? new Date(msg.create_time * 1000).toISOString() : null,
          thinking: thinkingBlocks.length > 0 ? thinkingBlocks : null,
          attachments: attachments.length > 0 ? attachments : null,
          model: msg.metadata?.model_slug || null,
        });
      }
    }

    return messages;
  }
}
