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

const LLM_TIMEOUT_MS = 25_000;
const LLM_MAX_RETRIES = 2;
const LLM_MAX_TOKENS = 800;

/** Simple in-process circuit: skip LLM after repeated provider failures. */
const CIRCUIT_FAIL_THRESHOLD = 3;
const CIRCUIT_COOLDOWN_MS = 60_000;
let circuitFailures = 0;
let circuitOpenUntil = 0;

let client: OpenAI | null = null;

export function hasLlmKey(): boolean {
  return Boolean(env.LLM_API_KEY?.trim());
}

export function isLlmCircuitOpen(): boolean {
  return Date.now() < circuitOpenUntil;
}

function recordLlmSuccess(): void {
  circuitFailures = 0;
  circuitOpenUntil = 0;
}

function recordLlmFailure(): void {
  circuitFailures += 1;
  if (circuitFailures >= CIRCUIT_FAIL_THRESHOLD) {
    circuitOpenUntil = Date.now() + CIRCUIT_COOLDOWN_MS;
    console.warn(
      `[Chat] LLM circuit open for ${CIRCUIT_COOLDOWN_MS / 1000}s after ${circuitFailures} failures`
    );
  }
}

function getClient(): OpenAI {
  if (!env.LLM_API_KEY?.trim()) {
    throw new Error("LLM_API_KEY is not configured");
  }
  if (!client) {
    const isOpenRouter = env.LLM_BASE_URL.includes("openrouter.ai");
    client = new OpenAI({
      apiKey: env.LLM_API_KEY,
      baseURL: env.LLM_BASE_URL,
      timeout: LLM_TIMEOUT_MS,
      maxRetries: LLM_MAX_RETRIES,
      ...(isOpenRouter
        ? {
            defaultHeaders: {
              "HTTP-Referer": env.FRONTEND_URL,
              "X-Title": "AADIORA Shop Assistant",
            },
          }
        : {}),
    });
  }
  return client;
}

export async function chatCompletion(
  messages: LlmMessage[],
  tools: LlmToolDef[]
): Promise<LlmCompletion> {
  if (isLlmCircuitOpen()) {
    throw new Error("LLM circuit open — provider temporarily unavailable");
  }

  const openai = getClient();
  try {
    const response = await openai.chat.completions.create({
      model: env.LLM_MODEL,
      messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      tools: tools.length ? (tools as OpenAI.Chat.Completions.ChatCompletionTool[]) : undefined,
      temperature: 0.4,
      max_tokens: LLM_MAX_TOKENS,
    });

    recordLlmSuccess();

    const choice = response.choices[0]?.message;
    if (!choice) {
      return { content: "I could not generate a reply just now. Please try again." };
    }

    const tool_calls = choice.tool_calls
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
      }));

    return {
      content: choice.content,
      // Never return tool_calls: [] — providers reject empty arrays on replay.
      ...(tool_calls && tool_calls.length > 0 ? { tool_calls } : {}),
    };
  } catch (err) {
    recordLlmFailure();
    throw err;
  }
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
