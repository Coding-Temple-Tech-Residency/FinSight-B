import { apiClient } from "./apiClient";

import type {
  AIInsight,
  CreateAIInsightPayload,
  UpdateAIInsightVariables,
} from "../features/insights/types/ai";

const AI_INSIGHTS_URL = "/api/ai-insights";

export const getAIInsights = (): Promise<AIInsight[]> => {
  return apiClient<AIInsight[]>(AI_INSIGHTS_URL);
};

export const getAIInsight = (insightId: number): Promise<AIInsight> => {
  return apiClient<AIInsight>(`${AI_INSIGHTS_URL}/${insightId}`);
};

export const createAIInsight = (
  payload: CreateAIInsightPayload,
): Promise<AIInsight> => {
  return apiClient<AIInsight>(AI_INSIGHTS_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateAIInsight = ({
  insightId,
  payload,
}: UpdateAIInsightVariables): Promise<AIInsight> => {
  return apiClient<AIInsight>(`${AI_INSIGHTS_URL}/${insightId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const deleteAIInsight = (insightId: number): Promise<void> => {
  return apiClient<void>(`${AI_INSIGHTS_URL}/${insightId}`, {
    method: "DELETE",
  });
};
