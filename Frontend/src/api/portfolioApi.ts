import { apiClient } from "./apiClient";

export type Portfolio = {
  id: number;
  name: string;
  total_value?: number;
  cash_balance?: number;
  buying_power?: number;
  created_at?: string;
  updated_at?: string;
};

export const getPortfolios = () => {
  return apiClient<Portfolio[]>("/api/portfolios");
};
