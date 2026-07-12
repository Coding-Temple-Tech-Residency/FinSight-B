import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { generateAIInsight, getAIInsights } from "../../../api/aiInsightsApi";

import type { AIInsight } from "../types/ai";

export const aiInsightKeys = {
  all: ["ai-insights"] as const,
};

export const useAIInsights = () => {
  return useQuery({
    queryKey: aiInsightKeys.all,
    queryFn: getAIInsights,
    staleTime: 10 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useGenerateAIInsight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateAIInsight,

    onSuccess: (newInsight) => {
      queryClient.setQueryData<AIInsight[]>(
        aiInsightKeys.all,
        (current = []) => [
          newInsight,
          ...current.filter((insight) => insight.id !== newInsight.id),
        ],
      );
    },
  });
};
