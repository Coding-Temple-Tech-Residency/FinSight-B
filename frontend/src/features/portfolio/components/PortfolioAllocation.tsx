import { useMemo } from "react";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { Holding } from "../types/holdings";

import {
  formatCurrency,
  normalizeCurrencyCode,
  toFiniteNumber,
} from "../utils/currencyFormatting";

type PortfolioAllocationProps = {
  holdings: Holding[];
  portfolioCurrency: string;
  isLoading: boolean;
};

type AllocationItem = {
  id: number;
  name: string;
  symbol: string;
  currency: string;
  value: number;
  percentage: number;
};

type RechartsTooltipPayload = {
  payload?: AllocationItem;
};

const allocationColors = [
  "var(--accent-primary)",
  "var(--accent-secondary)",
  "#4f7cff",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
  "#6b7280",
];

const PortfolioAllocation = ({
  holdings,
  portfolioCurrency,
  isLoading,
}: PortfolioAllocationProps) => {
  const normalizedPortfolioCurrency = normalizeCurrencyCode(portfolioCurrency);

  const allocation = useMemo(() => {
    const validHoldings = holdings
      .map((holding) => {
        const shares = toFiniteNumber(holding.shares);
        const latestPrice = toFiniteNumber(holding.latest_price);
        const nativeCurrency = normalizeCurrencyCode(holding.native_currency);

        const marketValue =
          shares !== null && latestPrice !== null ? shares * latestPrice : null;

        if (marketValue === null || marketValue <= 0) {
          return null;
        }

        return {
          id: holding.id,
          name: holding.company_name || holding.symbol,
          symbol: holding.symbol,
          currency: nativeCurrency,
          value: marketValue,
        };
      })
      .filter(
        (holding): holding is Omit<AllocationItem, "percentage"> =>
          holding !== null,
      );

    const hasMixedCurrencies = validHoldings.some(
      (holding) => holding.currency !== normalizedPortfolioCurrency,
    );

    if (hasMixedCurrencies) {
      return {
        items: [] as AllocationItem[],
        totalMarketValue: 0,
        hasMixedCurrencies: true,
      };
    }

    const totalMarketValue = validHoldings.reduce(
      (total, holding) => total + holding.value,
      0,
    );

    const items: AllocationItem[] = validHoldings
      .map((holding) => ({
        ...holding,
        percentage:
          totalMarketValue > 0 ? (holding.value / totalMarketValue) * 100 : 0,
      }))
      .sort((first, second) => second.value - first.value);

    return {
      items,
      totalMarketValue,
      hasMixedCurrencies: false,
    };
  }, [holdings, normalizedPortfolioCurrency]);

  return (
    <section
      className="portfolio-allocation-card"
      aria-labelledby="portfolio-allocation-title"
    >
      <div className="card-header">
        <div>
          <p className="page-eyebrow">Breakdown</p>

          <h2 id="portfolio-allocation-title">Holdings Allocation</h2>
        </div>

        {!isLoading && allocation.totalMarketValue > 0 && (
          <span className="metric-label">
            {formatCurrency(
              allocation.totalMarketValue,
              normalizedPortfolioCurrency,
            )}
          </span>
        )}
      </div>

      {isLoading && (
        <div className="portfolio-allocation-state">
          <p>Loading portfolio allocation...</p>
        </div>
      )}

      {!isLoading && holdings.length === 0 && (
        <div className="portfolio-allocation-state">
          <h3>No holdings yet</h3>

          <p>Add holdings to this portfolio to view its allocation.</p>
        </div>
      )}

      {!isLoading && holdings.length > 0 && allocation.hasMixedCurrencies && (
        <div className="portfolio-allocation-state">
          <h3>Allocation conversion required</h3>

          <p>
            This portfolio contains holdings with market prices in currencies
            other than {normalizedPortfolioCurrency}. Current exchange-rate
            conversion is required before their values can be compared
            accurately.
          </p>
        </div>
      )}

      {!isLoading &&
        holdings.length > 0 &&
        !allocation.hasMixedCurrencies &&
        allocation.items.length === 0 && (
          <div className="portfolio-allocation-state">
            <h3>Allocation unavailable</h3>

            <p>Latest prices are missing for the holdings in this portfolio.</p>
          </div>
        )}

      {!isLoading &&
        !allocation.hasMixedCurrencies &&
        allocation.items.length > 0 && (
          <div className="portfolio-allocation-content">
            <div className="portfolio-allocation-chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocation.items}
                    dataKey="value"
                    nameKey="symbol"
                    innerRadius={58}
                    outerRadius={88}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {allocation.items.map((item, index) => (
                      <Cell
                        key={item.id}
                        fill={allocationColors[index % allocationColors.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value, _name, context) => {
                      const tooltipContext = context as RechartsTooltipPayload;

                      const item = tooltipContext.payload;

                      if (!item) {
                        return [
                          formatCurrency(
                            Number(value),
                            normalizedPortfolioCurrency,
                          ),
                          "Holding",
                        ];
                      }

                      return [
                        `${formatCurrency(
                          Number(value),
                          normalizedPortfolioCurrency,
                        )} (${item.percentage.toFixed(1)}%)`,
                        item.symbol,
                      ];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="portfolio-allocation-legend">
              {allocation.items.map((item, index) => (
                <div key={item.id} className="portfolio-allocation-legend-item">
                  <span
                    className="portfolio-allocation-dot"
                    style={{
                      backgroundColor:
                        allocationColors[index % allocationColors.length],
                    }}
                    aria-hidden="true"
                  />

                  <div className="portfolio-allocation-label">
                    <strong>{item.symbol}</strong>

                    <span>{item.name}</span>
                  </div>

                  <div className="portfolio-allocation-value">
                    <strong>{item.percentage.toFixed(1)}%</strong>

                    <span>
                      {formatCurrency(item.value, normalizedPortfolioCurrency)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </section>
  );
};

export default PortfolioAllocation;
