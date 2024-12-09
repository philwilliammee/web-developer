import { ButtonSpinner } from "./components/ButtonSpinner";
import { MonacoEditor } from "./components/MonacoEditor";
import { designAssistantInstance } from "./design-assistant-bot";

export class Chat {
  private container: HTMLElement | null;
  private chatMessages: HTMLElement;
  private promptInput: HTMLTextAreaElement | null;
  private buttonSpinner: ButtonSpinner | null = null;
  private isGenerating: boolean = false;
  private codeEditor: MonacoEditor | null = null;

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

  private setupEventListeners(): void {
    const form = this.element.querySelector(".prompt-form") as HTMLFormElement;
    if (form) {
      form.addEventListener("submit", (event: SubmitEvent) => {
        event.preventDefault();
        this.generateCode();
      });
    }

    this.promptInput?.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        this.generateCode();
      }
    });
  }

  private async generateCode(): Promise<void> {
    const prompt = this.promptInput?.value.trim();
    if (prompt && !this.isGenerating) {
      this.setLoading(true);

      try {
        const { html, css, javascript, description } = await designAssistantInstance.generateWebDesign(prompt);
        const hasWebDesign = html || css || javascript;

        // Update the code editor if there is content
        if (this.codeEditor && hasWebDesign) {
          const combinedCode = `<html>\n${html}\n<style>\n${css}\n</style>\n<script>\n${javascript}\n</script>`;
          this.codeEditor.setValue(combinedCode);

          // Toggle to Code Editor tab
          const codeTab = document.getElementById('codeTab') as HTMLElement;
          const viewTab = document.getElementById('viewTab') as HTMLElement;
          const codeEditorContainer = document.getElementById('codeEditor') as HTMLElement;
          const iframeContainer = document.getElementById('iframeContainer') as HTMLElement;

          if (codeTab && viewTab && codeEditorContainer && iframeContainer) {
            codeTab.classList.add('active');
            viewTab.classList.remove('active');
            codeEditorContainer.style.display = 'block';
            iframeContainer.style.display = 'none';

            // Ensure the Monaco editor layout is updated
            this.codeEditor.layout();
          }
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

  private appendToChatContext(role: "user" | "assistant", message: string): void {
    const messageElement = document.createElement("div");
    messageElement.className = `chat-message ${role}`;
    messageElement.textContent = message;

    this.chatMessages.appendChild(messageElement);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  private setLoading(loading: boolean): void {
    this.isGenerating = loading;

    const generateButton = this.element.querySelector(".generate-btn") as HTMLButtonElement;

    generateButton.disabled = loading;
    this.promptInput && (this.promptInput.disabled = loading);

    loading ? this.buttonSpinner?.show() : this.buttonSpinner?.hide();
  }
}
