import { Cell } from './cell';

export class Notebook {
  private container: HTMLElement | null;
  private cell: Cell | null = null; // Single cell instance

  constructor(containerId: string) {
    this.container = document.getElementById(containerId);

    this.addSingleCell();
  }

  private addSingleCell(): void {
    if (this.container) {
      this.cell = new Cell("<h1>Write your HTML, CSS, and JavaScript code here...</h1>");
      this.container.appendChild(this.cell.element);
    }
  }
}
