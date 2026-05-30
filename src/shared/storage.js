const DEFAULTS = {
  includeThinking:    true,
  includeTimestamps:  true,
  includeMetadata:    true,
  downloadFormat:     'markdown',
  filenameTemplate:   '{title}',
  exportButtonEnabled: true,
  enabledPlatforms: {
    claude:      true,
    chatgpt:     true,
    gemini:      true,
    deepseek:    true,
    grok:        true,
    copilot:     true,
    perplexity:  true,
  },
};

export const Storage = {
  async get(key) {
    return new Promise(resolve => {
      chrome.storage.sync.get(key, result => resolve(result[key] ?? DEFAULTS[key]));
    });
  },

  async getAll() {
    return new Promise(resolve => {
      chrome.storage.sync.get(null, result => resolve({ ...DEFAULTS, ...result }));
    });
  },

  async set(key, value) {
    return new Promise(resolve => {
      chrome.storage.sync.set({ [key]: value }, resolve);
    });
  },
};
