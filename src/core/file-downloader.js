export class FileDownloader {
  static async download(content, filename) {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    // Instead of using anchor tag which can be problematic, use the background
    // script to trigger chrome.downloads if possible, or fallback to anchor
    try {
      await chrome.runtime.sendMessage({
        type: 'DOWNLOAD_FILE',
        url: url,
        filename: filename
      });
    } catch (e) {
      // Fallback if background script doesn't handle it
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  static sanitizeFilename(name) {
    return name
      .replace(/[^a-z0-9]/gi, '_')
      .replace(/_{2,}/g, '_')
      .toLowerCase()
      .substring(0, 100);
  }
}
