document.getElementById('options-btn').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

document.getElementById('export-btn').addEventListener('click', async () => {
  const statusMsg = document.getElementById('status-msg');
  statusMsg.textContent = 'Triggering export...';

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // We can't directly call export() from popup in a clean way unless we send a message 
    // to the content script, or if the popup itself orchestrates it. 
    // The spec says the content script has ExportOrchestrator. We will just send a message
    // to the content script to trigger its export.
    chrome.tabs.sendMessage(tab.id, { type: 'TRIGGER_EXPORT' }, (response) => {
      if (chrome.runtime.lastError) {
        statusMsg.textContent = 'Cannot export on this page.';
        statusMsg.style.color = '#dc2626';
      } else {
        window.close(); // Close popup on success
      }
    });
  } catch (e) {
    statusMsg.textContent = 'Error: ' + e.message;
  }
});
