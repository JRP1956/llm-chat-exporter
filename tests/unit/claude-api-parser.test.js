import { ClaudeApiParser } from '../../src/adapters/claude/claude-api-parser.js';
import fixture from '../fixtures/claude-conversation-with-thinking.json';

describe('ClaudeApiParser', () => {
  it('extracts all messages in order', () => {
    const messages = ClaudeApiParser.parse(fixture);
    expect(messages).toHaveLength(2);
    expect(messages[0].role).toBe('user');
    expect(messages[1].role).toBe('assistant');
  });

  it('extracts thinking blocks from extended thinking responses', () => {
    const messages = ClaudeApiParser.parse(fixture);
    const assistantMsg = messages.find(m => m.role === 'assistant' && m.thinking);
    expect(assistantMsg).toBeDefined();
    expect(assistantMsg.thinking[0].content).toContain('The user wants a comparison table');
  });

  it('preserves timestamps on user messages', () => {
    const messages = ClaudeApiParser.parse(fixture);
    const userMsg = messages.find(m => m.role === 'user');
    expect(userMsg.timestamp).toMatch(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T/);
  });
});
