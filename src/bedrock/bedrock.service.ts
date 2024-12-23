import {
  BedrockRuntimeClient,
  ConverseCommand,
  ConverseResponse,
  Message,
  SystemContentBlock,
  type ConverseCommandInput,
} from "@aws-sdk/client-bedrock-runtime";

class BedrockService {
  private client: BedrockRuntimeClient;

  constructor(config: BedrockServiceConfig) {
    this.client = new BedrockRuntimeClient(config);
  }

  async converse(
    modelId: string,
    messages: Message[],
    systemPrompt: string
  ): Promise<ConverseResponse> {
    console.log("Invoking converse:", modelId, JSON.stringify(messages, null, 2));
    const system: SystemContentBlock.TextMember[] = [{
      text: systemPrompt,
    }];

    const input: ConverseCommandInput = {
      modelId, // required
      system,
      messages,
      inferenceConfig: {
        temperature: 0.7,
        maxTokens: 8000
      },
    };

    try {
      const command = new ConverseCommand(input);
      const response = await this.client.send(command);
      if (response.output) {
        return response;
      }

      throw new Error("No message in response");
    } catch (error) {
      console.error("Error in converse:", error);
      throw error;
    }
  }
}

// Updated interfaces to match AWS SDK types
interface BedrockServiceConfig {
  region: string;
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken?: string;
  };
}

// interface Message {
//   role: "user" | "assistant";
//   content: ContentBlock[];
// }

interface ContentBlock {
  text: string;
}

// interface ConverseResponse {
//   message: {
//     role: 'assistant';
//     content: ContentBlock[];
//   };
//   stopReason: string;
//   usage: {
//     inputTokens: number;
//     outputTokens: number;
//     totalTokens: number;
//   };
//   metrics: {
//     latencyMs: number;
//   };
// }

export {
  BedrockService,
  type Message,
  type ContentBlock,
  // type ConverseResponse,
  type BedrockServiceConfig,
};
