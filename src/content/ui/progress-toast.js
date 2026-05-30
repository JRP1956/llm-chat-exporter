export class ProgressToast {
  constructor() {
    this.toast = null;
  }

  show(message) {
    this._createToast();
    this.toast.className = 'llm-exporter-toast show';
    this.update(message);
  }

  update(message) {
    if (this.toast) {
      this.toast.textContent = message;
    }
  }

  success(message) {
    if (this.toast) {
      this.toast.className = 'llm-exporter-toast show success';
      this.toast.textContent = message;
    }
  }

  error(message) {
    if (this.toast) {
      this.toast.className = 'llm-exporter-toast show error';
      this.toast.textContent = message;
    }
  }

  hide() {
    if (this.toast) {
      this.toast.className = 'llm-exporter-toast';
      setTimeout(() => {
        if (this.toast && this.toast.parentNode) {
          this.toast.parentNode.removeChild(this.toast);
        }
        this.toast = null;
      }, 300);
    }
  }

  _createToast() {
    if (!document.getElementById('llm-exporter-toast')) {
      this.toast = document.createElement('div');
      this.toast.id = 'llm-exporter-toast';
      document.body.appendChild(this.toast);
    } else {
      this.toast = document.getElementById('llm-exporter-toast');
    }
  }
}
