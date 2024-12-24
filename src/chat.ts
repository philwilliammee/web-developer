import { Message } from "@aws-sdk/client-bedrock-runtime";
import { chatContext } from "./chat-context";
import { ButtonSpinner } from "./components/ButtonSpinner";
import { MonacoEditor } from "./components/MonacoEditor";
import { designAssistantInstance } from "./design-assistant-bot";
import { signal } from "@preact/signals-core";
import { CodeDownloader } from "./components/CodeDownloader";
import { CsvUploader } from "./components/CsvUploader";

interface ChatMessage {
  role: "user" | "assistant";
  message: string;
  timestamp: Date;
}

interface ChatDependencies {
  editor: MonacoEditor;
  csvUploader: CsvUploader;
  codeDownloader: CodeDownloader;
}

export class Chat {
  private container: HTMLElement | null;
  private chatMessages: HTMLElement;
  private promptInput: HTMLTextAreaElement | null;
  private buttonSpinner: ButtonSpinner | null = null;
  private codeEditor: MonacoEditor | null = null;
  private csvUploader: CsvUploader;
  private codeDownloader: CodeDownloader;
  private csvData: any[] | null = null;

  // Signals for state management
  private isGenerating = signal<boolean>(false);
  // private messages = signal<ChatMessage[]>([]);
  private error = signal<string | null>(null);

  public element: HTMLElement;

