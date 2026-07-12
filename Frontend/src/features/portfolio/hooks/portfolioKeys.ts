export const portfolioKeys = {
  all: ["portfolios"] as const,
  detail: (portfolioId: number) => ["portfolio", portfolioId] as const,
  holdings: (portfolioId: number) => ["holdings", portfolioId] as const,
};
