export class ResizeHandler {
    private startY: number = 0;
    private startHeight: number = 0;
    private isDragging: boolean = false;
    private editorWrapper: HTMLElement;
    private chatSection: HTMLElement;
    private handle: HTMLElement;
    private onResize: () => void;

    constructor(
      editorWrapper: HTMLElement,
      chatSection: HTMLElement,
      handle: HTMLElement,
      onResize: () => void
    ) {
      this.editorWrapper = editorWrapper;
      this.chatSection = chatSection;
      this.handle = handle;
      this.onResize = onResize;
      this.setupEventListeners();
    }

    private setupEventListeners(): void {
      this.handle.addEventListener('mousedown', this.onMouseDown);
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    }

    private onMouseDown = (e: MouseEvent): void => {
      this.isDragging = true;
      this.startY = e.clientY;
      this.startHeight = this.editorWrapper.offsetHeight;
      this.handle.classList.add('active');
      document.body.style.cursor = 'row-resize';
    };

    private onMouseMove = (e: MouseEvent): void => {
      if (!this.isDragging) return;

      const deltaY = e.clientY - this.startY;
      const newHeight = Math.max(200, this.startHeight + deltaY); // Minimum height of 200px

      // Calculate remaining space for chat section (considering padding and gaps)
      const containerHeight = this.editorWrapper.parentElement?.offsetHeight || 0;
      const maxHeight = containerHeight - 200; // Minimum 200px for chat section

      if (newHeight <= maxHeight) {
        this.editorWrapper.style.height = `${newHeight}px`;
        this.onResize();
      }
    };

    private onMouseUp = (): void => {
      this.isDragging = false;
      this.handle.classList.remove('active');
      document.body.style.cursor = '';
    };

    public dispose(): void {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    }
  }
