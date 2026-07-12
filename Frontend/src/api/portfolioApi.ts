import { apiClient } from "./apiClient";

import type {
  CreatePortfolioPayload,
  Portfolio,
  UpdatePortfolioPayload,
} from "../features/portfolio/types/portfolio";

export const getPortfolios = () => {
  return apiClient<Portfolio[]>("/api/portfolios");
};

export const getPortfolioById = (portfolioId: number) => {
  return apiClient<Portfolio>(`/api/portfolios/${portfolioId}`);
};

export const createPortfolio = (payload: CreatePortfolioPayload) => {
  return apiClient<Portfolio>("/api/portfolios", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updatePortfolio = (
  portfolioId: number,
  payload: UpdatePortfolioPayload,
) => {
  return apiClient<Portfolio>(`/api/portfolios/${portfolioId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const deletePortfolio = (portfolioId: number) => {
  return apiClient<void>(`/api/portfolios/${portfolioId}`, {
    method: "DELETE",
  });
};
