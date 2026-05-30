export class ThinkingExtractor {
  static extractFromClaudeResponse(contentArray) {
    if (!Array.isArray(contentArray)) return { content: '', thinking: [] };
    
    let text = '';
    const thinking = [];
    
    for (const block of contentArray) {
      if (block.type === 'text') {
        text += block.text + '\n\n';
      } else if (block.type === 'thinking') {
        thinking.push({
          content: block.thinking,
          durationMs: null
        });
      }
    }
    
    return { content: text.trim(), thinking };
  }

  static extractDeepSeekThinking(contentStr) {
    const thinkMatch = contentStr.match(/<think>([\s\S]*?)<\/think>/);
    return {
      thinking: thinkMatch ? [{ content: thinkMatch[1].trim(), durationMs: null }] : null,
      content: contentStr.replace(/<think>[\s\S]*?<\/think>/g, '').trim(),
    };
  }
}
