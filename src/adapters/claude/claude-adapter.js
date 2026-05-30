import { BaseAdapter } from '../base-adapter.js';
import { ClaudeApiParser } from './claude-api-parser.js';

export class ClaudeAdapter extends BaseAdapter {
  constructor() {
    super();
    this.networkData = null;
  }

  static matches(url) {
    return url.startsWith('https://claude.ai/chat/');
  }

  getPlatformId() {
    return 'claude';
  }

  getButtonMountPointSelector() {
    return 'header .flex.items-center.justify-end';
  }

  ingestNetworkData(data) {
    this.networkData = data;
  }

  async getTitle() {
    if (this.networkData && this.networkData.name) {
      return this.networkData.name;
    }
    
    const titleEl = document.querySelector('title');
    return titleEl ? titleEl.textContent.replace(' - Claude', '') : 'Claude Conversation';
  }

  async getMessages() {
    if (this.networkData) {
      return ClaudeApiParser.parse(this.networkData);
    }
    throw new Error('Network data not captured. Please reload the page to capture API response.');
  }
}
