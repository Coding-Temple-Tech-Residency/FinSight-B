import type { StockQuote } from "../../market/types/stock";
import type { Portfolio } from "../../portfolio/types/portfolio";
import type { PortfolioPerformanceSummary } from "../../portfolio/utils/portfolioCalculations";

import MetricCard from "./MetricCard";

type DashboardMetricsProps = {
  symbol: string;
  quote?: StockQuote;
  quoteLoading: boolean;
  quoteError: boolean;

  portfolios?: Portfolio[];
  portfolioLoading: boolean;
  portfolioError: boolean;

  performance: PortfolioPerformanceSummary;
  performanceLoading: boolean;
  performanceError: boolean;
};

const formatCurrency = (value: number, currency: string): string => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return value.toFixed(2);
  }
};

const formatPercent = (value: number): string => {
  const prefix = value > 0 ? "+" : "";

  return `${prefix}${value.toFixed(2)}%`;
};

const DashboardMetrics = ({
  symbol,
  quote,
  quoteLoading,
  quoteError,

  portfolios = [],
  portfolioLoading,
  portfolioError,

  performance,
  performanceLoading,
  performanceError,
}: DashboardMetricsProps) => {
  const hasPortfolios = portfolios.length > 0;

  const portfolioCountValue = portfolioLoading
    ? "Loading..."
    : portfolioError
      ? "Unavailable"
      : String(portfolios.length);

  const quoteValue = quoteLoading
    ? "Loading..."
    : quoteError
      ? "Unavailable"
      : quote?.latest_price !== undefined && quote.latest_price !== null
        ? `$${Number(quote.latest_price).toFixed(2)}`
        : "Unavailable";

  const getPerformanceCurrencyValue = (value: number): string => {
    const currency = performance.currency;

    if (performanceLoading) {
      return "Loading...";
    }

    if (!hasPortfolios) {
      return "No portfolios";
    }

    if (performanceError) {
      return "Unavailable";
    }

    if (performance.hasMixedCurrencies) {
      return "Multiple currencies";
    }

    if (currency === null) {
      return "Unavailable";
    }

    return formatCurrency(value, currency);
  };

  const totalValue = getPerformanceCurrencyValue(performance.totalMarketValue);

  const totalGainLoss = getPerformanceCurrencyValue(performance.totalGainLoss);

  const gainLossChange =
    !performanceLoading &&
    !performanceError &&
    hasPortfolios &&
    !performance.hasMixedCurrencies &&
    performance.currency !== null &&
    performance.pricedHoldings > 0
      ? formatPercent(performance.totalGainLossPercent)
      : undefined;

  const holdingsValue = performanceLoading
    ? "Loading..."
    : performanceError
      ? "Unavailable"
      : String(performance.totalHoldings);

  return (
    <>
      <MetricCard label="Portfolios" value={portfolioCountValue} />

      <MetricCard label="Total Portfolio Value" value={totalValue} />

      <MetricCard
        label="Total Profit / Loss"
        value={totalGainLoss}
        change={gainLossChange}
        positive={performance.totalGainLoss >= 0}
      />

      <MetricCard label="Total Holdings" value={holdingsValue} />

      <MetricCard label={`${symbol} Price`} value={quoteValue} />
    </>
  );
};

export default DashboardMetrics;
