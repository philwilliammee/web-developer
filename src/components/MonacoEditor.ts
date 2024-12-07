import * as monaco from "monaco-editor";
// Import the worker scripts
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import HtmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";

export class MonacoEditor {
  private editor: monaco.editor.IStandaloneCodeEditor | null = null;
  private container: HTMLElement;
  private value: string;
  private onChange: (value: string) => void;

  constructor(
    container: HTMLElement,
    initialValue: string = "",
    onChange: (value: string) => void
  ) {
    this.container = container;
    this.value = initialValue;
    this.onChange = onChange;

    this.initMonacoEnvironment();
    this.init();
  }

  private initMonacoEnvironment() {
    // Configure Monaco Environment to use the imported workers
    (self as any).MonacoEnvironment = {
      getWorker: function (_: any, label: string) {
        if (label === "html") {
          return new HtmlWorker();
        }
        return new EditorWorker();
      },
    };
  }

  private init() {
    // Configure HTML language defaults
    monaco.languages.html.htmlDefaults.setOptions({
      format: {
        tabSize: 2,
        insertSpaces: true,
        wrapLineLength: 120,
        unformatted: "wbr",
        contentUnformatted: "pre,code,textarea",
        indentInnerHtml: true,
        preserveNewLines: true,
        maxPreserveNewLines: undefined,
        indentHandlebars: false,
        endWithNewline: false,
        extraLiners: "head, body, /html",
        wrapAttributes: "auto",
      },
      suggest: {
        html5: true,
        css: true,
        javascript: true,
      },
    });

    this.editor = monaco.editor.create(this.container, {
      value: this.value,
      language: "html", // Set to HTML
      theme: "vs-light", // You can switch to 'vs-dark' if needed
      automaticLayout: true,
      minimap: {
        enabled: false,
      },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: "on",
      renderLineHighlight: "all",
      padding: {
        top: 10,
        bottom: 10,
      },
      suggest: {
        showClasses: true,
        showFunctions: true,
        showVariables: true,
        showModules: true,
        showKeywords: true,
      },
    });

    this.editor.onDidChangeModelContent(() => {
      this.value = this.editor?.getValue() || "";
      this.onChange(this.value);
    });
  }

  public getValue(): string {
    return this.editor?.getValue() || this.value;
  }

  public setValue(value: string) {
    if (this.editor) {
      this.editor.setValue(value);
    }
    this.value = value;
  }

  public dispose() {
    if (this.editor) {
      this.editor.dispose();
    }
  }

  public layout() {
    if (this.editor) {
      this.editor.layout();
    }
  }
}
