import { ChatGptApiParser } from '../../src/adapters/chatgpt/chatgpt-api-parser.js';
import fixture from '../fixtures/chatgpt-conversation.json';

describe('ChatGptApiParser', () => {
  it('extracts all messages in order from mapping', () => {
    const messages = ChatGptApiParser.parse(fixture);
    expect(messages).toHaveLength(2);
    expect(messages[0].role).toBe('user');
    expect(messages[1].role).toBe('assistant');
  });

  it('extracts content parts correctly', () => {
    const messages = ChatGptApiParser.parse(fixture);
    expect(messages[0].content).toBe('Can you create a comparison table of sorting algorithms?');
    expect(messages[1].content).toBe('Here is the comparison table...');
  });
});
