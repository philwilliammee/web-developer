// CsvUploader.ts
import { parseCSV } from "../utils/csvParser";

interface CsvUploaderOptions {
  onDataLoad?: (data: any[]) => void;
}
export class CsvUploader {
  container: HTMLElement;
  private dataPreview!: HTMLElement;
  private options: CsvUploaderOptions;


  constructor(container: HTMLElement, options: CsvUploaderOptions = {}) {
    this.container = container;
    this.options = options;
    this.createUploader();
    this.createDataPreview();
  }

  setCallback(callback: CsvUploaderOptions['onDataLoad']) {
    this.options.onDataLoad = callback;
  }

  private createUploader() {
    const uploadSection = document.createElement("div");
    uploadSection.className = "upload-section";
    uploadSection.innerHTML = `
      <label for="csvFile" class="file-label">Upload CSV</label>
      <input type="file" id="csvFile" accept=".csv" class="file-input">
    `;

    this.container.appendChild(uploadSection);
    this.setupEventListeners();
  }

  private createDataPreview() {
    this.dataPreview = document.createElement("div");
    this.dataPreview.id = "dataPreview";
    document.body.appendChild(this.dataPreview);
  }

  private setupEventListeners() {
    const fileInput = this.container.querySelector(
      "#csvFile"
    ) as HTMLInputElement;
    fileInput?.addEventListener("change", this.handleFileUpload.bind(this));
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

        // Set window data
        (window as any).data = data;

        // Update preview
        this.dataPreview.textContent = JSON.stringify(data, null, 2);
        this.dataPreview.style.display = 'block';

        // Call callback if provided
        this.options.onDataLoad?.(data);

        console.log('CSV data loaded:', data);
      } catch (error) {
        console.error('Error parsing CSV:', error);
        alert('Error parsing CSV file');
      }
    };

    reader.readAsText(file);
  }

  public destroy() {
    const fileInput = this.container.querySelector("#csvFile");
    fileInput?.removeEventListener("change", this.handleFileUpload.bind(this));
    this.dataPreview.remove();
  }
}
