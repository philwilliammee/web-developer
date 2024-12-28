// components/MainApplication/mainApplication.styles.ts
export const mainApplicationStyles = /*css*/ `
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

  #codeEditor {
    height: 500px;
    position: relative;
  }



  .iframe-container {
    width: 100%;
    height: 100%;
    background: white;
  }

  #outputIframe {
    width: 100%;
    height: 100%;
    border: none;
  }

  .editor-container {
    min-height: 500px;
    width: 100%;
    height: 100%;
    position: relative;
  }

  .editor-containers,
  #code-editor {
    display: flex ;
    flex-direction: column;
    height: 100%;
  }


  .tab-header {
    display: flex;
    border-bottom: 1px solid #e5e7eb;
    background-color: #f9fafb;
  }

  .tab-header button {
    flex: 1;
    padding: 0.75rem;
    font-size: 1rem;
    font-weight: 500;
    border: none;
    background: #f9fafb;
    color: #374151;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
  }

  .tab-header button.active {
    background-color: white;
    color: var(--primary-color);
    border-bottom: 2px solid var(--primary-color);
  }

  .tab-header button:hover {
    background-color: #e5e7eb;
  }

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
  }
`;
