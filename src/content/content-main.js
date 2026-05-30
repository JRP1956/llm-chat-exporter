import { ExportButton } from './ui/export-button.js';
import { ExportOrchestrator } from '../core/export-orchestrator.js';

let currentUrl = window.location.href;
let orchestrator = null;

function initialize() {
  try {
    orchestrator = new ExportOrchestrator();
    
    // Check if network data is already available
    chrome.runtime.sendMessage(
      { type: 'REQUEST_NETWORK_DATA', platform: orchestrator.adapter.getPlatformId() },
      (response) => {
        if (response && response.data) {
          orchestrator.ingestNetworkData(response.data);
        }
      }
    );

    const mountPointSelector = orchestrator.adapter.getButtonMountPointSelector();
    const mountPoint = document.querySelector(mountPointSelector);
    if (mountPoint) {
      const btn = new ExportButton(orchestrator, orchestrator.adapter.getPlatformId());
      btn.inject(mountPoint);
      btn.watchForRemoval(mountPointSelector);
    } else {
      // Retry in case DOM is not fully rendered yet
      setTimeout(() => {
        const deferredMountPoint = document.querySelector(mountPointSelector);
        if (deferredMountPoint) {
          const btn = new ExportButton(orchestrator, orchestrator.adapter.getPlatformId());
          btn.inject(deferredMountPoint);
          btn.watchForRemoval(mountPointSelector);
        }
      }, 2000);
    }
  } catch (err) {
    console.debug('[LLM Exporter] Initialization skipped:', err.message);
  }
}

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
    // Small delay to let React/Angular render the new conversation
    setTimeout(initialize, 800);
  }
}

// Initial load
setTimeout(initialize, 1000);
