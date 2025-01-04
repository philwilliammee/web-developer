// design-assistant-bot.ts
import { Message } from "@aws-sdk/client-bedrock-runtime";
import { designAssistantSystemPrompt } from "./design-assistant.system";
import { postBedrock } from "./apiClient"; // <-- the fetch helper

export interface WebDesignResponse {
  html: string;
  css: string;
  javascript: string;
  description: string;
}

export class DesignAssistantBot {
  private static MAX_RETRIES = 2;
  private static MAX_MESSAGES = 5;
  private modelId: string;
  private systemPrompt: string;

  constructor() {
    this.modelId = import.meta.env.VITE_BEDROCK_MODEL_ID;
    this.systemPrompt = designAssistantSystemPrompt;
  }

  public async generateWebDesign(
    messages: Message[]
  ): Promise<WebDesignResponse> {
    const truncatedMessages = this.truncateMessages(messages);
    return this.executeWithRetry(truncatedMessages);
  }

  private async executeWithRetry(
    messages: Message[],
    retryCount = DesignAssistantBot.MAX_RETRIES
  ): Promise<WebDesignResponse> {
    console.log(
      `Attempt ${DesignAssistantBot.MAX_RETRIES - retryCount + 1} of ${
        DesignAssistantBot.MAX_RETRIES + 1
      }`
    );
    console.log("Current message context:", JSON.stringify(messages, null, 2));

    try {
      // Here, we call our server endpoint instead of bedrockService.converse
      const response = await postBedrock(
        this.modelId,
        messages,
        this.systemPrompt
      );

      // response should match the structure of ConverseResponse
      const messageContent = response?.output?.message?.content || [];
      const responseText = messageContent[0]?.text || "";
      console.log("Raw AI response:", responseText);

      try {
        const parsedResponse = this.parseDesignResponse(responseText);
        console.log("Successfully parsed response:", parsedResponse);

        messages.push({
          role: "assistant",
          content: [{ text: responseText }],
        });

        return parsedResponse;
      } catch (parseError: any) {
        console.warn("Parse error encountered:", {
          error: parseError.message,
          attemptsRemaining: retryCount,
          responseText,
        });

        if (retryCount > 0) {
          console.log("Adding error response to conversation and retrying...");

          messages.push({
            role: "assistant",
            content: [{ text: responseText }],
          });

          messages.push({
            role: "user",
            content: [
              {
                text: `[AUTOMATIC ERROR RESPONSE]: Parse error - ${parseError.message}. Please provide a valid JSON response following this exact format: { "html": "", "css": "", "javascript": "", "description": "" }`,
              },
            ],
          });

          return this.executeWithRetry(messages, retryCount - 1);
        }
        throw parseError;
      }
    } catch (error: any) {
      console.error("Execution error:", {
        errorType: error.name,
        errorMessage: error.message,
        attemptsRemaining: retryCount,
        lastMessage: messages[messages.length - 1],
      });

      // Example condition: If it's a "ValidationException"
      if (retryCount > 0 && error.name === "ValidationException") {
        console.log(
          "Validation error - fixing message sequence and retrying..."
        );

        const lastMessage = messages[messages.length - 1];
        if (lastMessage.role === "user") {
          console.log("Adding dummy assistant message to maintain alternation");
          messages.push({
            role: "assistant",
            content: [
              { text: "[AUTOMATIC ERROR RESPONSE]: Invalid response detected" },
            ],
          });
        }

        messages.push({
          role: "user",
          content: [
            {
              text: `[AUTOMATIC ERROR RESPONSE]: Message sequence error. Please provide a valid JSON response following this exact format: { "html": "", "css": "", "javascript": "", "description": "" }`,
            },
          ],
        });

        return this.executeWithRetry(messages, retryCount - 1);
      }

      throw error;
    }
  }

  private parseDesignResponse(responseText: string): WebDesignResponse {
    console.log("Parsing design response:", responseText);
    try {
      const parsedResponse = JSON.parse(responseText);
      if (!parsedResponse.description) {
        throw new Error("Response missing required description field");
      }
      return {
        html: parsedResponse.html || "",
        css: parsedResponse.css || "",
        javascript: parsedResponse.javascript || "",
        description: parsedResponse.description,
      };
    } catch (error: any) {
      throw new Error(`Failed to parse design response: ${error.message}`);
    }
  }

  private truncateMessages(messages: Message[]): Message[] {
    return messages.slice(-DesignAssistantBot.MAX_MESSAGES);
  }
}

// Export a singleton instance
export const designAssistantInstance = new DesignAssistantBot();
