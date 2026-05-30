const CONVERSATION_ENDPOINTS = {
  claude:      new RegExp('/api/organizations/.+/chat_conversations/.+'),
  chatgpt:     new RegExp('/backend-api/conversation/.+'),
  gemini:      new RegExp('GenerateContent|StreamGenerateContent'),
  deepseek:    new RegExp('/api/v0/chat/completion|/chat/history'),
  grok:        new RegExp('/api/rpc/ConversationService\\\\..+'),
  perplexity:  new RegExp('/rest/thread/.+'),
};

export class NetworkInterceptor {
  constructor() {
    this.capturedData = new Map();
  }

  attach(tabId) {
    chrome.debugger.attach({ tabId }, '1.3', () => {
      chrome.debugger.sendCommand({ tabId }, 'Network.enable');
    });

    chrome.debugger.onEvent.addListener((source, method, params) => {
      if (source.tabId !== tabId) return;
      if (method === 'Network.responseReceived') {
        this._handleResponse(tabId, params);
      }
    });
  }

  async _handleResponse(tabId, params) {
    const url = params.response.url;
    const platform = this._matchPlatform(url);
    if (!platform) return;

    try {
      const { body } = await chrome.debugger.sendCommand(
        { tabId },
        'Network.getResponseBody',
        { requestId: params.requestId }
      );

      this.capturedData.set(`${tabId}:${platform}`, JSON.parse(body));

      chrome.tabs.sendMessage(tabId, {
        type: 'NETWORK_DATA_CAPTURED',
        platform,
        data: JSON.parse(body),
      });
    } catch (e) {
      console.error('Failed to capture network response body', e);
    }
  }

  _matchPlatform(url) {
    for (const [platform, pattern] of Object.entries(CONVERSATION_ENDPOINTS)) {
      if (pattern.test(url)) return platform;
    }
    return null;
  }

  detach(tabId) {
    chrome.debugger.detach({ tabId });
  }
}
