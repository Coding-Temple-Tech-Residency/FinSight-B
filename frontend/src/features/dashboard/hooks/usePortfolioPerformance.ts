import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";

import { getHoldings } from "../../../api/holdingsApi";

import type { Portfolio } from "../../portfolio/types/portfolio";
import type { Holding } from "../../portfolio/types/holdings";

import { portfolioKeys } from "../../portfolio/hooks/portfolioKeys";
import { calculatePortfolioPerformance } from "../../portfolio/utils/portfolioCalculations";

export const usePortfolioPerformance = (portfolios: Portfolio[]) => {
  const holdingQueries = useQueries({
    queries: portfolios.map((portfolio) => ({
      queryKey: portfolioKeys.holdings(portfolio.id),

      queryFn: () => getHoldings(portfolio.id),

      staleTime: 5 * 60 * 1000,
      retry: false,
      refetchOnWindowFocus: false,
    })),
  });

  const isLoading =
    portfolios.length > 0 && holdingQueries.some((query) => query.isLoading);

  const isFetching = holdingQueries.some((query) => query.isFetching);

  const isError = holdingQueries.some((query) => query.isError);

  const errors = holdingQueries
    .filter((query) => query.isError)
    .map((query) => query.error);

  const holdings = useMemo<Holding[]>(
    () => holdingQueries.flatMap((query) => query.data ?? []),
    [holdingQueries],
  );

  const summary = useMemo(
    () => calculatePortfolioPerformance(portfolios, holdings),
    [portfolios, holdings],
  );

  return {
    summary,
    holdings,
    holdingQueries,
    errors,
    isLoading,
    isFetching,
    isError,
  };
};
