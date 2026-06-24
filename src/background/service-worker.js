import { NetworkInterceptor } from './network-interceptor.js';

const interceptor = new NetworkInterceptor();

function isSupportedUrl(url) {
  return url.startsWith('https://claude.ai/') ||
         url.startsWith('https://chatgpt.com/') ||
         url.startsWith('https://gemini.google.com/') ||
         url.startsWith('https://chat.deepseek.com/') ||
         url.startsWith('https://grok.com/') ||
         url.startsWith('https://copilot.microsoft.com/') ||
         url.startsWith('https://www.perplexity.ai/');
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading' && tab.url && isSupportedUrl(tab.url)) {
    try {
      interceptor.attach(tabId);
    } catch (e) {
      console.warn('Could not attach debugger to tab', tabId, e);
    }
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  interceptor.detach(tabId);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'REQUEST_NETWORK_DATA' && sender.tab) {
    const dataKey = `${sender.tab.id}:${message.platform}`;
    const data = interceptor.capturedData.get(dataKey);
    sendResponse({ data });
  } else if (message.type === 'DOWNLOAD_FILE') {
    chrome.downloads.download({
      url: message.url,
      filename: message.filename,
      saveAs: false
    }, (downloadId) => {
      sendResponse({ downloadId });
    });
    return true;
  }
});
