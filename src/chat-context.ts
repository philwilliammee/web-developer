// chat-context.ts
import { Message } from '@aws-sdk/client-bedrock-runtime';

interface ContentBlock {
  text: string;
}

export class ChatContext {
  private messages: Message[] = [];

  addUserMessage(prompt: string) {
    if (this.messages.length > 0 && this.messages[this.messages.length - 1].role === 'user') {
      // Add content to existing user message
      const lastMessage = this.messages[this.messages.length - 1];
      const newContent: ContentBlock[] = [{ text: prompt }];
      const lastMessageContent = lastMessage.content || [];
      lastMessage.content = [...lastMessageContent, ...newContent];
    } else {
      // Create new user message
      this.messages.push({
        role: 'user',
        content: [{ text: prompt }]
      });
    }
  }

  addAssistantMessage(response: string, description: string) {
    if (this.messages.length > 0 && this.messages[this.messages.length - 1].role === 'assistant') {
      // Add content to existing assistant message
      const lastMessage = this.messages[this.messages.length - 1];
      const newContent: ContentBlock[] = [
        { text: response },
        { text: description }
      ];
      const lastMessageContent = lastMessage.content || [];
      lastMessage.content = [...lastMessageContent, ...newContent];
    } else {
      // Create new assistant message
      this.messages.push({
        role: 'assistant',
        content: [
          { text: response },
          { text: description }
        ]
      });
    }
  }

  getMessages(): Message[] {
    return this.messages;
  }

  getTruncatedHistory(count: number = 3): Message[] {
    return this.messages.slice(-count);
  }

  clearMessages(): void {
    this.messages = [];
  }
}

export const chatContext = new ChatContext();
