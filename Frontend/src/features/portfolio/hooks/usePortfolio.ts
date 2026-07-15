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
  Portfolio,
  UpdatePortfolioPayload,
} from "../types/portfolio";

import { portfolioKeys } from "./portfolioKeys";

export const usePortfolios = () => {
  return useQuery<Portfolio[]>({
    queryKey: portfolioKeys.all,
    queryFn: getPortfolios,
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const usePortfolio = (portfolioId?: number) => {
  const isValidPortfolioId = typeof portfolioId === "number" && portfolioId > 0;

  return useQuery<Portfolio>({
    queryKey: isValidPortfolioId
      ? portfolioKeys.detail(portfolioId)
      : ["portfolio", "disabled"],
    queryFn: () => getPortfolioById(portfolioId!),
    enabled: isValidPortfolioId,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useCreatePortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePortfolioPayload) => createPortfolio(payload),

    onSuccess: (newPortfolio) => {
      queryClient.setQueryData<Portfolio[]>(
        portfolioKeys.all,
        (current = []) => [...current, newPortfolio],
      );

      queryClient.setQueryData(
        portfolioKeys.detail(newPortfolio.id),
        newPortfolio,
      );
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
      queryClient.setQueryData<Portfolio[]>(portfolioKeys.all, (current = []) =>
        current.map((portfolio) =>
          portfolio.id === updatedPortfolio.id ? updatedPortfolio : portfolio,
        ),
      );

      queryClient.setQueryData(
        portfolioKeys.detail(updatedPortfolio.id),
        updatedPortfolio,
      );
    },
  });
};

export const useDeletePortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePortfolio,

    onSuccess: (_, portfolioId) => {
      queryClient.setQueryData<Portfolio[]>(portfolioKeys.all, (current = []) =>
        current.filter((portfolio) => portfolio.id !== portfolioId),
      );

      queryClient.removeQueries({
        queryKey: portfolioKeys.detail(portfolioId),
      });

      queryClient.removeQueries({
        queryKey: portfolioKeys.holdings(portfolioId),
      });
    },
  });
};
