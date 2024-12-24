// components/CodeEditor/codeEditor.styles.ts
export const codeEditorStyles = /*css*/ `
  .code-editor-component {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    background: white;
  }

  .editor-tabs {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem;
    background: #f5f5f5;
    border-bottom: 1px solid #ddd;
  }

  .editor-tab {
    padding: 0.5rem 1rem;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 4px;
    font-size: 14px;
    color: #4b5563;
    transition: all 0.2s ease;
  }

  .editor-tab:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .editor-tab.active {
    background: #fff;
    color: var(--primary-color);
    font-weight: 500;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  #htmlEditor,
  #cssEditor,
  #javascriptEditor,
  #combinedEditor,
  #dataEditor {
    height: calc(100% - 48px);
    overflow: hidden;
  }

  .editor-container {
    flex: 1;
    position: relative;
    overflow: hidden;
  }

  .monaco-editor {
    width: 100%;
    height: 100%;
  }

  .monaco-editor .overflow-guard {
    border-radius: 4px;
  }

  /* Editor specific themes */
  .html-editor .monaco-editor {
    background-color: #fff5f5;
  }

  .css-editor .monaco-editor {
    background-color: #f5f5ff;
  }

  .js-editor .monaco-editor {
    background-color: #fffbf5;
  }

  .data-editor .monaco-editor {
    background-color: #f5fff5;
  }

  /* Loading state */
  .editor-loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  .editor-loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  /* Error state */
  .editor-error {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
    padding: 0.75rem;
    background: #fee2e2;
    border: 1px solid #ef4444;
    border-radius: 4px;
    color: #dc2626;
    font-size: 0.875rem;
    z-index: 20;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .editor-tabs {
      flex-wrap: wrap;
    }

    .editor-tab {
      flex: 1;
      min-width: 100px;
      text-align: center;
      font-size: 12px;
      padding: 0.375rem 0.75rem;
    }

    #htmlEditor,
    #cssEditor,
    #javascriptEditor,
    #combinedEditor,
    #dataEditor {
      height: calc(100% - 84px); /* Adjusted for wrapped tabs */
    }
  }

  /* Animations */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Transition effects */
  .editor-content-transition {
    transition: opacity 0.2s ease;
  }

  .editor-content-transition.fade-out {
    opacity: 0;
  }

  .editor-content-transition.fade-in {
    opacity: 1;
  }

  /* Status bar */
  .editor-status-bar {
    height: 24px;
    background: #f9fafb;
    border-top: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    padding: 0 0.5rem;
    font-size: 12px;
    color: #6b7280;
  }

  .editor-status-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0 0.5rem;
  }

  /* Resize handle */
  .editor-resize-handle {
    height: 4px;
    background: transparent;
    cursor: row-resize;
    position: relative;
  }

  .editor-resize-handle:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .editor-resize-handle::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 32px;
    height: 2px;
    background: #d1d5db;
    border-radius: 1px;
  }

  /* Focus styles */
  .monaco-editor-focused {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }

  /* Print styles */
  @media print {
    .editor-tabs,
    .editor-status-bar,
    .editor-resize-handle {
      display: none;
    }

    .code-editor-component {
      height: auto;
    }

    #htmlEditor,
    #cssEditor,
    #javascriptEditor,
    #combinedEditor,
    #dataEditor {
      height: auto;
      overflow: visible;
    }
  }
`;
