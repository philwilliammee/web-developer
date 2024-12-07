import { designAssistantInstance } from "./design-assistant-bot";
import { ConsoleWrapper } from "./console-wrapper";
import { MonacoEditor } from "./components/MonacoEditor";
import { ButtonSpinner } from "./components/ButtonSpinner";

export class WebDesignAssistant {
  private codeEditor: MonacoEditor | null = null;
  private outputElement: HTMLElement | null;
  private chatContextElement: HTMLElement | null;
  private promptInput: HTMLInputElement | null | undefined;
  private buttonSpinner: ButtonSpinner | null = null;
  private editorContainer: HTMLElement | null = null;

  constructor(containerId: string) {
    // Editor and Output Container
    this.editorContainer = document.getElementById(containerId);
    if (!this.editorContainer) {
      throw new Error(`Container with ID '${containerId}' not found.`);
    }

    // Chat Context Section
    this.chatContextElement = document.getElementById("chatContent");
    if (!this.chatContextElement) {
      throw new Error("Chat context element with ID 'chatContent' not found.");
    }

    // Output Section
    this.outputElement = document.getElementById("iframeContainer");
    if (!this.outputElement) {
      throw new Error("Iframe container with ID 'iframeContainer' not found.");
    }

    // Initialize Monaco Editor
    this.initializeEditor();

    // Setup Prompt Input
    this.setupPromptInput();
  }

  private initializeEditor(): void {
    const editorContainer = this.editorContainer;
    if (!editorContainer) return;

    // Create a wrapper for the editor and the execute button
    const editorWrapper = document.createElement("div");
    editorWrapper.className = "editor-wrapper";

    // Create the Monaco Editor
    const editorDiv = document.createElement("div");
    editorDiv.className = "monaco-editor-container";
    editorWrapper.appendChild(editorDiv);

    // Create the Execute Button
    const executeButton = document.createElement("button");
    executeButton.className = "btn btn-blue execute-btn";
    executeButton.textContent = "Execute";

    executeButton.addEventListener("click", () => this.executeCode());

    // Add the Execute Button below the editor
    editorWrapper.appendChild(executeButton);

    // Append the wrapper to the container
    editorContainer.appendChild(editorWrapper);

    // Initialize Monaco Editor
    this.codeEditor = new MonacoEditor(
      editorDiv,
      "<h1>Write your HTML, CSS, and JavaScript code here...</h1>",
      (value: string) => {
        // Handle onChange if needed
      }
    );
}


  private setupPromptInput(): void {
    this.promptInput = document.createElement("input");
    this.promptInput.type = "text";
    this.promptInput.placeholder = "Enter your prompt for Web Design Assistant...";
    this.promptInput.className = "prompt-input";

    const generateButton = document.createElement("button");
    generateButton.className = "btn btn-green generate-btn";
    generateButton.textContent = "Generate Code";

    this.buttonSpinner = new ButtonSpinner(generateButton);

    const form = document.createElement("form");
    form.className = "prompt-form";
    form.appendChild(this.promptInput);
    form.appendChild(generateButton);

    form.addEventListener("submit", (event: SubmitEvent) => {
      event.preventDefault(); // Prevent page reload
      this.generateCode();
    });

    if (this.chatContextElement) {
      this.chatContextElement.appendChild(form);
    }
  }

  private async generateCode(): Promise<void> {
    const prompt = this.promptInput?.value.trim();
    if (prompt && this.codeEditor) {
      this.setLoading(true);
      try {
        const { html, css, javascript, description } = await designAssistantInstance.generateWebDesign(prompt);

        // Combine generated code
        const combinedCode = `<html>\n${html}\n<style>\n${css}\n</style>\n<script>\n${javascript}\n</script>`;
        this.codeEditor.setValue(combinedCode);

        // Update chat context with assistant's response
        this.appendToChatContext("assistant", description);
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

      // Add the executed code to the chat context as a user message
      this.appendToChatContext("user", `Executing code:\n${code}`);

      // Target the iframe element by its ID
      const iframe = document.getElementById("outputIframe") as HTMLIFrameElement;
      if (!iframe) {
        throw new Error("Output iframe not found.");
      }

      const iframeDocument = iframe.contentDocument;
      if (!iframeDocument) {
        throw new Error("Unable to access the iframe's document.");
      }

      // Write the generated code into the iframe's document
      iframeDocument.open();
      iframeDocument.write(code);
      iframeDocument.close();

      // Capture console logs
      consoleWrapper.capture();
      const consoleOutput = consoleWrapper.getLogs();

      // Add logs to chat context
      this.appendToChatContext("assistant", `Execution result: ${consoleOutput}`);
    } catch (error: any) {
      this.appendToChatContext("assistant", `Error: ${error.message}`);
    } finally {
      consoleWrapper.restore();
    }
  }

  private appendToChatContext(role: "user" | "assistant", message: string): void {
    if (!this.chatContextElement) return;

    const messageElement = document.createElement("div");
    messageElement.className = `chat-message ${role}`;
    messageElement.textContent = message;

    this.chatContextElement.appendChild(messageElement);
    this.chatContextElement.scrollTop = this.chatContextElement.scrollHeight; // Auto-scroll to the latest message
  }

  private setLoading(loading: boolean) {
    const generateButton = document.querySelector(".generate-btn") as HTMLButtonElement;
    const executeButton = document.querySelector(".execute-btn") as HTMLButtonElement;

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
