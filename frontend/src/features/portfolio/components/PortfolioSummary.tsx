import { useMemo } from "react";

import type { Holding } from "../types/holdings";
import type { Portfolio } from "../types/portfolio";

type PortfolioSummaryProps = {
  portfolio: Portfolio;
  holdings: Holding[];
  isLoading: boolean;
};

type PortfolioTotals = {
  costBasis: number;
  marketValue: number;
  gainLoss: number;
  pricedHoldings: number;
};

const formatDate = (value?: string): string => {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatCurrency = (value: number | null, currency: string): string => {
  if (value === null || !Number.isFinite(value)) {
    return "Unavailable";
  }

  try {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    });
  } catch {
    return value.toFixed(2);
  }
};

const calculateTotals = (holdings: Holding[]): PortfolioTotals => {
  return holdings.reduce<PortfolioTotals>(
    (summary, holding) => {
      const shares = Number(holding.shares);
      const averageBuyPrice = Number(holding.average_buy_price);

      const latestPrice =
        holding.latest_price === null ? null : Number(holding.latest_price);

      const hasValidShares = Number.isFinite(shares);

      const hasValidAveragePrice = Number.isFinite(averageBuyPrice);

      const hasValidLatestPrice =
        latestPrice !== null && Number.isFinite(latestPrice);

      const costBasis =
        hasValidShares && hasValidAveragePrice ? shares * averageBuyPrice : 0;

      const marketValue =
        hasValidShares && hasValidLatestPrice && latestPrice !== null
          ? shares * latestPrice
          : null;

      const gainLoss = marketValue === null ? null : marketValue - costBasis;

      return {
        costBasis: summary.costBasis + costBasis,

        marketValue:
          marketValue === null
            ? summary.marketValue
            : summary.marketValue + marketValue,

        gainLoss:
          gainLoss === null ? summary.gainLoss : summary.gainLoss + gainLoss,

        pricedHoldings:
          marketValue === null
            ? summary.pricedHoldings
            : summary.pricedHoldings + 1,
      };
    },
    {
      costBasis: 0,
      marketValue: 0,
      gainLoss: 0,
      pricedHoldings: 0,
    },
  );
};

const PortfolioSummary = ({
  portfolio,
  holdings,
  isLoading,
}: PortfolioSummaryProps) => {
  const totals = useMemo(() => calculateTotals(holdings), [holdings]);

  const currency = portfolio.currency || "USD";

  const allHoldingsHavePrices =
    holdings.length > 0 && totals.pricedHoldings === holdings.length;

  const gainLossPercent =
    allHoldingsHavePrices && totals.costBasis > 0
      ? (totals.gainLoss / totals.costBasis) * 100
      : null;

  const portfolioValue = isLoading
    ? "Loading..."
    : holdings.length === 0
      ? formatCurrency(0, currency)
      : allHoldingsHavePrices
        ? formatCurrency(totals.marketValue, currency)
        : "Unavailable";

  const totalGainLoss = isLoading
    ? "Loading..."
    : holdings.length === 0
      ? formatCurrency(0, currency)
      : allHoldingsHavePrices
        ? formatCurrency(totals.gainLoss, currency)
        : "Unavailable";

  const gainLossClassName =
    gainLossPercent === null
      ? ""
      : totals.gainLoss >= 0
        ? "portfolio-positive"
        : "portfolio-negative";

  return (
    <>
      <section
        className="summary-cards"
        aria-label={`${portfolio.name} performance summary`}
      >
        <article className="card">
          <p className="metric-label">Portfolio Value</p>

          <h2 className="metric-value">{portfolioValue}</h2>

          {!isLoading && holdings.length > 0 && !allHoldingsHavePrices && (
            <p className="metric-label">
              One or more holdings are missing a latest price.
            </p>
          )}
        </article>

        <article className="card">
          <p className="metric-label">Total Cost Basis</p>

          <h2 className="metric-value">
            {isLoading
              ? "Loading..."
              : formatCurrency(totals.costBasis, currency)}
          </h2>
        </article>

        <article className="card">
          <p className="metric-label">Total Gain/Loss</p>

          <h2 className={`metric-value ${gainLossClassName}`.trim()}>
            {totalGainLoss}
          </h2>

          {gainLossPercent !== null && (
            <p className={gainLossClassName}>
              {gainLossPercent >= 0 ? "+" : ""}
              {gainLossPercent.toFixed(2)}%
            </p>
          )}
        </article>

        <article className="card">
          <p className="metric-label">Holdings</p>

          <h2 className="metric-value">
            {isLoading ? "Loading..." : holdings.length}
          </h2>

          {!isLoading && holdings.length > 0 && (
            <p className="metric-label">
              {totals.pricedHoldings} of {holdings.length} priced
            </p>
          )}
        </article>
      </section>

      <section className="portfolio-details-card">
        <div className="card-header">
          <div>
            <p className="page-eyebrow">Selected Portfolio</p>

            <h2>Portfolio Details</h2>
          </div>
        </div>

        <dl className="portfolio-details-list">
          <div>
            <dt>Name</dt>

            <dd>{portfolio.name}</dd>
          </div>

          <div>
            <dt>Description</dt>

            <dd>{portfolio.description || "No description has been added."}</dd>
          </div>

          <div>
            <dt>Currency</dt>

            <dd>{currency}</dd>
          </div>

          <div>
            <dt>Created</dt>

            <dd>{formatDate(portfolio.created_at)}</dd>
          </div>

          <div>
            <dt>Last Updated</dt>

            <dd>{formatDate(portfolio.updated_at)}</dd>
          </div>
        </dl>
      </section>
    </>
  );
};

export default PortfolioSummary;
