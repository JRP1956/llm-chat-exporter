import { BaseAdapter } from '../base-adapter.js';
import { ChatGptApiParser } from './chatgpt-api-parser.js';

export class ChatGPTAdapter extends BaseAdapter {
  constructor() {
    super();
    this.networkData = null;
  }

  static matches(url) {
    return url.startsWith('https://chatgpt.com/c/') || url === 'https://chatgpt.com/';
  }

  getPlatformId() {
    return 'chatgpt';
  }

  getButtonMountPointSelector() {
    // Mount to the top right header where share options are
    return 'header .flex.items-center.justify-end';
  }

  ingestNetworkData(data) {
    this.networkData = data;
  }

  async getTitle() {
    if (this.networkData && this.networkData.title) {
      return this.networkData.title;
    }
    const titleEl = document.querySelector('title');
    return titleEl ? titleEl.textContent.replace(' - ChatGPT', '') : 'ChatGPT Conversation';
  }

  async getMessages() {
    if (this.networkData) {
      return ChatGptApiParser.parse(this.networkData);
    }
    throw new Error('Network data not captured. Please reload the page to capture API response.');
  }
}
