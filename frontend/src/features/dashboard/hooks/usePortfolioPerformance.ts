import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";

import { getHoldings } from "../../../api/holdingsApi";

import {
  useCurrency,
  useCurrencyConversions,
} from "../../currency/hooks/useCurrency";

import type {
  ConvertibleCurrencyTotal,
  SupportedCurrency,
} from "../../currency/types/currency";

import { portfolioKeys } from "../../portfolio/hooks/portfolioKeys";

import type { Holding } from "../../portfolio/types/holdings";
import type { Portfolio } from "../../portfolio/types/portfolio";

import {
  calculatePortfolioPerformance,
  type PortfolioPerformanceSummary,
} from "../../portfolio/utils/portfolioCalculations";

const createConversionTotals = (
  summary: PortfolioPerformanceSummary,
  field: "marketValue" | "costBasis" | "gainLoss",
): ConvertibleCurrencyTotal[] => {
  return summary.currencyTotals.map((total) => ({
    currency: total.currency,
    amount: total[field],
  }));
};

const conversionsAreReady = (
  totals: ConvertibleCurrencyTotal[],
  hasConversions: boolean,
): boolean => {
  const hasNonZeroValues = totals.some((total) => total.amount !== 0);

  return !hasNonZeroValues || hasConversions;
};

export const usePortfolioPerformance = (portfolios: Portfolio[]) => {
  const { preferredCurrency } = useCurrency();

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

  const holdingsError = holdingQueries.some((query) => query.isError);

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

  const marketValueTotals = useMemo(
    () => createConversionTotals(summary, "marketValue"),
    [summary],
  );

  const costBasisTotals = useMemo(
    () => createConversionTotals(summary, "costBasis"),
    [summary],
  );

  const gainLossTotals = useMemo(
    () => createConversionTotals(summary, "gainLoss"),
    [summary],
  );

  const marketValueConversion = useCurrencyConversions(
    marketValueTotals,
    preferredCurrency,
    !isLoading && !holdingsError,
  );

  const costBasisConversion = useCurrencyConversions(
    costBasisTotals,
    preferredCurrency,
    !isLoading && !holdingsError,
  );

  const gainLossConversion = useCurrencyConversions(
    gainLossTotals,
    preferredCurrency,
    !isLoading && !holdingsError,
  );

  const marketValueReady = conversionsAreReady(
    marketValueTotals,
    marketValueConversion.hasConversions,
  );

  const costBasisReady = conversionsAreReady(
    costBasisTotals,
    costBasisConversion.hasConversions,
  );

  const gainLossReady = conversionsAreReady(
    gainLossTotals,
    gainLossConversion.hasConversions,
  );

  const conversionsReady =
    summary.pricedHoldings === 0 ||
    (marketValueReady && costBasisReady && gainLossReady);

  const conversionLoading =
    marketValueConversion.isLoading ||
    costBasisConversion.isLoading ||
    gainLossConversion.isLoading;

  const conversionFetching =
    marketValueConversion.isFetching ||
    costBasisConversion.isFetching ||
    gainLossConversion.isFetching;

  const conversionError =
    marketValueConversion.isError ||
    costBasisConversion.isError ||
    gainLossConversion.isError;

  const displaySummary = useMemo<PortfolioPerformanceSummary>(() => {
    if (summary.pricedHoldings === 0 || !conversionsReady || conversionError) {
      return {
        ...summary,
        currency: preferredCurrency,
      };
    }

    const totalMarketValue = marketValueConversion.total;
    const totalCostBasis = costBasisConversion.total;
    const totalGainLoss = gainLossConversion.total;

    const totalGainLossPercent =
      totalCostBasis > 0 ? (totalGainLoss / totalCostBasis) * 100 : 0;

    return {
      ...summary,

      totalMarketValue,
      totalCostBasis,
      totalGainLoss,
      totalGainLossPercent,

      currency: preferredCurrency,
      hasMixedCurrencies: false,
    };
  }, [
    conversionError,
    conversionsReady,
    costBasisConversion.total,
    gainLossConversion.total,
    marketValueConversion.total,
    preferredCurrency,
    summary,
  ]);

  const allErrors = [
    ...errors,
    ...marketValueConversion.errors,
    ...costBasisConversion.errors,
    ...gainLossConversion.errors,
  ];

  return {
    summary,
    displaySummary,
    preferredCurrency: preferredCurrency as SupportedCurrency,

    holdings,
    holdingQueries,

    errors: allErrors,

    isLoading: isLoading || conversionLoading,
    isFetching: isFetching || conversionFetching,
    isError: holdingsError || conversionError,

    holdingsLoading: isLoading,
    holdingsFetching: isFetching,
    holdingsError,

    conversionLoading,
    conversionFetching,
    conversionError,
    conversionsReady,
  };
};
