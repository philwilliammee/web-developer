// design-assistant-bot.ts
import { ConverseResponse, Message } from "@aws-sdk/client-bedrock-runtime";
import {
  BedrockService,
  BedrockServiceConfig,
} from "./bedrock/bedrock.service";
import { designAssistantSystemPrompt } from "./design-assistant.system";

export interface WebDesignResponse {
  html: string;
  css: string;
  javascript: string;
  description: string;
}

export class DesignAssistantBot {
  private bedrockService: BedrockService;
  private modelId: string;
  private systemPrompt: string;
  private static MAX_RETRIES = 2;
  private static MAX_MESSAGES = 5; // Must be odd so user is always first

  constructor(config: BedrockServiceConfig) {
    this.bedrockService = new BedrockService(config);
    this.modelId = import.meta.env.VITE_BEDROCK_MODEL_ID;
    this.systemPrompt = designAssistantSystemPrompt;
  }

  /**
   * Generates web design with retry mechanism and proper chat context
   */
  // public async generateWebDesign(userPrompt: string): Promise<WebDesignResponse> {
  //   const messages: Message[] = [
  //     {
  //       role: 'user',
  //       content: [{ text: userPrompt }]
  //     }
  //   ];

  //   return this.executeWithRetry(messages);
  // }
  public async generateWebDesign(messages: Message[]): Promise<WebDesignResponse> {
    const truncatedMessages = this.truncateMessages(messages);
    return this.executeWithRetry(truncatedMessages);
  }

  /**
   * Executes the design generation with retry logic
   */
  private async executeWithRetry(
    messages: Message[],
    retryCount = DesignAssistantBot.MAX_RETRIES
  ): Promise<WebDesignResponse> {
    console.log(`Attempt ${DesignAssistantBot.MAX_RETRIES - retryCount + 1} of ${DesignAssistantBot.MAX_RETRIES + 1}`);
    console.log('Current message context:', JSON.stringify(messages, null, 2));

    try {
      const response = await this.bedrockService.converse(
        this.modelId,
        messages,
        this.systemPrompt
      );

      const messageContent = response?.output?.message?.content || [];
      const responseText = messageContent[0].text || '';
      console.log('Raw AI response:', responseText);

      try {
        const parsedResponse = this.parseDesignResponse(responseText);
        console.log('Successfully parsed response:', parsedResponse);

        messages.push({
          role: 'assistant',
          content: [{ text: responseText }]
        });

        return parsedResponse;

      } catch (parseError: any) {
        console.warn('Parse error encountered:', {
          error: parseError.message,
          attemptsRemaining: retryCount,
          responseText
        });

        if (retryCount > 0) {
          console.log('Adding error response to conversation and retrying...');

          messages.push({
            role: 'assistant',
            content: [{ text: responseText }]
          });

          messages.push({
            role: 'user',
            content: [{
              text: `[AUTOMATIC ERROR RESPONSE]: Parse error - ${parseError.message}. Please provide a valid JSON response following this exact format: { "html": "", "css": "", "javascript": "", "description": "" }`
            }]
          });

          return this.executeWithRetry(messages, retryCount - 1);
        }
        throw parseError;
      }

    } catch (error: any) {
      console.error('Execution error:', {
        errorType: error.name,
        errorMessage: error.message,
        attemptsRemaining: retryCount,
        lastMessage: messages[messages.length - 1]
      });

      if (retryCount > 0 && error.name === 'ValidationException') {
        console.log('Validation error - fixing message sequence and retrying...');

        const lastMessage = messages[messages.length - 1];

        if (lastMessage.role === 'user') {
          console.log('Adding dummy assistant message to maintain alternation');
          messages.push({
            role: 'assistant',
            content: [{ text: '[AUTOMATIC ERROR RESPONSE]: Invalid response detected' }]
          });
        }

        messages.push({
          role: 'user',
          content: [{
            text: `[AUTOMATIC ERROR RESPONSE]: Message sequence error. Please provide a valid JSON response following this exact format: { "html": "", "css": "", "javascript": "", "description": "" }`
          }]
        });

        return this.executeWithRetry(messages, retryCount - 1);
      }

      throw error;
    }
  }

  /**
   * Parses and validates the design response
   */
  private parseDesignResponse(responseText: string): WebDesignResponse {
    console.log("Parsing design response:", responseText);

    try {
      const parsedResponse = JSON.parse(responseText);

      // Validate required fields
      if (!parsedResponse.description) {
        throw new Error('Response missing required description field');
      }

      // Ensure all fields exist with default values if missing
      return {
        html: parsedResponse.html || '',
        css: parsedResponse.css || '',
        javascript: parsedResponse.javascript || '',
        description: parsedResponse.description
      };

    } catch (error: any) {
      throw new Error(`Failed to parse design response: ${error.message}`);
    }
  }


  /**
   * Truncates message history to maintain proper context size
   */
  private truncateMessages(messages: Message[]): Message[] {
    return messages.slice(-DesignAssistantBot.MAX_MESSAGES);
  }
}

// Initialize singleton instance
export const designAssistantInstance = new DesignAssistantBot({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY,
    sessionToken: import.meta.env.VITE_AWS_SESSION_TOKEN,
  },
});
