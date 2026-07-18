export type Portfolio = {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  currency: string;
  created_at: string;
  updated_at: string;
};

export type CreatePortfolioPayload = {
  name: string;
  description?: string | null;
  currency?: string;
};

export type UpdatePortfolioPayload = {
  name?: string;
  description?: string | null;
  currency?: string;
};
