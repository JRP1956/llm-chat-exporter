import { Storage } from '../shared/storage.js';

document.addEventListener('DOMContentLoaded', async () => {
  const options = await Storage.getAll();

  document.getElementById('include-thinking').checked = options.includeThinking;
  document.getElementById('include-timestamps').checked = options.includeTimestamps;
  document.getElementById('include-metadata').checked = options.includeMetadata;

  document.getElementById('plat-claude').checked = options.enabledPlatforms.claude;
  document.getElementById('plat-chatgpt').checked = options.enabledPlatforms.chatgpt;

  document.getElementById('save-btn').addEventListener('click', async () => {
    const newOptions = {
      includeThinking: document.getElementById('include-thinking').checked,
      includeTimestamps: document.getElementById('include-timestamps').checked,
      includeMetadata: document.getElementById('include-metadata').checked,
      enabledPlatforms: {
        ...options.enabledPlatforms,
        claude: document.getElementById('plat-claude').checked,
        chatgpt: document.getElementById('plat-chatgpt').checked,
      }
    };

    for (const [key, val] of Object.entries(newOptions)) {
      await Storage.set(key, val);
    }

    const status = document.getElementById('save-status');
    status.style.opacity = 1;
    setTimeout(() => {
      status.style.opacity = 0;
    }, 2000);
  });
});
