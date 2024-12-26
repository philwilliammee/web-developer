// components/MainApplication/MainApplication.ts
import { Chat } from "../Chat/chat";
import { ConsoleWrapper } from "../../console-wrapper";
import { CsvUploader } from "../CsvUploader";
import { CodeDownloader } from "../CodeDownloader";
import { CodeEditorComponent } from "../CodeEditor/CodeEditorComponent";
import { CSSManager } from "../../utils/css-manager";
import { mainApplicationStyles } from "./mainApplication.styles";

export class MainApplication {
  // Components
  private codeEditor!: CodeEditorComponent;
  private chat!: Chat;
  private csvUploader!: CsvUploader;
  private codeDownloader!: CodeDownloader;
  private consoleWrapper!: ConsoleWrapper;

  // DOM Elements
  private viewTab!: HTMLElement;
  private codeTab!: HTMLElement;
  private iframeContainer!: HTMLElement;
  private codeEditorContainer!: HTMLElement;
  private executeButton!: HTMLButtonElement;
  private controlsContainer!: HTMLElement;

  constructor() {
    console.log('Initializing MainApplication');
    this.initializeDOMElements();
    this.initializeComponents();
    this.setupEventListeners();
    this.initializeStyles();

    // Set initial state
    this.showCodeEditor();
  }

  private initializeDOMElements(): void {
    // Get DOM elements
    this.viewTab = document.getElementById("viewTab") as HTMLElement;
    this.codeTab = document.getElementById("codeTab") as HTMLElement;
    this.iframeContainer = document.getElementById("iframeContainer") as HTMLElement;
    this.codeEditorContainer = document.getElementById("codeEditor") as HTMLElement;
    this.executeButton = document.querySelector(".execute-btn") as HTMLButtonElement;
    this.controlsContainer = document.querySelector(".file-controls") as HTMLElement;

    if (!this.viewTab || !this.codeTab || !this.iframeContainer ||
        !this.codeEditorContainer || !this.executeButton || !this.controlsContainer) {
      throw new Error("Required DOM elements not found");
    }
  }

  private initializeComponents(): void {
    // Initialize CodeEditor
    this.codeEditor = new CodeEditorComponent("code-editor");
    this.codeEditorContainer.appendChild(this.codeEditor.getElement());

    // Set default content
    this.codeEditor.updateCode({
      html: "<h1>Hello, World!</h1>",
      css: "h1 { color: red; }",
      javascript: 'console.log("Hello, World!");',
      combinedCode: this.getDefaultCombinedCode(),
      data: [],
    });

    // Initialize utility components
    this.csvUploader = new CsvUploader();
    this.codeDownloader = new CodeDownloader();
    this.consoleWrapper = new ConsoleWrapper();

    // Initialize Chat
    this.chat = new Chat({
      codeEditor: this.codeEditor,
      csvUploader: this.csvUploader
    });
  }

  private setupEventListeners(): void {
    this.viewTab.addEventListener("click", () => this.showPreview());
    this.codeTab.addEventListener("click", () => this.showCodeEditor());
    this.executeButton.addEventListener("click", () => this.executeCode());
  }

  private showPreview(): void {
    this.viewTab.classList.add("active");
    this.codeTab.classList.remove("active");
    this.iframeContainer.style.display = "block";
    this.codeEditorContainer.style.display = "none";
  }

  private showCodeEditor(): void {
    this.codeTab.classList.add("active");
    this.viewTab.classList.remove("active");
    this.codeEditorContainer.style.display = "block";
    this.iframeContainer.style.display = "none";

    const code = this.codeEditor.getCode();
    this.codeEditor.updateCode(code);
  }

  private async executeCode(): Promise<void> {
    try {
      const code = this.codeEditor.getCode();
      const iframe = this.resetIframe();

      const iframeDocument = iframe.contentWindow?.document;
      if (!iframeDocument) {
        throw new Error("Unable to access the iframe's document");
      }

      this.consoleWrapper.capture();

      iframeDocument.open();
      iframeDocument.write(code.combinedCode);
      iframeDocument.close();

      console.log("Code executed successfully");
      const consoleOutput = this.consoleWrapper.getLogs();
      console.log("assistant", `Code executed successfully\n${consoleOutput}`);

      this.showPreview();
    } catch (error: any) {
      console.error("Error executing code:", error);
      console.log("assistant", `Error: ${error.message}`);
    } finally {
      this.consoleWrapper.restore();
    }
  }

  private resetIframe(): HTMLIFrameElement {
    const oldIframe = document.getElementById("outputIframe") as HTMLIFrameElement;
    const newIframe = document.createElement("iframe");
    newIframe.id = "outputIframe";
    newIframe.sandbox.value = "allow-scripts allow-same-origin allow-modals";
    newIframe.style.width = this.iframeContainer.style.width;
    newIframe.style.height = this.iframeContainer.style.height;

    oldIframe.parentElement?.replaceChild(newIframe, oldIframe);
    return newIframe;
  }

  private getDefaultCombinedCode(): string {
    return `<!DOCTYPE html>
<html>
<head>
  <style>
    h1 { color: red; }
  </style>
</head>
<body>
  <h1>Hello, World!</h1>
  <script>
    console.log("Hello, World!");
  </script>
</body>
</html>`;
  }

  private initializeStyles(): void {
    CSSManager.getInstance().addStyles('main-application', mainApplicationStyles);
    this.codeEditorContainer.style.height = "500px";
    this.codeEditorContainer.style.position = "relative";
  }

  public destroy(): void {
    this.chat?.destroy();
    this.codeEditor?.destroy();
    this.csvUploader?.destroy?.();
    this.codeDownloader?.destroy?.();
    CSSManager.getInstance().removeStyles('main-application');
  }
}