  constructor(containerId: string, dependencies: ChatDependencies) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Container with ID ${containerId} not found.`);
    }

    this.codeEditor = dependencies.editor;
    this.csvUploader = dependencies.csvUploader;
    this.codeDownloader = dependencies.codeDownloader;

    // Set up the callback on the existing CSV uploader
    this.csvUploader.setCallback((data) => {
      this.updateDataContext(data);
    });

    this.element = this.createElement();
    this.container.appendChild(this.element);

    this.chatMessages = this.element.querySelector(
      ".chat-messages"
    ) as HTMLElement;
    this.promptInput = this.element.querySelector(
      ".prompt-input"
    ) as HTMLTextAreaElement;
    const generateButton = this.element.querySelector(
      ".generate-btn"
    ) as HTMLButtonElement;

    this.buttonSpinner = new ButtonSpinner(generateButton);

    this.setupEventListeners();


    // Listen for CSV data updates
    window.addEventListener("csvDataLoaded", ((event: CustomEvent) => {
      this.updateDataContext(event.detail.data);
    }) as EventListener);

    // Subscribe to chat context changes
    chatContext.onMessagesChange((messages) => {
      this.updateChatUI(messages);
    });
  }

  private updateChatUI(messages: Message[]) {
    // Clear existing messages
    this.chatMessages.innerHTML = "";

    // Add each message to DOM
    messages.forEach((message) => {
      if (message.role === "user") {
        // For user messages, show all content
        message.content?.forEach((content) => {
          this.appendMessageToDOM({
            role: message.role || "user",
            message: content.text || "",
            timestamp: new Date(),
          });
        });
      } else {
        // For assistant messages, only show the description (second content item)
        const description = message.content?.[1]?.text; // Safe access with optional chaining
        if (description) {
          this.appendMessageToDOM({
            role: message.role || "assistant",
            message: description,
            timestamp: new Date(),
          });
        }
      }
    });
  }

  private createElement(): HTMLElement {
    const chatElement = document.createElement("div");
    chatElement.className = "chat";

    chatElement.innerHTML = `
      <div class="chat-section">
        <div class="chat-messages"></div>
        <form class="prompt-form">
          <textarea class="prompt-input" placeholder="Enter your prompt..." rows="5" cols="33"></textarea>
          <div class="prompt-actions">
            <button type="submit" class="btn btn-green generate-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="21 12 9 18 9 6 21 12"></polygon>
              </svg>
            </button>
          </div>
        </form>
      </div>
    `;

    return chatElement;
  }

  public updateDataContext(data: any[] | null) {
    this.csvData = data;
    console.log("Chat data context updated:", this.csvData);
  }

  private getDataStructureDescription(): string {
    if (!this.csvData || this.csvData.length === 0) return "";

    const sampleData = this.csvData[0];
    const structure = Object.entries(sampleData)
      .map(([key, value]) => `${key}: ${typeof value}`)
      .join(", ");

    return `\nAvailable data structure: { ${structure} }.\nData has ${this.csvData.length} records.`;
  }

  private async generateCodeWithRetry(retries = 1): Promise<void> {
    const prompt = this.promptInput?.value.trim();
    if (!prompt || this.isGenerating.value) return;

    // Add data context to prompt if available
    const fullPrompt = this.csvData
      ? `${prompt}\n\nNote: You have access to window.data which contains: ${this.getDataStructureDescription()}\nUse 'window.data' to access this data in your JavaScript code.`
      : prompt;

    this.setLoading(true);
    this.error.value = null;

    // Add user message to context
    chatContext.addUserMessage(fullPrompt);

    try {
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const messages = chatContext.getTruncatedHistory();
          const response = await designAssistantInstance.generateWebDesign(
            messages
          );

          const { html, css, javascript, description } = response;
          const hasWebDesign = html || css || javascript;

          chatContext.addAssistantMessage(
            JSON.stringify({ html, css, javascript }),
            description
          );

          if (this.codeEditor && hasWebDesign) {
            // Use the new method to generate full HTML
            const fullCode = this.generateFullHtmlCode(html, css, javascript);
            this.codeEditor.setValue(fullCode);
            this.updateEditorView();
          }

          if (this.promptInput) {
            this.promptInput.value = "";
          }
          break;
        } catch (error: any) {
          if (attempt === retries) throw error;
          const errorMessage = `Attempt ${attempt + 1} failed: ${
            error.message
          }. Retrying...`;
          chatContext.addAssistantMessage(errorMessage, "Error");
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    } catch (error: any) {
      this.error.value = error.message;
      chatContext.addAssistantMessage(
        `Error generating design: ${error.message}`,
        "Error"
      );
    } finally {
      this.setLoading(false);
    }
  }

  private appendMessageToDOM(message: ChatMessage): void {
    const messageElement = document.createElement("div");
    messageElement.className = `chat-message ${message.role}`;
    messageElement.textContent = message.message;

    this.chatMessages.appendChild(messageElement);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  private updateEditorView(): void {
    const codeTab = document.getElementById("codeTab") as HTMLElement;
    const viewTab = document.getElementById("viewTab") as HTMLElement;
    const codeEditorContainer = document.getElementById(
      "codeEditor"
    ) as HTMLElement;
    const iframeContainer = document.getElementById(
      "iframeContainer"
    ) as HTMLElement;

    if (codeTab && viewTab && codeEditorContainer && iframeContainer) {
      codeTab.classList.add("active");
      viewTab.classList.remove("active");
      codeEditorContainer.style.display = "block";
      iframeContainer.style.display = "none";

      this.codeEditor?.layout();
    }
  }

  private setLoading(loading: boolean): void {
    this.isGenerating.value = loading;

    const generateButton = this.element.querySelector(
      ".generate-btn"
    ) as HTMLButtonElement;
    generateButton.disabled = loading;
    this.promptInput && (this.promptInput.disabled = loading);

    loading ? this.buttonSpinner?.show() : this.buttonSpinner?.hide();
  }

  // private handleSubmit = (event: Event) => {
  //   event.preventDefault();
  //   this.generateCodeWithRetry();
  // };

  // private handleKeyDown = (event: Event) => {
  //   const keyEvent = event as KeyboardEvent;
  //   if (keyEvent.key === "Enter" && !keyEvent.shiftKey) {
  //     event.preventDefault();
  //     this.generateCodeWithRetry();
  //   }
  // };

  private setupEventListeners(): void {
    const form = this.element.querySelector(".prompt-form") as HTMLFormElement;
    if (form) {
      // Use explicit function to handle form submission
      const formSubmitHandler = (e: Event) => {
        e.preventDefault();
        this.generateCodeWithRetry();
      };

      form.addEventListener("submit", formSubmitHandler);

      // Store the handler for cleanup
      this._formSubmitHandler = formSubmitHandler;
    }

    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.generateCodeWithRetry();
      }
    };

    this.promptInput?.addEventListener("keydown", keyDownHandler);
    // Store the handler for cleanup
    this._keyDownHandler = keyDownHandler;
  }

  // Add class properties for event handlers
  private _formSubmitHandler?: (e: Event) => void;
  private _keyDownHandler?: (e: KeyboardEvent) => void;

  private generateFullHtmlCode(
    html: string,
    css: string,
    javascript: string
  ): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Pre-loaded libraries -->
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <style>
    body {
      margin: 0;
      font-family: system-ui, -apple-system, sans-serif;
    }
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    (function() {
      try {
        // Make data available to visualization
        window.data = ${this.csvData ? JSON.stringify(this.csvData) : "[]"};
        // Your visualization code
        ${javascript}
      } catch (error) {
        console.error('Error in visualization:', error);
        document.body.innerHTML += '<div style="color: red; padding: 1rem;">Error: ' + error.message + '</div>';
      }
    })();
  </script>
</body>
</html>`;
  }

public destroy(): void {
  const form = this.element.querySelector(".prompt-form");
  if (form && this._formSubmitHandler) {
    form.removeEventListener("submit", this._formSubmitHandler);
  }

  if (this.promptInput && this._keyDownHandler) {
    this.promptInput.removeEventListener("keydown", this._keyDownHandler);
  }

  this.buttonSpinner?.destroy?.();
  this.element.remove();

  // Remove event listener
  window.removeEventListener("csvDataLoaded", ((event: CustomEvent) => {
    this.updateDataContext(event.detail.data);
  }) as EventListener);
}
}
