import { ConverseResponse } from "@aws-sdk/client-bedrock-runtime";
import {
  BedrockService,
  BedrockServiceConfig,
  Message,
} from "./bedrock/bedrock.service";

export class DesignAssistantBot {
  private bedrockService: BedrockService;
  private modelId: string;
  private systemPrompt: string;
  private chatContext: Message[] = []; // Chat context to hold message history
  private static MAX_MESSAGES = 5; // this must always be odd so that user is always first.

  constructor(config: BedrockServiceConfig) {
    this.bedrockService = new BedrockService(config);
    this.modelId = import.meta.env.VITE_BEDROCK_MODEL_ID
    this.systemPrompt = `
You are an AI web design assistant. Output all responses in JSON format with keys:
- "html" (The HTML code as a string),
- "css" (The CSS code as a string),
- "javascript" (The JavaScript code as a string),
- "description" (A brief description of what the code does).

Always output valid JSON with the following schema:
{
  "html": string,
  "css": string,
  "javascript": string,
  "description": string
}

Requirements:
- Output all responses in valid, parsable JSON.
- Escape special characters properly.
- Always include "html", "css", "javascript", and "description" keys.
- Use HTML5, CSS3, and modern ES6+ JavaScript.
- For module-based code (e.g., Three.js, React), insert it via a dynamically created <script type='module'> element.
- For Three.js specifically, include ES module shims and an import map before the module script.
- Keep responses concise and human-readable but inline (no multiline formatting).
- No comments.
- Your role is to assist with web design by generating JSON with working code and a brief description.

When working with module-based libraries (like Three.js, etc.), ensure the following:
 1. Always wrap module code in a dynamically created script element with type='module'
 2. Use this pattern: const script = document.createElement('script'); script.type = 'module'; script.textContent = \`[your module code here]\`; document.body.appendChild(script);

Example:
{
  "html": "<div id='container'>Hello</div>",
  "css": "#container { color: red; }",
  "javascript": "document.getElementById('container').addEventListener('click', () => alert('Clicked!'));",
  "description": "Red text that shows an alert when clicked."
}

Your output should always be consistent, concise, and adhere to the defined schema strictly. **Test each command thoroughly and ensure that your JSON output is properly formatted and free of errors.**
If you want to examine a problem step by step use the json output response. For example:

  {
    "html": "<div></div>",
    "css": "div { }",
    "javascript": "",
    "description": "Let me help you solve this step by step......"
  }
**Respond only with valid JSON.** Do not include any introductory or summary text, as these will be stripped out before processing.
    `;
  }

  /**
   * Generates code based on user input and stores chat history.
   */
  async generateWebDesign(userPrompt: string): Promise<{
    html: string;
    css: string;
    javascript: string;
    description: string;
  }> {
    if (!userPrompt) {
      throw new Error("Prompt cannot be empty.");
    }

    // Add the user message to the chat context
    this.addToChatContext({
      role: "user",
      content: [{ text: userPrompt}],
    });

    // Prepare the payload
    // const payload = {
    //   anthropic_version: "bedrock-2023-05-31",
    //   system: this.systemPrompt,
    //   messages: this.chatContext, // Include the full chat context
    //   max_tokens: 20000,
    //   temperature: 0.8,
    // };

    try {
      // Send the request
      const response: ConverseResponse = await this.bedrockService.converse(this.modelId, this.chatContext, this.systemPrompt);

      const messageContext = response?.output?.message?.content
      if (!messageContext?.length) {
        throw new Error("Invalid response from Bedrock model.");
      }

      const text = messageContext[0].text || "error parsing response";

      console.log("response", response);

      // Parse the response
      const parsedResponse = this.parseAssistantResponse(text);

      // Add the assistant's message to the chat context
      this.addToChatContext({
        role: "assistant",
        content: [{ text: text}],
      });

      return parsedResponse;
    } catch (error) {
      // add retry logic
      console.error("Error generating web design:", error);
      throw error;
    }
  }

  /**
   * Adds a message to the chat context and truncates if necessary.
   */
  addToChatContext(message: Message): void {
    this.chatContext.push(message);

    // Truncate the context to the maximum allowed size
    if (this.chatContext.length > DesignAssistantBot.MAX_MESSAGES) {
      this.chatContext = this.chatContext.slice(-DesignAssistantBot.MAX_MESSAGES);
    }
  }

  /**
   * Parses the assistant's response to ensure it includes valid "html", "css", "javascript", and "description".
   */
  private parseAssistantResponse(responseText: string): {
    html: string;
    css: string;
    javascript: string;
    description: string;
  } {
    console.log("Parsing assistant response:", responseText);

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (error: any) {
      throw new Error("Failed to parse assistant response as JSON: " + error.message);
    }

    // if (!parsedResponse.html || !parsedResponse.css || !parsedResponse.javascript || !parsedResponse.description) {
    //   throw new Error('Response does not include required fields: "html", "css", "javascript", and "description".');
    // }

        if ( !parsedResponse.description) {
      throw new Error('Response does not include required fields:  "description".');
    }

    return parsedResponse;
  }
}

// Initialize DesignAssistantBot with Vite environment variables
export const designAssistantInstance = new DesignAssistantBot({
  region: import.meta.env.VITE_AWS_REGION,
  // modelId: import.meta.env.VITE_BEDROCK_MODEL_ID,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY,
    sessionToken: import.meta.env.VITE_AWS_SESSION_TOKEN,
  },
});
