// src/FileControls/fileControls.styles.ts
export const fileControlsStyles = /*css*/ `
  /*
  .file-controls {
    position: fixed;
    bottom: 1px;
    z-index: 1000;
    display: flex;
    gap: 10px;
    background: white;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
    */

  .file-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
    color: #374151;
  }

  .file-button:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }

  .file-button:active {
    background: #f3f4f6;
  }

  .file-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .file-button svg {
    width: 20px;
    height: 20px;
  }

  /* Button variants */
  .file-button.upload {
    color: var(--primary-color);
    border-color: var(--primary-color);
  }

  .file-button.upload:hover {
    background: rgba(59, 130, 246, 0.05);
  }

  .file-button.clear {
    color: var(--danger-color);
    border-color: var(--danger-color);
  }

  .file-button.clear:hover {
    background: rgba(239, 68, 68, 0.05);
  }

  .file-button.download {
    color: var(--success-color);
    border-color: var(--success-color);
  }

  .file-button.download:hover {
    background: rgba(34, 197, 94, 0.05);
  }

  /* File input styling */
  .file-input {
    display: none;
  }

  .file-button.upload {
    cursor: pointer;
}


  /* File label styling */
  .file-label {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--primary-color);
    color: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
  }

  .file-label:hover {
    background: #2563eb;
  }

  /* Data preview */
  .data-preview {
    position: fixed;
    bottom: 70px;
    right: 20px;
    max-width: 300px;
    max-height: 200px;
    overflow: auto;
    background: white;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    font-family: monospace;
    font-size: 12px;
    display: none;
    z-index: 1000;
  }

  .data-preview.show {
    display: block;
  }

  /* Loading state */
  .file-button.loading {
    position: relative;
    color: transparent !important;
    pointer-events: none;
  }

  .file-button.loading::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-top-color: currentColor;
    border-radius: 50%;
    animation: button-spin 0.6s linear infinite;
  }

  /* Tooltips */
  .file-button[data-tooltip] {
    position: relative;
  }

  .file-button[data-tooltip]::before {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.25rem 0.5rem;
    background: #374151;
    color: white;
    font-size: 12px;
    border-radius: 4px;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
  }

  .file-button[data-tooltip]:hover::before {
    opacity: 1;
    visibility: visible;
  }

  /* Progress indicator */
  .upload-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    background: var(--primary-color);
    transition: width 0.2s ease;
  }



  /* Mobile styles */
  @media (max-width: 768px) {
    .file-controls {
      flex-wrap: wrap;
      justify-content: center;
      bottom: 0;
      left: 0;
      right: 0;
      border-radius: 0;
      border-top: 1px solid #e5e7eb;
    }

    .file-button {
      padding: 0.375rem 0.75rem;
      font-size: 12px;
    }

    .file-button svg {
      width: 16px;
      height: 16px;
    }

    .data-preview {
      bottom: 60px;
      left: 20px;
      right: 20px;
      max-width: none;
    }
  }

  /* Animations */
  @keyframes button-spin {
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .file-controls {
      background: #1f2937;
      border-color: #374151;
    }

    .file-button {
      background: #374151;
      border-color: #4b5563;
      color: #e5e7eb;
    }

    .file-button:hover {
      background: #4b5563;
    }

    .data-preview {
      background: #1f2937;
      color: #e5e7eb;
    }
  }
`;
