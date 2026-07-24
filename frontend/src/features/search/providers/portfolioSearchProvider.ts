import { getPortfolios } from "../../../api/portfolioApi";

import type { Portfolio } from "../../portfolio/types/portfolio";

import type { UniversalSearchResult } from "../types/search";
import type { SearchProvider } from "../types/searchProvider";

const DEFAULT_RESULT_LIMIT = 6;

const normalizeValue = (value: string | null | undefined): string => {
  return value?.trim().toLowerCase() ?? "";
};

const matchesPortfolio = (portfolio: Portfolio, query: string): boolean => {
  const normalizedQuery = normalizeValue(query);

  if (!normalizedQuery) {
    return false;
  }

  return [portfolio.name, portfolio.description, portfolio.currency].some(
    (value) => normalizeValue(value).includes(normalizedQuery),
  );
};

const mapPortfolioToSearchResult = (
  portfolio: Portfolio,
): UniversalSearchResult => {
  return {
    id: `portfolio-${portfolio.id}`,
    type: "portfolio",
    title: portfolio.name,
    subtitle:
      portfolio.description ?? `${portfolio.currency} investment portfolio`,
    badge: portfolio.currency,
    href: `/dashboard/portfolio?portfolio=${portfolio.id}`,
    data: portfolio,
  };
};

export const portfolioSearchProvider: SearchProvider = {
  id: "portfolio",
  label: "Portfolios",

  async search(query, options): Promise<UniversalSearchResult[]> {
    const normalizedQuery = query.trim();

    if (!normalizedQuery || options?.signal?.aborted) {
      return [];
    }

    const portfolios = await getPortfolios();

    if (options?.signal?.aborted) {
      return [];
    }

    return portfolios
      .filter((portfolio) => matchesPortfolio(portfolio, normalizedQuery))
      .slice(0, DEFAULT_RESULT_LIMIT)
      .map(mapPortfolioToSearchResult);
  },
};
