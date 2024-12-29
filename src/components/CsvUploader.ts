// src/components/CsvUploader.ts
import { store } from "../stores/AppStore";
import { parseCSV } from "../utils/csvParser";
import { signal } from "@preact/signals-core";

export class CsvUploader {
  private fileInput: HTMLInputElement;
  private uploadButton: HTMLLabelElement;
  private uploadIcon: HTMLElement;
  private clearIcon: HTMLElement;
  private buttonText: HTMLElement;
  private hasData = signal<boolean>(false);

  constructor() {
    // Get DOM elements
    this.fileInput = document.querySelector("#csvFile") as HTMLInputElement;
    this.uploadButton = document.querySelector(
      ".file-button.upload"
    ) as HTMLLabelElement;
    this.uploadIcon = document.querySelector(".upload-icon") as HTMLElement;
    this.clearIcon = document.querySelector(".clear-icon") as HTMLElement;
    this.buttonText = document.querySelector(
      ".file-button.upload .button-text"
    ) as HTMLElement;

    if (
      !this.fileInput ||
      !this.uploadButton ||
      !this.uploadIcon ||
      !this.clearIcon ||
      !this.buttonText
    ) {
      throw new Error("Required CSV uploader elements not found");
    }

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.fileInput.addEventListener("change", this.handleFileUpload);
    this.uploadButton.addEventListener("click", this.handleButtonClick);
  }

  private handleButtonClick = (e: MouseEvent) => {
    if (this.hasData.value) {
      e.preventDefault();
      this.handleClearData();
    }
  };

  private handleFileUpload = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = parseCSV(text);

        // Update dataStore directly
        store.setData(data);

        this.updateUIState(true);
        console.log("CSV data loaded:", data);
      } catch (error) {
        console.error("Error parsing CSV:", error);
        alert("Error parsing CSV file");
      }
    };

    reader.readAsText(file);
  };

  private handleClearData = () => {
    store.clear();
    this.updateUIState(false);
    this.fileInput.value = "";
  };

  private updateUIState(hasData: boolean): void {
    this.hasData.value = hasData;
    this.uploadIcon.classList.toggle("hidden", hasData);
    this.clearIcon.classList.toggle("hidden", !hasData);
    this.buttonText.textContent = hasData ? "Clear CSV" : "Upload CSV";
    this.fileInput.style.display = hasData ? "none" : "block";
  }

  public destroy(): void {
    this.fileInput.removeEventListener("change", this.handleFileUpload);
    this.uploadButton.removeEventListener("click", this.handleButtonClick);
  }
}
