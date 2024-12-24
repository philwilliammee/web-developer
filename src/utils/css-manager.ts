// src/utils/css-manager.ts
export class CSSManager {
    private static instance: CSSManager;
    private styleSheets: Map<string, HTMLStyleElement> = new Map();

    private constructor() {}

    public static getInstance(): CSSManager {
      if (!CSSManager.instance) {
        CSSManager.instance = new CSSManager();
      }
      return CSSManager.instance;
    }

    public addStyles(componentName: string, styles: string): void {
      if (this.styleSheets.has(componentName)) {
        return;
      }

      const styleSheet = document.createElement('style');
      styleSheet.setAttribute('data-component', componentName);
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
      this.styleSheets.set(componentName, styleSheet);
    }

    public removeStyles(componentName: string): void {
      const styleSheet = this.styleSheets.get(componentName);
      if (styleSheet) {
        styleSheet.remove();
        this.styleSheets.delete(componentName);
      }
    }
  }
