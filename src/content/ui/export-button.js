export class ExportButton {
  constructor(orchestrator, platformId) {
    this.orchestrator = orchestrator;
    this.platformId   = platformId;
    this.button       = null;
  }

  inject(mountPoint) {
    if (!mountPoint || document.getElementById('llm-exporter-btn')) return;

    this.button = document.createElement('button');
    this.button.id = 'llm-exporter-btn';
    this.button.className = 'llm-exporter-button';
    this.button.setAttribute('aria-label', 'Export conversation');
    this.button.setAttribute('title', 'Export conversation to Markdown');
    this.button.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      <span>Export</span>
    `;

    this.button.addEventListener('click', () => {
      this.orchestrator.export();
    });

    mountPoint.appendChild(this.button);
  }

  // Re-inject if React/Angular re-renders wipe the button
  watchForRemoval(mountPointSelector) {
    const observer = new MutationObserver(() => {
      if (!document.getElementById('llm-exporter-btn')) {
        const mountPoint = document.querySelector(mountPointSelector);
        if (mountPoint) this.inject(mountPoint);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
}
