import { Message } from "@aws-sdk/client-bedrock-runtime";
import { chatContext } from "../../chat-context";
import { ButtonSpinner } from "../ButtonSpinner/ButtonSpinner";
import { designAssistantInstance } from "../../design-assistant-bot";
import { CodeEditorComponent } from "../CodeEditor/CodeEditorComponent";
import { CsvUploader } from "../CsvUploader";
import { CSSManager } from "../../utils/css-manager";
import { chatStyles } from "./chat.styles";
import { dataStore } from "../../stores/AppStore";

interface ChatMessage {
  role: "user" | "assistant";
  message: string;
  timestamp: Date;
}

interface ChatDependencies {
  codeEditor: CodeEditorComponent;
  csvUploader: CsvUploader;
}

export class Chat {
  private codeEditor: CodeEditorComponent;
  private csvUploader: CsvUploader;
  private buttonSpinner?: ButtonSpinner;

  // DOM references
  private _promptInput: HTMLTextAreaElement;
  private _chatMessages: HTMLElement;
  private _button!: HTMLButtonElement;

  constructor(dependencies: ChatDependencies) {
    console.log("Initializing chat component");

    this.codeEditor = dependencies.codeEditor;
    this.csvUploader = dependencies.csvUploader;

    // Get DOM elements
    this._promptInput = document.querySelector(".prompt-input") as HTMLTextAreaElement;
    this._chatMessages = document.querySelector(".chat-messages") as HTMLElement;

    if (!this._promptInput || !this._chatMessages) {
      throw new Error("Required chat elements not found in DOM");
    }

    CSSManager.getInstance().addStyles("chat", chatStyles);

    this.csvUploader.setCallback((data) => {
      dataStore.setData(data);
    });

    this.setupButtonSpinner();
    this.setupEventListeners();

    // Set up chat context listener
    chatContext.onMessagesChange((messages) => {
      this.updateChatUI(messages);
    });
  }


  private setupButtonSpinner(): void {
    this.buttonSpinner = new ButtonSpinner();
    this._button = this.buttonSpinner.getElement();
  }

  private setupEventListeners(): void {
    this._button.addEventListener("click", this._handleGenerate);
    this._promptInput.addEventListener("keydown", this._handleKeyDown);

    console.log("Event listeners attached to:", {
      button: this._button,
      promptInput: this._promptInput
    });
  }

  private readonly _handleGenerate = (e: MouseEvent): void => {
    console.log("Generate handler called");
    e.preventDefault();

    if (!dataStore.isGenerating.value) {
      this.generateCodeWithRetry();
    }
  };

  private readonly _handleKeyDown = (e: KeyboardEvent): void => {
    console.log("Keydown handler called", e.key);

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      this._handleGenerate(e as unknown as MouseEvent);
    }
  };

  private async generateCodeWithRetry(retries = 1): Promise<void> {
    const prompt = this._promptInput.value.trim();
    console.log("Generating code with prompt:", prompt);

    if (!prompt || dataStore.isGenerating.value) {
      console.log("No prompt or already generating", {
        hasPrompt: !!prompt,
        isGenerating: dataStore.isGenerating.value,
      });
      return;
    }

    this.setLoading(true);
    dataStore.setError(null);

    try {
      const data = dataStore.getData();
      if (data) {
        chatContext.addUserMessage(this.getDataStructureDescription());
      }

      chatContext.addUserMessage(prompt);

      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const messages = chatContext.getTruncatedHistory();
          const response = await designAssistantInstance.generateWebDesign(messages);
          const { html, css, javascript, description } = response;

          if (html || css || javascript) {
            chatContext.addAssistantMessage(
              JSON.stringify({ html, css, javascript }),
              description
            );

            const fullCode = this.generateFullHtmlCode(html, css, javascript);
            dataStore.setCodeContent({ html, css, javascript, combinedCode: fullCode });

            this.codeEditor.updateCode({
              html,
              css,
              javascript,
              combinedCode: fullCode,
              data: dataStore.getData() || [],
            });

            this._promptInput.value = "";
            break;
          }
        } catch (error: any) {
          if (attempt === retries) throw error;
          chatContext.addAssistantMessage(`Attempt ${attempt + 1} failed: ${error.message}. Retrying...`, "Error");
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    } catch (error: any) {
      dataStore.setError(error.message);
      chatContext.addAssistantMessage(`Error generating design: ${error.message}`, "Error");
    } finally {
      this.setLoading(false);
    }
  }

  private getDataStructureDescription(): string {
    const data = dataStore.getData();
    if (!data?.length) return "";

    const sampleData = data[0];
    const structure = Object.entries(sampleData)
      .map(([key, value]) => `${key}: ${typeof value}`)
      .join(", ");

    return `\nAvailable data structure: { ${structure} }.\nData has ${data.length} records.`;
  }

  private updateChatUI(messages: Message[]): void {
    this._chatMessages.innerHTML = "";

    messages.forEach((message) => {
      if (message.role === "user") {
        message.content?.forEach((content) => {
          this.appendMessageToDOM({
            role: message.role || "user",
            message: content.text || "",
            timestamp: new Date(),
          });
        });
      } else {
        const description = message.content?.[1]?.text;
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

  private appendMessageToDOM(message: ChatMessage): void {
    const messageElement = document.createElement("div");
    messageElement.className = `chat-message ${message.role}`;
    messageElement.textContent = message.message;

    this._chatMessages.appendChild(messageElement);
    this._chatMessages.scrollTop = this._chatMessages.scrollHeight;
  }

  private setLoading(loading: boolean): void {
    dataStore.setGenerating(loading);
    this._promptInput.disabled = loading;
    if (this.buttonSpinner) {
      loading ? this.buttonSpinner.show() : this.buttonSpinner.hide();
    }
  }

  private generateFullHtmlCode(html: string, css: string, javascript: string): string {
    const data = dataStore.getData();
    return /*html*/ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
        const data = ${data ? JSON.stringify(data) : "[]"};
        window.data = data;
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

  protected cleanup(): void {
    console.log("Cleaning up chat component");

    this._button.removeEventListener("click", this._handleGenerate);
    this._promptInput.removeEventListener("keydown", this._handleKeyDown);

    if (this.buttonSpinner) {
      this.buttonSpinner.destroy();
    }

    CSSManager.getInstance().removeStyles("chat");
  }

  public destroy(): void {
    console.log("Cleaning up chat component");

    this._button.removeEventListener("click", this._handleGenerate);
    this._promptInput.removeEventListener("keydown", this._handleKeyDown);

    if (this.buttonSpinner) {
      this.buttonSpinner.destroy();
    }

    CSSManager.getInstance().removeStyles("chat");
  }
}
