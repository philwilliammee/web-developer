import { designAssistantInstance } from "./design-assistant-bot";
import { ConsoleWrapper } from "./console-wrapper";
import { MonacoEditor } from "./components/MonacoEditor";
import { ButtonSpinner } from "./components/ButtonSpinner";

export class Cell {
  private codeEditor: MonacoEditor | null = null;
  private outputElement: HTMLElement | null;
  private promptInput: HTMLInputElement | null;
  private buttonSpinner: ButtonSpinner | null = null;
  public element: HTMLElement;
  private isGenerating: boolean = false;
  private editorContainer: HTMLElement | null = null;
  private resizeHandle: HTMLElement | null = null;

  constructor(initialCode: string = "") {
    this.element = this.createElement();
    this.outputElement = this.element.querySelector(".output-content") as HTMLElement;
    this.promptInput = this.element.querySelector(".prompt-input") as HTMLInputElement;
    this.editorContainer = this.element.querySelector(".monaco-editor-container") as HTMLElement;
    this.resizeHandle = this.element.querySelector(".resize-handle") as HTMLElement;

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
    this.setupResizeHandle();
  }

  private createElement(): HTMLElement {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.innerHTML = `
      <div class="prompt-section">
        <form class="prompt-form">
          <input type="text" class="prompt-input" placeholder="Enter your prompt for Code-Bot..." value="">
          <button type="submit" class="btn btn-green generate-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 8v8"></path>
              <path d="M8 12h8"></path>
            </svg>
            Generate Code
          </button>
        </form>
      </div>
      <div class="monaco-editor-wrapper">
        <div class="monaco-editor-container"></div>
        <div class="resize-handle">
          <div class="resize-handle-line"></div>
          <div class="resize-handle-line"></div>
          <div class="resize-handle-line"></div>
        </div>
      </div>
      <button class="btn btn-blue execute-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        Execute
      </button>
      <div class="output">
        <div class="output-label">Output:</div>
        <pre class="output-content"></pre>
      </div>
    `;
    return cell;
  }

  private setupResizeHandle(): void {
    if (!this.resizeHandle || !this.editorContainer) return;

    let startY = 0;
    let startHeight = 0;

    const onMouseDown = (e: MouseEvent) => {
      startY = e.clientY;
      startHeight = this.editorContainer!.offsetHeight;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.body.style.cursor = 'row-resize';
      this.resizeHandle!.classList.add('active');
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!this.editorContainer) return;
      const newHeight = startHeight + (e.clientY - startY);
      if (newHeight >= 100) { // Minimum height
        this.editorContainer.style.height = `${newHeight}px`;
        if (this.codeEditor) {
          this.codeEditor.layout();
        }
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      this.resizeHandle!.classList.remove('active');
    };

    this.resizeHandle.addEventListener('mousedown', onMouseDown);
  }

  private setupEventListeners(): void {
    const executeButton = this.element.querySelector(".execute-btn") as HTMLButtonElement;
    executeButton.addEventListener("click", () => this.executeCode());

    const form = this.element.querySelector(".prompt-form") as HTMLFormElement;
    if (form) {
      form.addEventListener("submit", (event: SubmitEvent) => {
        console.log("Form submitted");
        event.preventDefault(); // Prevent the default form submission
        this.generateCode()
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

        if (this.outputElement) {
          this.outputElement.textContent = `Web design generated successfully:\n${description}`;
        }
      } catch (error: any) {
        if (this.outputElement) {
          this.outputElement.textContent = `Error generating design: ${error.message}`;
        }
      } finally {
        this.setLoading(false);
      }
    }
  }

  async executeCode(): Promise<void> {
    const consoleWrapper = new ConsoleWrapper();
    try {
      const code = this.codeEditor?.getValue() || "";

      // Add the executed code to the chat context as a user message
      designAssistantInstance.addToChatContext({
        role: "user",
        content: [{ text: `Executing code:\n${code}`, type: "text" }],
      });

      // Target the iframe element by its ID
      const iframeContainer = document.getElementById("outputIframe") as HTMLIFrameElement;
      if (!iframeContainer) {
        throw new Error("Output iframe not found. Please ensure the iframe exists in the HTML.");
      }

      // Use contentWindow.document to access the iframe's document
      const iframeDocument = iframeContainer.contentWindow?.document;
      if (!iframeDocument) {
        throw new Error("Unable to access the iframe's document.");
      }

      // Write the generated code into the iframe's document
      iframeDocument.open();
      iframeDocument.write(code);
      iframeDocument.close();

      // Capture console logs
      consoleWrapper.capture();
      console.log("Web Design Assistant iframe content rendered successfully");
      const consoleOutput = consoleWrapper.getLogs();

      // Add a summary message in the chat context
      designAssistantInstance.addToChatContext({
        role: "assistant",
        content: [
          {
            text: `Execution result: The generated web design is displayed in the iframe.\nLogs:\n${consoleOutput}`,
            type: "text",
          },
        ],
      });

      // Update the output element status
      if (this.outputElement) {
        this.outputElement.textContent = `Generated content rendered successfully in the iframe. Check the console for logs.`;
      }
    } catch (error: any) {
      const errorMessage = `Error: ${error.message}`;

      // Add the error message to the chat context as an assistant message
      designAssistantInstance.addToChatContext({
        role: "assistant",
        content: [{ text: errorMessage, type: "text" }],
      });

      // Display the error in the cell
      if (this.outputElement) {
        this.outputElement.textContent = errorMessage;
      }
    } finally {
      consoleWrapper.restore();
    }
  }

  public dispose() {
    if (this.codeEditor) {
      this.codeEditor.dispose();
    }
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
}
