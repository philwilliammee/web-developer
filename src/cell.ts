import { ButtonSpinner } from "./components/ButtonSpinner";
import { MonacoEditor } from "./components/MonacoEditor";
import { ResizeHandler } from "./components/ResizeHandler";
import { ConsoleWrapper } from "./console-wrapper";
import { designAssistantInstance } from "./design-assistant-bot";

export class Cell {
  private codeEditor: MonacoEditor | null = null;
  private chatMessages: HTMLElement;
  private promptInput: HTMLTextAreaElement | null;
  private buttonSpinner: ButtonSpinner | null = null;
  public element: HTMLElement;
  private isGenerating: boolean = false;
  private editorContainer: HTMLElement | null = null;
  private editorWrapper: HTMLElement | null = null;
  private resizeHandler: ResizeHandler | null = null;

  constructor(initialCode: string = "") {
    this.element = this.createElement();
    this.chatMessages = this.element.querySelector(".chat-messages") as HTMLElement;
    this.promptInput = this.element.querySelector(".prompt-input") as HTMLTextAreaElement;
    this.editorContainer = this.element.querySelector(".monaco-editor-container") as HTMLElement;
    this.editorWrapper = this.element.querySelector(".monaco-editor-wrapper") as HTMLElement;

    const generateButton = this.element.querySelector(".generate-btn") as HTMLButtonElement;
    this.buttonSpinner = new ButtonSpinner(generateButton);

    this.codeEditor = new MonacoEditor(
      this.editorContainer,
      initialCode,
      (value: string) => {
        // Handle onChange if needed
      }
    );

    this.setupEventListeners();
    this.setupResizeHandler();
  }

  private createElement(): HTMLElement {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.innerHTML = `
      <div class="monaco-editor-wrapper">
        <div class="monaco-editor-container"></div>
        <div class="editor-actions">
          <button class="btn btn-blue execute-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            Execute
          </button>
        </div>
        <div class="resize-handle">
          <div class="resize-handle-line"></div>
          <div class="resize-handle-line"></div>
          <div class="resize-handle-line"></div>
        </div>
      </div>
      <div class="chat-section">
        <div class="chat-messages"></div>
        <form class="prompt-form">
          <textarea class="prompt-input" placeholder="Enter your prompt for Code-Bot..."></textarea>
          <div>
            <button type="submit" class="btn btn-green generate-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="21 12 9 18 9 6 21 12"></polygon>
              </svg>
            </button>
          </div>
        </form>
      </div>
    `;
    return cell;
  }

  private setupResizeHandler(): void {
    if (!this.editorWrapper) return;

    const resizeHandle = this.element.querySelector(".resize-handle") as HTMLElement;
    const chatSection = this.element.querySelector(".chat-section") as HTMLElement;

    this.resizeHandler = new ResizeHandler(
      this.editorWrapper,
      chatSection,
      resizeHandle,
      () => {
        if (this.codeEditor) {
          this.codeEditor.layout();
        }
      }
    );
  }

  private setupEventListeners(): void {
    const executeButton = this.element.querySelector(".execute-btn") as HTMLButtonElement;
    executeButton.addEventListener("click", () => this.executeCode());

    const form = this.element.querySelector(".prompt-form") as HTMLFormElement;
    if (form) {
      form.addEventListener("submit", (event: SubmitEvent) => {
        event.preventDefault();
        this.generateCode();
      });
    }
  }

  private async generateCode(): Promise<void> {
    const prompt = this.promptInput?.value.trim();
    if (prompt && !this.isGenerating) {
      this.setLoading(true);
      try {
        const { html, css, javascript, description } = await designAssistantInstance.generateWebDesign(prompt);

        if (this.codeEditor) {
          const combinedCode = `<html>\n${html}\n<style>\n${css}\n</style>\n<script>\n${javascript}\n</script>`;
          this.codeEditor.setValue(combinedCode);
        }

        this.appendToChatContext("user", prompt);
        this.appendToChatContext("assistant", description);

        // Clear the textarea input
        if (this.promptInput) {
          this.promptInput.value = "";
        }
      } catch (error: any) {
        this.appendToChatContext("assistant", `Error generating design: ${error.message}`);
      } finally {
        this.setLoading(false);
      }
    }
  }

  async executeCode(): Promise<void> {
    const consoleWrapper = new ConsoleWrapper();
    try {
      const code = this.codeEditor?.getValue() || "";

      this.appendToChatContext("user", `Executing code`);

      const iframeContainer = document.getElementById("outputIframe") as HTMLIFrameElement;
      if (!iframeContainer) {
        throw new Error("Output iframe not found");
      }

      const iframeDocument = iframeContainer.contentWindow?.document;
      if (!iframeDocument) {
        throw new Error("Unable to access the iframe's document");
      }

      iframeDocument.open();
      iframeDocument.write(code);
      iframeDocument.close();

      consoleWrapper.capture();
      console.log("Code executed successfully");
      const consoleOutput = consoleWrapper.getLogs();

      this.appendToChatContext("assistant", `Code executed successfully\n${consoleOutput}`);
    } catch (error: any) {
      this.appendToChatContext("assistant", `Error: ${error.message}`);
    } finally {
      consoleWrapper.restore();
    }
  }

  private appendToChatContext(role: "user" | "assistant", message: string): void {
    const messageElement = document.createElement("div");
    messageElement.className = `chat-message ${role}`;
    messageElement.textContent = message;

    this.chatMessages.appendChild(messageElement);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  private setLoading(loading: boolean) {
    this.isGenerating = loading;
    const generateButton = this.element.querySelector(".generate-btn") as HTMLButtonElement;
    const executeButton = this.element.querySelector(".execute-btn") as HTMLButtonElement;

    if (loading) {
      this.buttonSpinner?.show();
      generateButton.disabled = true;
      executeButton.disabled = true;
      if (this.promptInput) this.promptInput.disabled = true;
    } else {
      this.buttonSpinner?.hide();
      generateButton.disabled = false;
      executeButton.disabled = false;
      if (this.promptInput) this.promptInput.disabled = false;
    }
  }

  public dispose() {
    if (this.codeEditor) {
      this.codeEditor.dispose();
    }
    if (this.resizeHandler) {
      this.resizeHandler.dispose();
    }
  }
}
