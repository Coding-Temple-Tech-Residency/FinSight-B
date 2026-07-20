import { apiClient } from "./apiClient";

import type { AIChatPayload } from "../features/chat/types/chat";
import type { AIInsight } from "../features/insights/types/ai";

const AI_CHAT_URL = "/api/ai-insights";

export const sendAIChatMessage = (
  payload: AIChatPayload,
): Promise<AIInsight> => {
  const message = payload.message.trim();

  if (!message) {
    throw new Error("A message is required.");
  }

  return apiClient<AIInsight>(AI_CHAT_URL, {
    method: "POST",
    body: JSON.stringify({
      message,
    }),
  });
};
