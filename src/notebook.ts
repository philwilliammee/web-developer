import { Cell } from './cell';

export class Notebook {
  private container: HTMLElement | null;
  private cell: Cell | null = null; // Single cell instance
  private files: Map<string, any>; // Shared file store

  constructor(containerId: string) {
    this.container = document.getElementById(containerId);
    this.files = new Map(); // Initialize file store

    this.setupEventListeners();
    this.addSingleCell();
  }

  private setupEventListeners(): void {
    const closeChartButton = document.getElementById('closeChart');
    const chartContainer = document.getElementById('myChartContainer');
    const chartElement = document.getElementById('myChart');

    if (closeChartButton && chartContainer && chartElement) {
      closeChartButton.addEventListener('click', () => {
        // Clear the chart content
        chartElement.innerHTML = "";

        // Optionally hide the container
        // chartContainer.style.display = "none";
      });
    }
  }

  private addSingleCell(): void {
    if (this.container) {
      this.cell = new Cell(1, this, "// Write your code here...");
      this.container.appendChild(this.cell.element);
    }
  }

  public executeCode(): void {
    if (this.cell) {
      this.cell.executeCode();
    }
  }

  // File management methods
  public addFile(name: string, data: any): void {
    this.files.set(name, data);
  }

  public getFile(name: string): any | undefined {
    return this.files.get(name);
  }

  public listFiles(): string[] {
    return Array.from(this.files.keys());
  }
}
