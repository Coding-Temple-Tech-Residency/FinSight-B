import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteAIInsight,
  generateGeneralAIInsight,
  generatePortfolioAIInsight,
  generateStockAIInsight,
  getAIInsight,
  getAIInsights,
  updateAIInsight,
} from "../../../api/aiInsightsApi";

import type {
  AIChatPayload,
  AIInsight,
  GeneratePortfolioInsightVariables,
  GenerateStockInsightVariables,
  UpdateAIInsightVariables,
} from "../types/ai";

export const aiInsightKeys = {
  all: ["ai-insights"] as const,

  lists: () => [...aiInsightKeys.all, "list"] as const,

  detail: (insightId: number) =>
    [...aiInsightKeys.all, "detail", insightId] as const,
};

const addInsightToCache = (
  queryClient: ReturnType<typeof useQueryClient>,
  insight: AIInsight,
) => {
  queryClient.setQueryData<AIInsight[]>(
    aiInsightKeys.lists(),
    (current = []) => [
      insight,
      ...current.filter((currentInsight) => currentInsight.id !== insight.id),
    ],
  );

  queryClient.setQueryData(aiInsightKeys.detail(insight.id), insight);
};

export const useAIInsights = () => {
  return useQuery({
    queryKey: aiInsightKeys.lists(),
    queryFn: getAIInsights,
    staleTime: 10 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,

    select: (insights) =>
      [...insights].sort((firstInsight, secondInsight) => {
        return (
          new Date(secondInsight.created_at).getTime() -
          new Date(firstInsight.created_at).getTime()
        );
      }),
  });
};

export const useAIInsight = (insightId: number) => {
  return useQuery({
    queryKey: aiInsightKeys.detail(insightId),
    queryFn: () => getAIInsight(insightId),
    enabled: insightId > 0,
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
};

export const useGenerateGeneralAIInsight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AIChatPayload) => generateGeneralAIInsight(payload),

    onSuccess: (newInsight) => {
      addInsightToCache(queryClient, newInsight);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: aiInsightKeys.lists(),
      });
    },
  });
};

export const useGeneratePortfolioAIInsight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ portfolioId }: GeneratePortfolioInsightVariables) =>
      generatePortfolioAIInsight(portfolioId),

    onSuccess: (newInsight) => {
      addInsightToCache(queryClient, newInsight);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: aiInsightKeys.lists(),
      });
    },
  });
};

export const useGenerateStockAIInsight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ symbol }: GenerateStockInsightVariables) =>
      generateStockAIInsight(symbol),

    onSuccess: (newInsight) => {
      addInsightToCache(queryClient, newInsight);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: aiInsightKeys.lists(),
      });
    },
  });
};

export const useUpdateAIInsight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: UpdateAIInsightVariables) =>
      updateAIInsight(variables),

    onSuccess: (updatedInsight) => {
      queryClient.setQueryData<AIInsight[]>(
        aiInsightKeys.lists(),
        (current = []) =>
          current.map((insight) =>
            insight.id === updatedInsight.id ? updatedInsight : insight,
          ),
      );

      queryClient.setQueryData(
        aiInsightKeys.detail(updatedInsight.id),
        updatedInsight,
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: aiInsightKeys.lists(),
      });
    },
  });
};

export const useDeleteAIInsight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (insightId: number) => deleteAIInsight(insightId),

    onSuccess: (_, insightId) => {
      queryClient.setQueryData<AIInsight[]>(
        aiInsightKeys.lists(),
        (current = []) => current.filter((insight) => insight.id !== insightId),
      );

      queryClient.removeQueries({
        queryKey: aiInsightKeys.detail(insightId),
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: aiInsightKeys.lists(),
      });
    },
  });
};
