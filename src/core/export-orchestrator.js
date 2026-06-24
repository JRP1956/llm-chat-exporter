import { ClaudeAdapter }      from '../adapters/claude/claude-adapter.js';
import { ChatGPTAdapter }     from '../adapters/chatgpt/chatgpt-adapter.js';
// Note: Other adapters will be implemented in future phases
import { MarkdownBuilder }    from './markdown-builder.js';
import { FileDownloader }     from './file-downloader.js';
import { ProgressToast }      from '../content/ui/progress-toast.js';
import { Storage }            from '../shared/storage.js';

const ADAPTER_REGISTRY = [
  ClaudeAdapter,
  ChatGPTAdapter,
];

export class ExportOrchestrator {
  constructor() {
    this.toast = new ProgressToast();
    this.adapter = this._resolveAdapter();
    this.networkData = null;
  }

  _resolveAdapter() {
    const url = window.location.href;
    const AdapterClass = ADAPTER_REGISTRY.find(A => A.matches(url));
    if (!AdapterClass) throw new Error(`No adapter found for URL: ${url}`);
    return new AdapterClass();
  }

  _hasData() {
    const d = this.networkData || this.adapter.networkData;
    return d && typeof d === 'object' && Object.keys(d).length > 0;
  }

  ingestNetworkData(data) {
    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) return;
    this.networkData = data;
    if (this.adapter.ingestNetworkData) {
      this.adapter.ingestNetworkData(data);
    }
  }

  async _waitForData(timeout = 15000) {
    if (this._hasData()) return;
    return new Promise((resolve, reject) => {
      const deadline = Date.now() + timeout;
      const poll = () => {
        if (this._hasData()) return resolve();
        if (Date.now() >= deadline) return reject(new Error('Network data not captured. Please reload the page.'));
        setTimeout(poll, 500);
      };
      poll();
    });
  }

  async export() {
    try {
      const options = await Storage.getAll();
      
      if (!options.enabledPlatforms[this.adapter.getPlatformId()]) {
        this.toast.error('Export is disabled for this platform in options.');
        return;
      }

      this.toast.show('Preparing export...');
      await this._waitForData();

      const data = this.networkData || this.adapter.networkData;
      console.log('[LLM Exporter] Network data keys:', data ? Object.keys(data) : 'null');

      // Step 1: Get title
      this.toast.update('Fetching conversation title...');
      const title = await this.adapter.getTitle();

      // Step 2: Get messages
      this.toast.update('Extracting messages...');
      const messages = await this.adapter.getMessages();

      if (!messages || messages.length === 0) {
        throw new Error('No messages found in this conversation.');
      }

      this.toast.update(`Found ${messages.length} messages. Building export...`);

      // Step 3: Build markdown
      const markdown = MarkdownBuilder.build({
        title,
        messages,
        platform: this.adapter.getPlatformId(),
        options,
      });

      // Step 4: Download
      let filenameTemplate = options.filenameTemplate || '{title}';
      let filename = filenameTemplate
        .replace('{title}', FileDownloader.sanitizeFilename(title))
        .replace('{platform}', this.adapter.getPlatformId())
        .replace('{date}', new Date().toISOString().split('T')[0]);
        
      filename += '.md';
      
      await FileDownloader.download(markdown, filename);

      this.toast.success(`Downloaded: ${filename}`);

    } catch (err) {
      this.toast.error(`Export failed: ${err.message}`);
      console.error('[LLM Exporter] Export failed:', err);
    } finally {
      setTimeout(() => this.toast.hide(), 4000);
    }
  }
}
