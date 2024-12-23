export class CodeDownloader {
    private button!: HTMLButtonElement;

    constructor(container: HTMLElement, editor: any) {
      this.createButton(container);
      this.setupEventListeners(editor);
    }

    private createButton(container: HTMLElement) {
      this.button = document.createElement('button');
      this.button.id = 'downloadBtn';
      this.button.className = 'download-btn';
      this.button.textContent = 'Download Code';
      container.appendChild(this.button);
    }

    private setupEventListeners(editor: any) {
      this.button.addEventListener('click', () => {
        const code = editor.getValue() || '';
        this.downloadCode(code);
      });
    }

    private downloadCode(code: string) {
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'code.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    public destroy() {
      this.button.remove();
    }
  }
