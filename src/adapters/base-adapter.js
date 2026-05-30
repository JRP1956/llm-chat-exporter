export class BaseAdapter {
  constructor() {
    if (new.target === BaseAdapter) {
      throw new Error('BaseAdapter is abstract');
    }
  }

  /**
   * Returns true if this adapter handles the current page URL.
   * @param {string} url
   * @returns {boolean}
   */
  static matches(url) {
    throw new Error('matches() must be implemented');
  }

  /**
   * Returns the conversation title.
   * @returns {Promise<string>}
   */
  async getTitle() {
    throw new Error('getTitle() must be implemented');
  }

  /**
   * Returns the full conversation as a normalized array of messages.
   * Each message conforms to the ConversationMessage schema below.
   * @returns {Promise<ConversationMessage[]>}
   */
  async getMessages() {
    throw new Error('getMessages() must be implemented');
  }

  /**
   * Returns the platform identifier string.
   * @returns {string}  e.g. 'claude', 'chatgpt', 'gemini'
   */
  getPlatformId() {
    throw new Error('getPlatformId() must be implemented');
  }
}
