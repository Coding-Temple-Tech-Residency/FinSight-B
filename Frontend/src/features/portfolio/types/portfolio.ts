export type Portfolio = {
  id: number;
  name: string;
  user_id?: number;
  total_value?: number | string;
  cash_balance?: number | string;
  buying_power?: number | string;
  created_at?: string;
  updated_at?: string;
};

export type CreatePortfolioPayload = {
  name: string;
};

export type UpdatePortfolioPayload = {
  name?: string;
};
