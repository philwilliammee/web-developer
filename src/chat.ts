import { chatContext } from "./chat-context";
import { ButtonSpinner } from "./components/ButtonSpinner";
import { MonacoEditor } from "./components/MonacoEditor";
import { designAssistantInstance } from "./design-assistant-bot";
import { signal } from '@preact/signals-core';

interface ChatMessage {
  role: "user" | "assistant";
  message: string;
  timestamp: Date;
}

export class Chat {
  private container: HTMLElement | null;
  private chatMessages: HTMLElement;
  private promptInput: HTMLTextAreaElement | null;
  private buttonSpinner: ButtonSpinner | null = null;
  private codeEditor: MonacoEditor | null = null;

  // Signals for state management
  private isGenerating = signal<boolean>(false);
  private messages = signal<ChatMessage[]>([]);
  private error = signal<string | null>(null);

  public element: HTMLElement;

  constructor(containerId: string, codeEditor: MonacoEditor) {
    this.container = document.getElementById(containerId);

    if (!this.container) {
      throw new Error(`Container with ID ${containerId} not found.`);
    }

    this.codeEditor = codeEditor;

    this.element = this.createElement();
    this.container.appendChild(this.element);

    this.chatMessages = this.element.querySelector(".chat-messages") as HTMLElement;
    this.promptInput = this.element.querySelector(".prompt-input") as HTMLTextAreaElement;
    const generateButton = this.element.querySelector(".generate-btn") as HTMLButtonElement;

    this.buttonSpinner = new ButtonSpinner(generateButton);

    this.setupEventListeners();
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

// chat.ts
private async generateCodeWithRetry(retries = 1): Promise<void> {
  const prompt = this.promptInput?.value.trim();
  if (!prompt || this.isGenerating.value) return;

  this.setLoading(true);
  this.error.value = null;

  // Add user message to context
  chatContext.addUserMessage(prompt);

  try {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Send just the prompt instead of messages
        const response = await designAssistantInstance.generateWebDesign(prompt);
        const { html, css, javascript, description } = response;
        const hasWebDesign = html || css || javascript;

        // Add assistant response to context
        chatContext.addAssistantMessage(
          JSON.stringify({ html, css, javascript }),
          description
        );

        if (this.codeEditor && hasWebDesign) {
          const combinedCode = `<html>\n${html}\n<style>\n${css}\n</style>\n<script>\n${javascript}\n</script>`;
          this.codeEditor.setValue(combinedCode);
          this.updateEditorView();
        }

        // Update UI
        this.addMessage("user", prompt);
        this.addMessage("assistant", description);

        if (this.promptInput) {
          this.promptInput.value = "";
        }
        break;
      } catch (error) {
        if (attempt === retries) throw error;
        const typedError = error as Error;
        // Add error message to context as user message
        const errorMessage = `Attempt ${attempt + 1} failed: ${typedError.message}. Retrying...`;
        chatContext.addUserMessage(errorMessage);

        this.addMessage("assistant", errorMessage);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  } catch (error: any) {
    this.error.value = error.message;
    const errorMessage = `Error generating design: ${error.message}`;
    chatContext.addUserMessage(errorMessage);
    this.addMessage("assistant", errorMessage);
  } finally {
    this.setLoading(false);
  }
}

  private addMessage(role: "user" | "assistant", message: string): void {
    const newMessage: ChatMessage = {
      role,
      message,
      timestamp: new Date()
    };

    this.messages.value = [...this.messages.value, newMessage];
    this.appendMessageToDOM(newMessage);
  }

  private appendMessageToDOM(message: ChatMessage): void {
    const messageElement = document.createElement("div");
    messageElement.className = `chat-message ${message.role}`;
    messageElement.textContent = message.message;

    this.chatMessages.appendChild(messageElement);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  private updateEditorView(): void {
    const codeTab = document.getElementById('codeTab') as HTMLElement;
    const viewTab = document.getElementById('viewTab') as HTMLElement;
    const codeEditorContainer = document.getElementById('codeEditor') as HTMLElement;
    const iframeContainer = document.getElementById('iframeContainer') as HTMLElement;

    if (codeTab && viewTab && codeEditorContainer && iframeContainer) {
      codeTab.classList.add('active');
      viewTab.classList.remove('active');
      codeEditorContainer.style.display = 'block';
      iframeContainer.style.display = 'none';

      this.codeEditor?.layout();
    }
  }

  private setLoading(loading: boolean): void {
    this.isGenerating.value = loading;

    const generateButton = this.element.querySelector(".generate-btn") as HTMLButtonElement;
    generateButton.disabled = loading;
    this.promptInput && (this.promptInput.disabled = loading);

    loading ? this.buttonSpinner?.show() : this.buttonSpinner?.hide();
  }

  private handleSubmit = (event: Event) => {
    event.preventDefault();
    this.generateCodeWithRetry();
  };

  private handleKeyDown = (event: Event) => {
    const keyEvent = event as KeyboardEvent;
    if (keyEvent.key === "Enter" && !keyEvent.shiftKey) {
      event.preventDefault();
      this.generateCodeWithRetry();
    }
  };

  private setupEventListeners(): void {
    const form = this.element.querySelector(".prompt-form") as HTMLFormElement;
    if (form) {
      form.addEventListener("submit", this.handleSubmit as EventListener);
    }

    this.promptInput?.addEventListener("keydown", this.handleKeyDown as EventListener);
  }

  public destroy(): void {
    const form = this.element.querySelector(".prompt-form");
    form?.removeEventListener("submit", this.handleSubmit as EventListener);
    this.promptInput?.removeEventListener("keydown", this.handleKeyDown as EventListener);

    this.buttonSpinner?.destroy?.();
    this.element.remove();
  }

}
