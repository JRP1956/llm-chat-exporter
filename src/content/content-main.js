import { ExportButton } from './ui/export-button.js';
import { ExportOrchestrator } from '../core/export-orchestrator.js';

let currentUrl = window.location.href;
let orchestrator = null;

function initialize() {
  try {
    orchestrator = new ExportOrchestrator();

    // Check if network data is already available from background
    chrome.runtime.sendMessage(
      { type: 'REQUEST_NETWORK_DATA', platform: orchestrator.adapter.getPlatformId() },
      (response) => {
        if (response && response.data) {
          orchestrator.ingestNetworkData(response.data);
        }
      }
    );

    function tryInject() {
      if (document.getElementById('llm-exporter-btn')) return true;

      const primary = orchestrator.adapter.getButtonMountPointSelector();
      let mountPoint = document.querySelector(primary);

      if (!mountPoint) {
        const fallbacks = [
          'header > div:last-child',
          'header > nav',
          'header div:last-child',
          'header nav:last-child',
          'header',
          'nav:first-of-type > div:last-child',
        ];
        for (const sel of fallbacks) {
          mountPoint = document.querySelector(sel);
          if (mountPoint) break;
        }
      }

      if (!mountPoint) {
        const container = document.createElement('div');
        container.id = 'llm-exporter-container';
        container.style.cssText =
          'position:fixed;top:12px;right:12px;z-index:9999;display:flex;align-items:center;gap:8px;';
        document.body.appendChild(container);
        mountPoint = container;
      }

      const btn = new ExportButton(orchestrator, orchestrator.adapter.getPlatformId());
      btn.inject(mountPoint);
      btn.watchForRemoval(() => tryInject());
      return true;
    }

    if (!tryInject()) {
      const observer = new MutationObserver(() => {
        if (tryInject()) observer.disconnect();
      });
      observer.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => observer.disconnect(), 30000);
    }
  } catch (err) {
    console.debug('[LLM Exporter] Initialization skipped:', err.message);
  }
}

// Listen for data from page-context hook
window.addEventListener('__LLM_EXPORTER_DATA', (event) => {
  if (orchestrator) {
    console.log('[LLM Exporter] Page hook captured data for:', event.detail.url);
    orchestrator.ingestNetworkData(event.detail.data);
  }
});

// Listen for messages from background or popup script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'NETWORK_DATA_CAPTURED' && orchestrator) {
    if (orchestrator.adapter.getPlatformId() === message.platform) {
      orchestrator.ingestNetworkData(message.data);
    }
  } else if (message.type === 'TRIGGER_EXPORT' && orchestrator) {
    orchestrator.export();
    sendResponse({ success: true });
  }
});

// Detect SPA navigation via History API patching
const originalPushState = history.pushState.bind(history);
history.pushState = function (...args) {
  originalPushState(...args);
  handleNavigation();
};

const originalReplaceState = history.replaceState.bind(history);
history.replaceState = function (...args) {
  originalReplaceState(...args);
  handleNavigation();
};

window.addEventListener('popstate', handleNavigation);

function handleNavigation() {
  const newUrl = window.location.href;
  if (newUrl !== currentUrl) {
    currentUrl = newUrl;
    setTimeout(initialize, 800);
  }
}

// Initial load
setTimeout(initialize, 1000);
