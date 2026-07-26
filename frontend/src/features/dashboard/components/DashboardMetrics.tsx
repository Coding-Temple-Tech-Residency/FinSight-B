import type { StockQuote } from "../../market/types/stock";
import type { Portfolio } from "../../portfolio/types/portfolio";
import type { PortfolioPerformanceSummary } from "../../portfolio/utils/portfolioCalculations";

import { formatCurrency } from "../../portfolio/utils/currencyFormatting";

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
        ? formatCurrency(quote.latest_price, "USD")
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
        positive={
          performance.currency !== null && performance.totalGainLoss >= 0
        }
      />

      <MetricCard label="Total Holdings" value={holdingsValue} />

      <MetricCard label={`${symbol} Price`} value={quoteValue} />
    </>
  );
};

export default DashboardMetrics;
