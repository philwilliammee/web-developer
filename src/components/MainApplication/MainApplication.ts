// components/MainApplication/MainApplication.ts
import { Chat } from "../Chat/chat";
import { ConsoleWrapper } from "../../console-wrapper";
import { CsvUploader } from "../CsvUploader";
import { CodeDownloader } from "../CodeDownloader";
import { CodeEditorComponent } from "../CodeEditor/CodeEditorComponent";
import { CSSManager } from "../../utils/css-manager";
import { mainApplicationStyles } from "./mainApplication.styles";

export class MainApplication {
  private codeEditor!: CodeEditorComponent;
  private chat!: Chat;
  private csvUploader!: CsvUploader;
  private codeDownloader!: CodeDownloader;
  private consoleWrapper!: ConsoleWrapper;

  private viewTab!: HTMLElement;
  private codeTab!: HTMLElement;
  private iframeContainer!: HTMLElement;
  private codeEditorContainer!: HTMLElement;
  private executeButton!: HTMLButtonElement;
  private controlsContainer!: HTMLElement;

  constructor() {
    this.initializeElements();
    this.initializeComponents();
    this.setupEventListeners();
    this.initializeStyles();

    // Set initial state
    this.toggleTab(this.codeTab, this.viewTab, this.codeEditorContainer, this.iframeContainer);
  }

  private initializeElements(): void {
    // Get or create necessary DOM elements
    this.viewTab = document.getElementById("viewTab") as HTMLElement;
    this.codeTab = document.getElementById("codeTab") as HTMLElement;
    this.iframeContainer = document.getElementById("iframeContainer") as HTMLElement;
    this.codeEditorContainer = document.getElementById("codeEditor") as HTMLElement;
    this.executeButton = document.querySelector(".execute-btn") as HTMLButtonElement;

    if (!this.viewTab || !this.codeTab || !this.iframeContainer ||
        !this.codeEditorContainer || !this.executeButton) {
      throw new Error("Required DOM elements not found");
    }

    // Create controls container
    this.controlsContainer = document.createElement("div");
    this.controlsContainer.className = "file-controls";
    document.body.appendChild(this.controlsContainer);
  }

  private initializeComponents(): void {
    // Initialize CodeEditor
    this.codeEditor = new CodeEditorComponent("code-editor");
    this.codeEditorContainer.appendChild(this.codeEditor.getElement());

    // Initialize with default content
    this.codeEditor.updateCode({
      html: "<h1>Hello, World!</h1>",
      css: "h1 { color: red; }",
      javascript: 'console.log("Hello, World!");',
      combinedCode: this.getDefaultCombinedCode(),
      data: [],
    });

    // Initialize other components
    this.csvUploader = new CsvUploader(this.controlsContainer);
    this.codeDownloader = new CodeDownloader(this.controlsContainer, this.codeEditor);
    this.consoleWrapper = new ConsoleWrapper();

    // Initialize Chat
    const chatContainer = document.getElementById("chat");
    if (!chatContainer) {
      throw new Error("Chat container not found");
    }

    this.chat = new Chat({
      codeEditor: this.codeEditor,
      csvUploader: this.csvUploader
    });
  }

  private initializeStyles(): void {
    CSSManager.getInstance().addStyles('main-application', mainApplicationStyles);
    this.codeEditorContainer.style.height = "500px";
    this.codeEditorContainer.style.position = "relative";
  }

  private setupEventListeners(): void {
    // Tab switching
    this.viewTab.addEventListener("click", () => {
      this.toggleTab(this.viewTab, this.codeTab, this.iframeContainer, this.codeEditorContainer);
    });

    this.codeTab.addEventListener("click", () => {
      this.toggleTab(this.codeTab, this.viewTab, this.codeEditorContainer, this.iframeContainer);
      const code = this.codeEditor.getCode();
      this.codeEditor.updateCode(code);
    });

    // Execute button
    this.executeButton.addEventListener("click", () => this.executeCode());
  }

  private toggleTab(
    activeTab: HTMLElement,
    inactiveTab: HTMLElement,
    showElement: HTMLElement,
    hideElement: HTMLElement
  ): void {
    activeTab.classList.add("active");
    inactiveTab.classList.remove("active");
    showElement.style.display = "block";
    hideElement.style.display = "none";
  }

  private async executeCode(): Promise<void> {
    try {
      const code = this.codeEditor.getCode();
      const newIframe = this.createNewIframe();

      const iframeDocument = newIframe.contentWindow?.document;
      if (!iframeDocument) {
        throw new Error("Unable to access the iframe's document");
      }

      iframeDocument.open();
      iframeDocument.write(code.combinedCode);
      iframeDocument.close();

      this.consoleWrapper.capture();
      console.log("Code executed successfully");
      const consoleOutput = this.consoleWrapper.getLogs();
      console.log("assistant", `Code executed successfully\n${consoleOutput}`);

      this.toggleTab(this.viewTab, this.codeTab, this.iframeContainer, this.codeEditorContainer);
    } catch (error: any) {
      console.error("Error executing code:", error);
      console.log("assistant", `Error: ${error.message}`);
    } finally {
      this.consoleWrapper.restore();
    }
  }

  private createNewIframe(): HTMLIFrameElement {
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
    return `
<!DOCTYPE html>
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

  public destroy(): void {
    // Cleanup
    this.chat?.destroy();
    this.codeEditor?.destroy();
    this.csvUploader?.destroy?.();
    this.codeDownloader?.destroy?.();
    this.controlsContainer?.remove();
    CSSManager.getInstance().removeStyles('main-application');
  }
}
