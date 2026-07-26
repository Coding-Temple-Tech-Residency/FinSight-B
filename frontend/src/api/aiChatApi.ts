import { apiClient } from "./apiClient";

import type { AIChatPayload } from "../features/chat/types/chat";
import type { AIInsight } from "../features/insights/types/ai";

const AI_CHAT_URL = "/api/ai-insights";

const buildContextualMessage = ({
  message,
  symbol,
  preferredCurrency,
}: AIChatPayload): string => {
  const cleanMessage = message.trim();

  if (!cleanMessage) {
    throw new Error("A message is required.");
  }

  const context: string[] = [];

  if (symbol) {
    context.push(`Currently selected stock: ${symbol.trim().toUpperCase()}`);
  }

  if (preferredCurrency) {
    context.push(`Preferred display currency: ${preferredCurrency}`);
  }

  if (context.length === 0) {
    return cleanMessage;
  }

  return [
    "Use this current FinSight interface context when it is relevant:",
    ...context.map((item) => `- ${item}`),
    "",
    `User question: ${cleanMessage}`,
  ].join("\n");
};

export const sendAIChatMessage = (
  payload: AIChatPayload,
): Promise<AIInsight> => {
  const message = buildContextualMessage(payload);

  return apiClient<AIInsight>(AI_CHAT_URL, {
    method: "POST",
    body: JSON.stringify({
      message,
    }),
  });
};
