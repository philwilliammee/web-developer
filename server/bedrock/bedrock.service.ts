// server/bedrock/bedrock.service.ts
import {
  BedrockRuntimeClient,
  ConverseCommand,
  ConverseResponse,
  Message,
  SystemContentBlock,
  type ConverseCommandInput,
} from "@aws-sdk/client-bedrock-runtime";

export interface BedrockServiceConfig {
  region: string;
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken?: string;
  };
}

interface ContentBlock {
  text: string;
}

export class BedrockService {
  private client: BedrockRuntimeClient;

  constructor(config: BedrockServiceConfig) {
    this.client = new BedrockRuntimeClient(config);
  }

  async converse(
    modelId: string,
    messages: Message[],
    systemPrompt: string
  ): Promise<ConverseResponse> {
    console.log(
      "Invoking converse:",
      modelId,
      JSON.stringify(messages, null, 2)
    );
    const system: SystemContentBlock.TextMember[] = [{ text: systemPrompt }];

    const input: ConverseCommandInput = {
      modelId,
      system,
      messages,
      inferenceConfig: {
        temperature: 0.7,
        maxTokens: 8000,
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
