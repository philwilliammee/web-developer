// components/Chat/chat.styles.ts
export const chatStyles = /*css*/`
  .chat-section {
    height: calc(100vh - var(--header-height));
    flex: 1;
    display: flex;
    flex-direction: column;
    background: white;
    border: 1px solid #e5e7eb;
  }
  /*
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }
    */

  .chat-message {
    margin-bottom: 0.75rem;
    padding: 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
  }

  .chat-message.user {
    background-color: #f3f4f6;
  }

  .chat-message.assistant {
    background-color: #dbeafe;
  }

  .prompt-form {
    display: flex;
    flex-direction: column;
    justify-content: end;
    gap: 0.5rem;
    padding: 0.75rem;
    border-top: 1px solid #e5e7eb;
  }

  .prompt-input {
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-family: inherit;
    background-color: #ffffff;
    transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s;
    resize: none;
    min-height: 68px;
  }

  .prompt-input:disabled {
    background-color: #f9fafb;
    border-color: #e5e7eb;
    cursor: not-allowed;
    color: #9ca3af;
  }

  .prompt-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
    background-color: #f9fafe;
  }

  .prompt-input::placeholder {
    color: #9ca3af;
    font-style: italic;
  }

  .prompt-actions {
    display: flex;
    justify-content: flex-end;
  }

  .btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.375rem;
    color: white;
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-green {
    background-color: var(--success-color);
  }

  .btn-green:hover:not(:disabled) {
    background-color: #15803d;
  }

  .chat {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: white;
  }

  /* Button spinner styles */
  .button-spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .chat-section {
      height: calc(100vh - var(--header-height) - 60px);
    }

    .prompt-input {
      font-size: 0.875rem;
      min-height: 60px;
    }

    .btn {
      padding: 0.375rem 0.75rem;
      font-size: 0.75rem;
    }
  }
`;
