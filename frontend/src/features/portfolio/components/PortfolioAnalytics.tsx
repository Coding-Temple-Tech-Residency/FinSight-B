import { useMemo } from "react";

import type { Holding } from "../types/holdings";

import { calculatePortfolioPerformance } from "../utils/portfolioCalculations";

type PortfolioAnalyticsProps = {
  holdings: Holding[];
  isLoading?: boolean;
};

const formatCurrency = (value: number, currency: string): string => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return value.toLocaleString("en-US", {
      maximumFractionDigits: 2,
    });
  }
};

const formatPercent = (value: number): string => {
  const prefix = value > 0 ? "+" : "";

  return `${prefix}${value.toFixed(2)}%`;
};

const PortfolioAnalytics = ({
  holdings,
  isLoading = false,
}: PortfolioAnalyticsProps) => {
  const analytics = useMemo(
    () => calculatePortfolioPerformance([], holdings),
    [holdings],
  );

  if (isLoading) {
    return (
      <article className="portfolio-analytics-card">
        <div className="portfolio-analytics-header">
          <div>
            <p className="page-eyebrow">Performance</p>
            <h2>Portfolio Analytics</h2>
          </div>
        </div>

        <div className="portfolio-analytics-state" role="status">
          <p>Calculating portfolio analytics...</p>
        </div>
      </article>
    );
  }

  if (holdings.length === 0) {
    return (
      <article className="portfolio-analytics-card">
        <div className="portfolio-analytics-header">
          <div>
            <p className="page-eyebrow">Performance</p>
            <h2>Portfolio Analytics</h2>
          </div>
        </div>

        <div className="portfolio-analytics-state">
          <h3>No analytics yet</h3>

          <p>Add holdings to begin tracking portfolio performance.</p>
        </div>
      </article>
    );
  }

  if (analytics.pricedHoldings === 0) {
    return (
      <article className="portfolio-analytics-card">
        <div className="portfolio-analytics-header">
          <div>
            <p className="page-eyebrow">Performance</p>
            <h2>Portfolio Analytics</h2>
          </div>
        </div>

        <div className="portfolio-analytics-state">
          <h3>Price data unavailable</h3>

          <p>
            Analytics will appear when current prices are available for this
            portfolio’s holdings.
          </p>
        </div>
      </article>
    );
  }

  if (analytics.hasMixedCurrencies) {
    return (
      <article className="portfolio-analytics-card">
        <div className="portfolio-analytics-header">
          <div>
            <p className="page-eyebrow">Performance</p>
            <h2>Portfolio Analytics</h2>
          </div>

          <span className="portfolio-analytics-priced-count">
            {analytics.pricedHoldings} of {analytics.totalHoldings} priced
          </span>
        </div>

        <div className="portfolio-analytics-state">
          <h3>Currency conversion required</h3>

          <p>
            This portfolio contains holdings priced in{" "}
            {analytics.currencies.join(", ")}. Combined totals require current
            exchange-rate conversion from the backend.
          </p>
        </div>
      </article>
    );
  }

  const currency = analytics.currency ?? "USD";

  const largestPositionPercent =
    analytics.largestHolding && analytics.totalMarketValue > 0
      ? (analytics.largestHolding.marketValue / analytics.totalMarketValue) *
        100
      : 0;

  return (
    <article className="portfolio-analytics-card">
      <div className="portfolio-analytics-header">
        <div>
          <p className="page-eyebrow">Performance</p>
          <h2>Portfolio Analytics</h2>
        </div>

        <span className="portfolio-analytics-priced-count">
          {analytics.pricedHoldings} of {analytics.totalHoldings} priced
        </span>
      </div>

      <div className="portfolio-analytics-primary">
        <div>
          <span className="metric-label">Current value</span>

          <strong className="portfolio-analytics-value">
            {formatCurrency(analytics.totalMarketValue, currency)}
          </strong>
        </div>

        <div>
          <span className="metric-label">Total return</span>

          <strong
            className={
              analytics.totalGainLoss >= 0
                ? "portfolio-analytics-return portfolio-positive"
                : "portfolio-analytics-return portfolio-negative"
            }
          >
            {formatCurrency(analytics.totalGainLoss, currency)}

            <span>{formatPercent(analytics.totalGainLossPercent)}</span>
          </strong>
        </div>
      </div>

      <div className="portfolio-analytics-grid">
        <section className="portfolio-analytics-metric">
          <span className="metric-label">Cost basis</span>

          <strong>{formatCurrency(analytics.totalCostBasis, currency)}</strong>
        </section>

        <section className="portfolio-analytics-metric">
          <span className="metric-label">Largest position</span>

          {analytics.largestHolding ? (
            <>
              <strong>{analytics.largestHolding.holding.symbol}</strong>

              <span>
                {largestPositionPercent.toFixed(1)}% ·{" "}
                {formatCurrency(analytics.largestHolding.marketValue, currency)}
              </span>
            </>
          ) : (
            <strong>—</strong>
          )}
        </section>

        <section className="portfolio-analytics-metric">
          <span className="metric-label">Best performer</span>

          {analytics.bestPerformer ? (
            <>
              <strong>{analytics.bestPerformer.holding.symbol}</strong>

              <span className="portfolio-positive">
                {formatPercent(analytics.bestPerformer.gainLossPercent)}
              </span>
            </>
          ) : (
            <strong>—</strong>
          )}
        </section>

        <section className="portfolio-analytics-metric">
          <span className="metric-label">Worst performer</span>

          {analytics.worstPerformer ? (
            <>
              <strong>{analytics.worstPerformer.holding.symbol}</strong>

              <span
                className={
                  analytics.worstPerformer.gainLossPercent >= 0
                    ? "portfolio-positive"
                    : "portfolio-negative"
                }
              >
                {formatPercent(analytics.worstPerformer.gainLossPercent)}
              </span>
            </>
          ) : (
            <strong>—</strong>
          )}
        </section>
      </div>
    </article>
  );
};

export default PortfolioAnalytics;
