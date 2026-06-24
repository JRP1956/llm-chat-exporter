import { NetworkInterceptor } from './network-interceptor.js';

const interceptor = new NetworkInterceptor();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    if (tab.url.startsWith('https://claude.ai/') ||
        tab.url.startsWith('https://chatgpt.com/') ||
        tab.url.startsWith('https://gemini.google.com/') ||
        tab.url.startsWith('https://chat.deepseek.com/') ||
        tab.url.startsWith('https://grok.com/') ||
        tab.url.startsWith('https://copilot.microsoft.com/') ||
        tab.url.startsWith('https://www.perplexity.ai/')) {
      
      try {
        interceptor.attach(tabId);
      } catch (e) {
        console.warn('Could not attach debugger to tab', tabId, e);
      }
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
  } else if (message.type === 'INJECT_FETCH_HOOK' && sender.tab) {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      world: 'MAIN',
      func: () => {
        if (window.__llmExporterInjected) return;
        window.__llmExporterInjected = true;

        const patterns = [
          /backend-api\/conversation\/[^\/]+$/,
          /api\/organizations\/[^\/]+\/chat_conversations\/[^\/]+$/,
          /api\/chat_conversations\/[^\/]+/,
        ];

        function matches(url) {
          return patterns.some(p => p.test(url));
        }

        function dispatch(url, data) {
          window.dispatchEvent(new CustomEvent('__LLM_EXPORTER_DATA', { detail: { url, data } }));
        }

        const origFetch = window.fetch;
        window.fetch = async function () {
          const response = await origFetch.apply(this, arguments);
          const url = typeof arguments[0] === 'string' ? arguments[0] : arguments[0]?.url || '';
          if (matches(url)) {
            response.clone().text().then(body => {
              try { const d = JSON.parse(body); if (Object.keys(d).length) dispatch(url, d); } catch (e) {}
            });
          }
          return response;
        };

        const origOpen = XMLHttpRequest.prototype.open;
        const origSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function (method, url) {
          this.__llmUrl = typeof url === 'string' ? url : '';
          return origOpen.apply(this, arguments);
        };
        XMLHttpRequest.prototype.send = function () {
          if (this.__llmUrl && matches(this.__llmUrl)) {
            this.addEventListener('load', function () {
              try {
                const d = JSON.parse(this.responseText);
                if (Object.keys(d).length) dispatch(this.__llmUrl, d);
              } catch (e) {}
            });
          }
          return origSend.apply(this, arguments);
        };
      },
    });
  }
});
