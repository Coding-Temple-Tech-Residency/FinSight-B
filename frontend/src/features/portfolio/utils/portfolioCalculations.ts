import type { Holding } from "../types/holdings";
import type { Portfolio } from "../types/portfolio";

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
  hasMixedCurrencies: boolean;
};

const toNumber = (value: number | string | null | undefined): number | null => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : null;
};

export const calculateHoldingCostBasis = (holding: Holding): number => {
  const shares = toNumber(holding.shares);
  const averageBuyPrice = toNumber(holding.average_buy_price);

  if (shares === null || averageBuyPrice === null) {
    return 0;
  }

  return shares * averageBuyPrice;
};

export const calculateHoldingMarketValue = (
  holding: Holding,
): number | null => {
  const shares = toNumber(holding.shares);
  const latestPrice = toNumber(holding.latest_price);

  if (shares === null || latestPrice === null) {
    return null;
  }

  return shares * latestPrice;
};

export const calculatePortfolioPerformance = (
  portfolios: Portfolio[],
  holdings: Holding[],
): PortfolioPerformanceSummary => {
  const currencies = new Set<string>();

  portfolios.forEach((portfolio) => {
    const currency = portfolio.currency?.trim().toUpperCase();

    if (currency) {
      currencies.add(currency);
    }
  });

  let totalMarketValue = 0;
  let totalCostBasis = 0;
  let pricedHoldings = 0;
  let unpricedHoldings = 0;

  holdings.forEach((holding) => {
    const marketValue = calculateHoldingMarketValue(holding);

    if (marketValue === null) {
      unpricedHoldings += 1;
      return;
    }

    const costBasis = calculateHoldingCostBasis(holding);

    totalMarketValue += marketValue;
    totalCostBasis += costBasis;
    pricedHoldings += 1;
  });

  const totalGainLoss = totalMarketValue - totalCostBasis;

  const totalGainLossPercent =
    totalCostBasis > 0 ? (totalGainLoss / totalCostBasis) * 100 : 0;

  const hasMixedCurrencies = currencies.size > 1;

  const currency = currencies.size === 1 ? Array.from(currencies)[0] : null;

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
    hasMixedCurrencies,
  };
};
