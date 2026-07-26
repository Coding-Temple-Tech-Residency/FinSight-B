import type { CurrencyTotals } from "../../currency/types/currency";

import { groupCurrencyTotals } from "../../currency/utils/groupCurrencyTotals";

import type { Holding } from "../types/holdings";
import type { Portfolio } from "../types/portfolio";

export type HoldingPerformance = {
  holding: Holding;
  currency: string;
  shares: number;
  averageBuyPrice: number;
  latestPrice: number;
  costBasis: number;
  marketValue: number;
  gainLoss: number;
  gainLossPercent: number;
};

export type PortfolioPerformanceSummary = {
  totalMarketValue: number;
  totalCostBasis: number;
  totalGainLoss: number;
  totalGainLossPercent: number;

  portfolioCount: number;
  totalHoldings: number;
  pricedHoldings: number;
  unpricedHoldings: number;

  currency: string | null;
  currencies: string[];
  hasMixedCurrencies: boolean;

  currencyTotals: CurrencyTotals[];

  largestHolding: HoldingPerformance | null;
  bestPerformer: HoldingPerformance | null;
  worstPerformer: HoldingPerformance | null;

  holdingPerformance: HoldingPerformance[];
};

export const toNumber = (
  value: number | string | null | undefined,
): number | null => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : null;
};

export const normalizeCurrency = (
  currency: string | null | undefined,
): string => {
  return currency?.trim().toUpperCase() || "USD";
};

export const calculateHoldingCostBasis = (holding: Holding): number | null => {
  const shares = toNumber(holding.shares);

  const averageBuyPrice =
    toNumber(holding.average_buy_price_native) ??
    toNumber(holding.average_buy_price);

  if (
    shares === null ||
    shares <= 0 ||
    averageBuyPrice === null ||
    averageBuyPrice < 0
  ) {
    return null;
  }

  return shares * averageBuyPrice;
};

export const calculateHoldingMarketValue = (
  holding: Holding,
): number | null => {
  const shares = toNumber(holding.shares);
  const latestPrice = toNumber(holding.latest_price);

  if (
    shares === null ||
    shares <= 0 ||
    latestPrice === null ||
    latestPrice < 0
  ) {
    return null;
  }

  return shares * latestPrice;
};

export const calculateHoldingPerformance = (
  holding: Holding,
): HoldingPerformance | null => {
  const shares = toNumber(holding.shares);

  const averageBuyPrice =
    toNumber(holding.average_buy_price_native) ??
    toNumber(holding.average_buy_price);

  const latestPrice = toNumber(holding.latest_price);

  if (
    shares === null ||
    shares <= 0 ||
    averageBuyPrice === null ||
    averageBuyPrice < 0 ||
    latestPrice === null ||
    latestPrice < 0
  ) {
    return null;
  }

  const costBasis = shares * averageBuyPrice;
  const marketValue = shares * latestPrice;
  const gainLoss = marketValue - costBasis;

  const gainLossPercent = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;

  return {
    holding,
    currency: normalizeCurrency(holding.native_currency),
    shares,
    averageBuyPrice,
    latestPrice,
    costBasis,
    marketValue,
    gainLoss,
    gainLossPercent,
  };
};

const getLargestHolding = (
  holdings: HoldingPerformance[],
): HoldingPerformance | null => {
  if (holdings.length === 0) {
    return null;
  }

  return holdings.reduce((largest, current) =>
    current.marketValue > largest.marketValue ? current : largest,
  );
};

const getBestPerformer = (
  holdings: HoldingPerformance[],
): HoldingPerformance | null => {
  if (holdings.length === 0) {
    return null;
  }

  return holdings.reduce((best, current) =>
    current.gainLossPercent > best.gainLossPercent ? current : best,
  );
};

const getWorstPerformer = (
  holdings: HoldingPerformance[],
): HoldingPerformance | null => {
  if (holdings.length === 0) {
    return null;
  }

  return holdings.reduce((worst, current) =>
    current.gainLossPercent < worst.gainLossPercent ? current : worst,
  );
};

const calculateCurrencyTotals = (
  holdingPerformance: HoldingPerformance[],
): CurrencyTotals[] => {
  return groupCurrencyTotals(
    holdingPerformance.map((performance) => ({
      currency: performance.currency,
      marketValue: performance.marketValue,
      costBasis: performance.costBasis,
      gainLoss: performance.gainLoss,
      holdingsCount: 1,
    })),
  );
};

export const calculatePortfolioPerformance = (
  portfolios: Portfolio[],
  holdings: Holding[],
): PortfolioPerformanceSummary => {
  const holdingPerformance = holdings.flatMap((holding) => {
    const performance = calculateHoldingPerformance(holding);

    return performance ? [performance] : [];
  });

  const holdingCurrencies = new Set(
    holdingPerformance.map((performance) => performance.currency),
  );

  const fallbackPortfolioCurrencies = new Set(
    portfolios
      .map((portfolio) => normalizeCurrency(portfolio.currency))
      .filter(Boolean),
  );

  const currencies =
    holdingCurrencies.size > 0
      ? Array.from(holdingCurrencies)
      : Array.from(fallbackPortfolioCurrencies);

  const hasMixedCurrencies = currencies.length > 1;
  const currency = currencies.length === 1 ? currencies[0] : null;

  const pricedHoldings = holdingPerformance.length;
  const unpricedHoldings = holdings.length - pricedHoldings;

  const currencyTotals = calculateCurrencyTotals(holdingPerformance);

  const largestHolding = getLargestHolding(holdingPerformance);
  const bestPerformer = getBestPerformer(holdingPerformance);
  const worstPerformer = getWorstPerformer(holdingPerformance);

  if (hasMixedCurrencies || currency === null) {
    return {
      totalMarketValue: 0,
      totalCostBasis: 0,
      totalGainLoss: 0,
      totalGainLossPercent: 0,

      portfolioCount: portfolios.length,
      totalHoldings: holdings.length,
      pricedHoldings,
      unpricedHoldings,

      currency,
      currencies,
      hasMixedCurrencies,

      currencyTotals,

      largestHolding,
      bestPerformer,
      worstPerformer,

      holdingPerformance,
    };
  }

  const totalMarketValue = holdingPerformance.reduce(
    (total, performance) => total + performance.marketValue,
    0,
  );

  const totalCostBasis = holdingPerformance.reduce(
    (total, performance) => total + performance.costBasis,
    0,
  );

  const totalGainLoss = totalMarketValue - totalCostBasis;

  const totalGainLossPercent =
    totalCostBasis > 0 ? (totalGainLoss / totalCostBasis) * 100 : 0;

  return {
    totalMarketValue,
    totalCostBasis,
    totalGainLoss,
    totalGainLossPercent,

    portfolioCount: portfolios.length,
    totalHoldings: holdings.length,
    pricedHoldings,
    unpricedHoldings,

    currency,
    currencies,
    hasMixedCurrencies,

    currencyTotals,

    largestHolding,
    bestPerformer,
    worstPerformer,

    holdingPerformance,
  };
};
