import { Chat } from "./chat";
import { MonacoEditor } from "./components/MonacoEditor";
import { ConsoleWrapper } from "./console-wrapper";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Chat in the left column
  const chatContainer = document.getElementById("chat");
  if (!chatContainer) {
    console.error("Chat container with ID 'chat' not found.");
    return;
  }

  // Get elements for tabs and containers
  const viewTab = document.getElementById("viewTab");
  const codeTab = document.getElementById("codeTab");
  const iframeContainer = document.getElementById(
    "iframeContainer"
  ) as HTMLElement;
  const codeEditorContainer = document.getElementById(
    "codeEditor"
  ) as HTMLElement;
  const executeButton = document.querySelector(
    ".execute-btn"
  ) as HTMLButtonElement;

  // Initialize MonacoEditor
  const initialCode = `
<h1>Hello, World!</h1>
<style>
  h1 {
    color: red;
  }
</style>
<script>
  console.log("Hello, World!");
</script>
        `;
  const monacoEditor = new MonacoEditor(
    codeEditorContainer,
    initialCode,
    (value: string) => {
      console.log("Editor content updated:", value);
    }
  );
  new Chat("chat", monacoEditor);

  if (
    !viewTab ||
    !codeTab ||
    !iframeContainer ||
    !codeEditorContainer ||
    !executeButton
  ) {
    console.error("One or more required elements are missing.");
    return;
  }

  // Function to toggle tabs
  function toggleTab(
    activeTab: HTMLElement,
    inactiveTab: HTMLElement,
    showElement: HTMLElement,
    hideElement: HTMLElement
  ) {
    activeTab.classList.add("active");
    inactiveTab.classList.remove("active");
    showElement.style.display = "block";
    hideElement.style.display = "none";
  }

  // Set the initial active tab to the code editor tab.
  toggleTab(codeTab, viewTab, codeEditorContainer, iframeContainer);

  // Tab switching logic
  viewTab.addEventListener("click", () => {
    toggleTab(viewTab, codeTab, iframeContainer, codeEditorContainer);
  });

  codeTab.addEventListener("click", () => {
    toggleTab(codeTab, viewTab, codeEditorContainer, iframeContainer);
    monacoEditor.layout(); // Ensure the editor layout is updated when shown
  });

  // Execute button functionality
  executeButton.addEventListener("click", async () => {
    const consoleWrapper = new ConsoleWrapper();
    try {
      const code = monacoEditor.getValue();

      // Replace the iframe to reset its context
      const oldIframe = document.getElementById(
        "outputIframe"
      ) as HTMLIFrameElement;
      const newIframe = document.createElement("iframe");
      newIframe.id = "outputIframe";
      newIframe.sandbox.value = "allow-scripts allow-same-origin allow-modals";
      newIframe.style.width = iframeContainer.style.width;
      newIframe.style.height = iframeContainer.style.height;

      oldIframe.parentElement?.replaceChild(newIframe, oldIframe);

      const iframeDocument = newIframe.contentWindow?.document;
      if (!iframeDocument) {
        throw new Error("Unable to access the iframe's document");
      }

      iframeDocument.open();
      iframeDocument.write(code);
      iframeDocument.close();

      consoleWrapper.capture();
      console.log("Code executed successfully");
      const consoleOutput = consoleWrapper.getLogs();

      // @todo do something with this information
      console.log("assistant", `Code executed successfully\n${consoleOutput}`);

      // Toggle to Preview tab after execution
      toggleTab(viewTab, codeTab, iframeContainer, codeEditorContainer);
    } catch (error: any) {
      console.log("assistant", `Error: ${error.message}`);
    } finally {
      consoleWrapper.restore();
    }
  });
});
