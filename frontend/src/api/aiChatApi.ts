import { apiClient } from "./apiClient";

import type {
  AIChatPayload,
  AIChatResponse,
} from "../features/chat/types/chat";

const AI_CHAT_URL = "/api/ai/chat";

export const sendAIChatMessage = (
  payload: AIChatPayload,
): Promise<AIChatResponse> => {
  return apiClient<AIChatResponse>(AI_CHAT_URL, {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      message: payload.message.trim(),
      symbol: payload.symbol?.trim().toUpperCase() || undefined,
    }),
  });
};
