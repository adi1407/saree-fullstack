import OpenAI from "openai";
import { env } from "../../config/env";

export type LlmMessage =
  | { role: "system"; content: string }
  | { role: "user"; content: string }
  | { role: "assistant"; content: string | null; tool_calls?: LlmToolCall[] }
  | { role: "tool"; tool_call_id: string; content: string };

export type LlmToolCall = {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
};

export type LlmToolDef = {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
};

export type LlmCompletion = {
  content: string | null;
  tool_calls?: LlmToolCall[];
};

let client: OpenAI | null = null;

export function hasLlmKey(): boolean {
  return Boolean(env.LLM_API_KEY?.trim());
}

function getClient(): OpenAI {
  if (!env.LLM_API_KEY?.trim()) {
    throw new Error("LLM_API_KEY is not configured");
  }
  if (!client) {
    client = new OpenAI({
      apiKey: env.LLM_API_KEY,
      baseURL: env.LLM_BASE_URL,
    });
  }
  return client;
}

export async function chatCompletion(
  messages: LlmMessage[],
  tools: LlmToolDef[]
): Promise<LlmCompletion> {
  const openai = getClient();
  const response = await openai.chat.completions.create({
    model: env.LLM_MODEL,
    messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    tools: tools.length ? (tools as OpenAI.Chat.Completions.ChatCompletionTool[]) : undefined,
    temperature: 0.4,
  });

  const choice = response.choices[0]?.message;
  if (!choice) {
    return { content: "I could not generate a reply just now. Please try again." };
  }

  return {
    content: choice.content,
    tool_calls: choice.tool_calls
      ?.filter(
        (tc): tc is OpenAI.Chat.Completions.ChatCompletionMessageFunctionToolCall =>
          tc.type === "function"
      )
      .map((tc) => ({
        id: tc.id,
        type: "function" as const,
        function: {
          name: tc.function.name,
          arguments: tc.function.arguments,
        },
      })),
  };
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (!texts.length) return [];
  const openai = getClient();
  const response = await openai.embeddings.create({
    model: env.LLM_EMBEDDING_MODEL,
    input: texts,
  });
  return response.data
    .sort((a, b) => a.index - b.index)
    .map((d) => d.embedding);
}

export async function embedQuery(text: string): Promise<number[]> {
  const [vec] = await embedTexts([text]);
  return vec ?? [];
}
