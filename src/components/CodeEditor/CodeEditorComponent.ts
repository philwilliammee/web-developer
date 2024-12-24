// components/CodeEditor/CodeEditorComponent.ts
import { MonacoEditor } from "./MonacoEditor";
import { codeEditorStyles } from "./codeEditor.styles";
import { CSSManager } from "../../utils/css-manager";
import { dataStore } from "../../stores/data.stores";

export interface CodeEditorState {
  html: string;
  css: string;
  javascript: string;
  combinedCode: string;
  data: any[];
}

type EditorType = 'html' | 'css' | 'javascript' | 'combined' | 'data';
type EditorMap = Record<EditorType, MonacoEditor>;

export class CodeEditorComponent {
  private container: HTMLElement;
  private editors!: EditorMap;
  private activeEditor: EditorType = 'combined';

  constructor(containerId: string) {
    // Initialize styles
    CSSManager.getInstance().addStyles('code-editor', codeEditorStyles);

    const existingContainer = document.getElementById(containerId);
    if (!existingContainer) {
      this.container = document.createElement('div');
      this.container.id = containerId;
    } else {
      this.container = existingContainer;
    }
    this.container.className = 'code-editor-component';

    this.setupEditors();
    this.setupTabs();
  }

  private createEditorContainer(id: string, type: EditorType): HTMLElement {
    const container = document.createElement('div');
    container.id = id;
    container.className = `editor-container ${type}-editor`;
    container.style.height = '100%';
    container.style.display = 'none'; // Hide initially
    this.container.appendChild(container);
    return container;
  }

  private setupEditors() {
    const defaultOnChange = (value: string) => {
      // Only update combined view when individual editors change
      if (this.activeEditor !== 'combined' && this.activeEditor !== 'data') {
        this.updateCombinedView();
      }
    };

    this.editors = {
      html: new MonacoEditor(
        this.createEditorContainer('htmlEditor', 'html'),
        '',
        defaultOnChange
      ),
      css: new MonacoEditor(
        this.createEditorContainer('cssEditor', 'css'),
        '',
        defaultOnChange
      ),
      javascript: new MonacoEditor(
        this.createEditorContainer('javascriptEditor', 'javascript'),
        '',
        defaultOnChange
      ),
      combined: new MonacoEditor(
        this.createEditorContainer('combinedEditor', 'combined'),
        '',
        () => {} // No onChange handler for combined view
      ),
      data: new MonacoEditor(
        this.createEditorContainer('dataEditor', 'data'),
        '',
        () => {} // No onChange handler for data view
      )
    };

    // Show combined editor initially
    this.editors.combined.show();
  }

  private setupTabs() {
    const tabContainer = document.createElement('div');
    tabContainer.className = 'editor-tabs';

    const tabs: Array<{ id: EditorType; label: string }> = [
      { id: 'combined', label: 'Combined' },
      { id: 'html', label: 'HTML' },
      { id: 'css', label: 'CSS' },
      { id: 'javascript', label: 'JavaScript' },
      { id: 'data', label: 'Data' }
    ];

    tabs.forEach(({ id, label }) => {
      const tabElement = document.createElement('button');
      tabElement.textContent = label;
      tabElement.className = 'editor-tab';
      if (id === 'combined') {
        tabElement.classList.add('active');
      }
      tabElement.onclick = () => this.switchTab(id);
      tabContainer.appendChild(tabElement);
    });

    this.container.insertBefore(tabContainer, this.container.firstChild);
  }

  private updateCombinedView() {
    const combinedCode = this.generateCombinedCode(
      this.editors.html.getValue(),
      this.editors.css.getValue(),
      this.editors.javascript.getValue()
    );
    this.editors.combined.setValue(combinedCode);
  }

  private generateCombinedCode(html: string, css: string, javascript: string): string {
    const data = dataStore.getData();
    return `<!DOCTYPE html>
<html>
<head>
  <style>
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    // Make data available to visualization
    window.data = ${JSON.stringify(data || [])};
    // Your visualization code
    ${javascript}
  </script>
</body>
</html>`;
  }

  private switchTab(tabName: EditorType) {
    // Hide all editors
    Object.values(this.editors).forEach(editor => editor.hide());

    // Show selected editor
    this.editors[tabName].show();
    this.activeEditor = tabName;

    // Update tab styling
    const tabs = this.container.querySelectorAll('.editor-tab');
    tabs.forEach(tab => {
      tab.classList.toggle('active',
        tab.textContent?.toLowerCase() === tabName.toLowerCase());
    });

    // Trigger layout update for the visible editor
    this.editors[tabName].layout();
  }

  public updateCode(code: CodeEditorState) {
    try {
      this.editors.html.setValue(code.html || '');
      this.editors.css.setValue(code.css || '');
      this.editors.javascript.setValue(code.javascript || '');
      this.editors.combined.setValue(code.combinedCode || '');

      if (code.data) {
        this.editors.data.setValue(JSON.stringify(code.data, null, 2));
      }

      // Force layout update
      Object.values(this.editors).forEach(editor => editor.layout());
    } catch (error) {
      console.error('Error updating code editors:', error);
      this.showError('Failed to update code editors');
    }
  }

  private showError(message: string) {
    const errorElement = document.createElement('div');
    errorElement.className = 'editor-error';
    errorElement.textContent = message;
    this.container.appendChild(errorElement);

    setTimeout(() => {
      errorElement.remove();
    }, 5000);
  }

  public getCode(): CodeEditorState {
    return {
      html: this.editors.html.getValue(),
      css: this.editors.css.getValue(),
      javascript: this.editors.javascript.getValue(),
      combinedCode: this.editors.combined.getValue(),
      data: JSON.parse(this.editors.data.getValue() || '[]')
    };
  }

  public mount(parent: HTMLElement) {
    parent.appendChild(this.container);
    this.editors[this.activeEditor].layout();
  }

  public destroy() {
    Object.values(this.editors).forEach(editor => editor.dispose());
    this.container.remove();
    CSSManager.getInstance().removeStyles('code-editor');
  }

  public getElement(): HTMLElement {
    return this.container;
  }
}
