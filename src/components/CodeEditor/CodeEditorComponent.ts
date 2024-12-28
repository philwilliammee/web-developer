import { MonacoEditor } from "./MonacoEditor";
import { codeEditorStyles } from "./codeEditor.styles";
import { CSSManager } from "../../utils/css-manager";
import { dataStore } from "../../stores/AppStore";

export interface CodeEditorState {
  html: string;
  css: string;
  javascript: string;
  combinedCode: string;
  data: any[];
}

export type EditorType = "html" | "css" | "javascript" | "combined" | "data";
type EditorMap = Record<EditorType, MonacoEditor>;

export class CodeEditorComponent {
  private container: HTMLElement;
  private editors!: EditorMap;
  private activeEditor: EditorType = "combined";
  private editorTabs: NodeListOf<HTMLButtonElement>;
  private editorsContainer: HTMLElement;

  constructor(containerId: string) {
    CSSManager.getInstance().addStyles("code-editor", codeEditorStyles);

    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with ID ${containerId} not found`);
    }
    this.container = container;

    // Get existing tabs and containers
    this.editorTabs = document
      .querySelector("#codeEditor .editor-tabs")
      ?.querySelectorAll(".editor-tab") as NodeListOf<HTMLButtonElement>;
    this.editorsContainer = document.querySelector(
      "#codeEditor .editor-containers"
    ) as HTMLElement;

    if (!this.editorTabs?.length || !this.editorsContainer) {
      throw new Error("Required editor elements not found in DOM");
    }

    this.setupEditors();
    this.setupTabListeners();
  }

  private createEditorContainer(id: string, type: EditorType): HTMLElement {
    const container = document.createElement("div");
    container.id = id;
    container.className = `editor-container ${type}-editor`;
    container.style.height = "100%";
    container.style.display = "none"; // Hide initially
    this.editorsContainer.appendChild(container);
    return container;
  }

  private setupEditors() {
    const defaultOnChange = (value: string) => {
      if (this.activeEditor !== "combined" && this.activeEditor !== "data") {
        this.updateCombinedView();
      }
    };

    this.editors = {
      html: new MonacoEditor(
        this.createEditorContainer("htmlEditor", "html"),
        "",
        defaultOnChange,
        "html"
      ),
      css: new MonacoEditor(
        this.createEditorContainer("cssEditor", "css"),
        "",
        defaultOnChange,
        "css"
      ),
      javascript: new MonacoEditor(
        this.createEditorContainer("javascriptEditor", "javascript"),
        "",
        defaultOnChange,
        "javascript"
      ),
      combined: new MonacoEditor(
        this.createEditorContainer("combinedEditor", "combined"),
        "",
        () => {},
        "html"
      ),
      data: new MonacoEditor(
        this.createEditorContainer("dataEditor", "data"),
        "",
        () => {},
        "json"
      ),
    };

    // Show combined editor initially
    this.editors.combined.show();
  }

  private setupTabListeners() {
    this.editorTabs.forEach((tab) => {
      const editorType = tab.dataset.editor as EditorType;
      if (editorType) {
        tab.addEventListener("click", () => this.switchTab(editorType));
      }
    });
  }

  private updateCombinedView() {
    const combinedCode = this.generateCombinedCode(
      this.editors.html.getValue(),
      this.editors.css.getValue(),
      this.editors.javascript.getValue()
    );
    this.editors.combined.setValue(combinedCode);
  }

  private generateCombinedCode(
    html: string,
    css: string,
    javascript: string
  ): string {
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
    Object.values(this.editors).forEach((editor) => editor.hide());

    // Show selected editor
    this.editors[tabName].show();
    this.activeEditor = tabName;

    // Update tab styling
    this.editorTabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.editor === tabName);
    });

    // Trigger layout update for the visible editor
    this.editors[tabName].layout();
  }

  public updateCode(code: CodeEditorState) {
    try {
      this.editors.html.setValue(code.html || "");
      this.editors.css.setValue(code.css || "");
      this.editors.javascript.setValue(code.javascript || "");
      this.editors.combined.setValue(code.combinedCode || "");

      if (code.data) {
        this.editors.data.setValue(JSON.stringify(code.data, null, 2));
      }

      // Force layout update
      Object.values(this.editors).forEach((editor) => editor.layout());
    } catch (error) {
      console.error("Error updating code editors:", error);
      this.showError("Failed to update code editors");
    }
  }

  private showError(message: string) {
    const errorElement = document.createElement("div");
    errorElement.className = "editor-error";
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
      data: JSON.parse(this.editors.data.getValue() || "[]"),
    };
  }

  public mount(parent: HTMLElement) {
    parent.appendChild(this.container);
    this.editors[this.activeEditor].layout();
  }

  public destroy() {
    Object.values(this.editors).forEach((editor) => editor.dispose());
    this.container.remove();
    CSSManager.getInstance().removeStyles("code-editor");
  }

  public getElement(): HTMLElement {
    return this.container;
  }
}
