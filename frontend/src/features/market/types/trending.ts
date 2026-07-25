export type TrendingCategory = "gainer" | "loser" | "active";

export type TrendingStockApiItem = {
  ticker: string;
  price: string;
  change_amount: string;
  change_percentage: string;
  volume: string;
  company_name?: string | null;
};

export type TrendingStocksApiResponse = {
  last_updated: string | null;
  metadata: string | null;
  top_gainers: TrendingStockApiItem[];
  top_losers: TrendingStockApiItem[];
  most_actively_traded: TrendingStockApiItem[];
};

export type TrendingStock = {
  rank: number;
  symbol: string;
  company_name: string | null;
  price: number | null;
  change_amount: number | null;
  percentage_change: number | null;
  volume: number | null;
  category: TrendingCategory;
};
