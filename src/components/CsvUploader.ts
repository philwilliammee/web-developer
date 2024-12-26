// CsvUploader.ts
import { dataStore } from "../stores/AppStore";
import { parseCSV } from "../utils/csvParser";
import { fileControlsState } from "./FileControls/file-controls.state";

interface CsvUploaderOptions {
  onDataLoad?: (data: any[] | null) => void
}

export class CsvUploader {
  private container: HTMLElement;
  private uploadSection!: HTMLElement;
  private options: CsvUploaderOptions;

  constructor(container: HTMLElement, options: CsvUploaderOptions = {}) {
    this.container = container;
    this.options = options;
    this.createUploader();
  }

  private createUploader() {
    this.uploadSection = document.createElement("div");
    this.uploadSection.className = "upload-section";
    this.updateButton();

    this.container.appendChild(this.uploadSection);
    this.setupEventListeners();
  }

  private updateButton() {
    const hasData = fileControlsState.hasCSVData.value;
    this.uploadSection.innerHTML = `
      <label for="csvFile" class="file-button ${hasData ? "clear" : "upload"}">
        ${hasData ? fileControlsState.buttonIcons.clear : fileControlsState.buttonIcons.upload}
        <span>${hasData ? "Clear CSV" : "Upload CSV"}</span>
        ${!hasData ? '<input type="file" id="csvFile" accept=".csv" class="file-input">' : ""}
      </label>
    `;
  }

  private setupEventListeners() {
    if (fileControlsState.hasCSVData.value) {
      const label = this.uploadSection.querySelector(".file-button");
      label?.addEventListener("click", this.handleClearData.bind(this));
    } else {
      const fileInput = this.uploadSection.querySelector("#csvFile") as HTMLInputElement;
      fileInput?.addEventListener("change", this.handleFileUpload.bind(this));
    }
  }

  private handleClearData() {
    dataStore.clear();
    fileControlsState.hasCSVData.value = false;
    this.updateButton();
    this.setupEventListeners();
    this.options.onDataLoad?.(null);
  }

  private handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = parseCSV(text);

        // Update data store
        dataStore.setData(data);

        // Call callback if provided
        this.options.onDataLoad?.(data);

        fileControlsState.hasCSVData.value = true;
        this.updateButton();
        this.setupEventListeners();

        console.log("CSV data loaded:", data);
      } catch (error) {
        console.error("Error parsing CSV:", error);
        alert("Error parsing CSV file");
      }
    };

    reader.readAsText(file);
  }

  public destroy() {
    const clearButton = this.uploadSection.querySelector(".file-button");
    const fileInput = this.uploadSection.querySelector("#csvFile");

    if (fileControlsState.hasCSVData.value) {
      clearButton?.removeEventListener("click", this.handleClearData);
    } else {
      fileInput?.removeEventListener("change", this.handleFileUpload);
    }

    this.uploadSection.remove();
  }

  public setCallback(callback: CsvUploaderOptions["onDataLoad"]) {
    this.options.onDataLoad = callback;
  }
}
