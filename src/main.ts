import { Notebook } from './notebook';

document.addEventListener('DOMContentLoaded', () => {
  // Ensure the 'notebook' container exists
  const notebookContainer = document.getElementById('notebook');
  if (!notebookContainer) {
    console.error("Notebook container with ID 'notebook' not found.");
    return;
  }

  // Initialize the Notebook
  new Notebook('notebook');
});
