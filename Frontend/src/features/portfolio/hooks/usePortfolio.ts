import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createPortfolio,
  deletePortfolio,
  getPortfolioById,
  getPortfolios,
  updatePortfolio,
} from "../../../api/portfolioApi";

import type {
  CreatePortfolioPayload,
  UpdatePortfolioPayload,
} from "../types/portfolio";

export const usePortfolios = () => {
  return useQuery({
    queryKey: ["portfolios"],
    queryFn: getPortfolios,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

export const usePortfolio = (portfolioId?: number) => {
  return useQuery({
    queryKey: ["portfolio", portfolioId],
    queryFn: () => getPortfolioById(portfolioId!),
    enabled: typeof portfolioId === "number",
    retry: false,
  });
};

export const useCreatePortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePortfolioPayload) => createPortfolio(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["portfolios"],
      });
    },
  });
};

export const useUpdatePortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      portfolioId,
      payload,
    }: {
      portfolioId: number;
      payload: UpdatePortfolioPayload;
    }) => updatePortfolio(portfolioId, payload),

    onSuccess: (updatedPortfolio) => {
      queryClient.invalidateQueries({
        queryKey: ["portfolios"],
      });

      queryClient.setQueryData(
        ["portfolio", updatedPortfolio.id],
        updatedPortfolio,
      );
    },
  });
};

export const useDeletePortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePortfolio,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["portfolios"],
      });
    },
  });
};
