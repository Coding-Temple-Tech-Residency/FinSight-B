export type StockQuote = {
  id: number;
  symbol: string;
  company_name: string;

  company_logo_url: string | null;
  exchange: string | null;
  sector: string | null;
  industry: string | null;

  latest_price: number | string | null;
  last_refreshed_at: string | null;

  created_at: string;
  updated_at: string;
};

export type StockSearchResult = {
  id?: number;
  symbol: string;
  company_name: string;
  exchange?: string | null;
  latest_price?: number | string | null;
  company_logo_url?: string | null;
};
