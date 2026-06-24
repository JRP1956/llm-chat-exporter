import { MarkdownBuilder } from '../../src/core/markdown-builder.js';

describe('MarkdownBuilder', () => {
  it('joins lines with actual newlines', () => {
    const output = MarkdownBuilder.build({
      title: 'Sample',
      platform: 'claude',
      messages: [
        { role: 'user', content: 'Hello', timestamp: null, thinking: null, attachments: null },
      ],
      options: { includeMetadata: false, includeThinking: false, includeTimestamps: false },
    });

    expect(output).toContain('\n## Human\n');
    expect(output).not.toContain('\\n');
  });
});
