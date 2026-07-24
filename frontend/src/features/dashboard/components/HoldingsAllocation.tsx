import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { useHoldings } from "../../portfolio/hooks/useHoldings";
import {
  formatCurrency,
  normalizeCurrencyCode,
  toFiniteNumber,
} from "../../portfolio/utils/currencyFormatting";

type HoldingsAllocationProps = {
  portfolioId?: number;
  portfolioLoading?: boolean;
  portfolioError?: boolean;
};

type AllocationItem = {
  id: number;
  name: string;
  symbol: string;
  currency: string;
  value: number;
  percentage: number;
};

const colors = [
  "var(--accent-primary)",
  "var(--accent-secondary)",
  "#4f7cff",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
  "#6b7280",
];

const HoldingsAllocation = ({
  portfolioId,
  portfolioLoading = false,
  portfolioError = false,
}: HoldingsAllocationProps) => {
  const {
    data: holdings = [],
    isLoading: holdingsLoading,
    isError: holdingsError,
    error: holdingsErrorData,
  } = useHoldings(portfolioId);

  const isLoading = portfolioLoading || holdingsLoading;
  const isError = portfolioError || holdingsError;

  const allocationData = holdings.flatMap((holding) => {
    const shares = toFiniteNumber(holding.shares);
    const latestPrice = toFiniteNumber(holding.latest_price);

    if (
      shares === null ||
      shares <= 0 ||
      latestPrice === null ||
      latestPrice <= 0
    ) {
      return [];
    }

    return [
      {
        id: holding.id,
        name: holding.company_name || holding.symbol,
        symbol: holding.symbol,
        currency: normalizeCurrencyCode(holding.native_currency),
        value: shares * latestPrice,
      },
    ];
  });

  const currencies = new Set(allocationData.map((item) => item.currency));

  const hasMixedCurrencies = currencies.size > 1;

  const displayCurrency =
    currencies.size === 1 ? Array.from(currencies)[0] : undefined;

  const totalMarketValue = hasMixedCurrencies
    ? 0
    : allocationData.reduce((total, item) => total + item.value, 0);

  const allocationWithPercentages: AllocationItem[] =
    hasMixedCurrencies || totalMarketValue <= 0
      ? []
      : allocationData.map((item) => ({
          ...item,
          percentage: (item.value / totalMarketValue) * 100,
        }));

  return (
    <article className="hold-card">
      <div className="card-header">
        <div>
          <h2>Holdings Allocation</h2>

          {!isLoading && holdings.length > 0 && (
            <p className="metric-label">
              {holdings.length} {holdings.length === 1 ? "holding" : "holdings"}
            </p>
          )}
        </div>

        {displayCurrency && totalMarketValue > 0 && (
          <span className="metric-label">
            {formatCurrency(totalMarketValue, displayCurrency)}
          </span>
        )}
      </div>

      {isLoading && (
        <div className="dashboard-unavailable-state" role="status">
          <p>Loading holdings allocation...</p>
        </div>
      )}

      {!isLoading && isError && (
        <div className="dashboard-unavailable-state">
          <h3>Unable to load allocation</h3>

          <p>
            {holdingsErrorData instanceof Error
              ? holdingsErrorData.message
              : "Portfolio or holdings data is unavailable."}
          </p>
        </div>
      )}

      {!isLoading && !isError && !portfolioId && (
        <div className="dashboard-unavailable-state">
          <h3>No portfolio available</h3>

          <p>Create a portfolio to view its holdings allocation.</p>
        </div>
      )}

      {!isLoading &&
        !isError &&
        Boolean(portfolioId) &&
        holdings.length === 0 && (
          <div className="dashboard-unavailable-state">
            <h3>No holdings yet</h3>

            <p>Add holdings to this portfolio to see its allocation.</p>
          </div>
        )}

      {!isLoading &&
        !isError &&
        allocationData.length > 0 &&
        hasMixedCurrencies && (
          <div className="dashboard-unavailable-state">
            <h3>Currency conversion required</h3>

            <p>
              This portfolio contains holdings priced in different currencies.
              Combined allocation requires current exchange-rate conversion from
              the backend.
            </p>
          </div>
        )}

      {!isLoading &&
        !isError &&
        holdings.length > 0 &&
        allocationData.length === 0 && (
          <div className="dashboard-unavailable-state">
            <h3>Allocation unavailable</h3>

            <p>Latest prices are missing for the holdings in this portfolio.</p>
          </div>
        )}

      {!isLoading &&
        !isError &&
        allocationWithPercentages.length > 0 &&
        displayCurrency && (
          <>
            <div className="holdings-allocation-chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationWithPercentages}
                    dataKey="value"
                    nameKey="symbol"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {allocationWithPercentages.map((item, index) => (
                      <Cell
                        key={item.id}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value, _name, context) => {
                      const payload = context.payload as AllocationItem;

                      const rawValue = Array.isArray(value) ? value[0] : value;
                      const numericValue =
                        typeof rawValue === "number" ||
                        typeof rawValue === "string"
                          ? toFiniteNumber(rawValue)
                          : null;

                      return [
                        numericValue === null
                          ? "Unavailable"
                          : `${formatCurrency(
                              numericValue,
                              payload.currency,
                            )} (${payload.percentage.toFixed(1)}%)`,
                        payload.symbol,
                      ];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="allocation-legend">
              {allocationWithPercentages.map((item, index) => (
                <div key={item.id} className="allocation-legend-item">
                  <span
                    className="allocation-dot"
                    style={{
                      backgroundColor: colors[index % colors.length],
                    }}
                  />

                  <div className="allocation-legend-label">
                    <strong>{item.symbol}</strong>
                    <span>{item.name}</span>
                  </div>

                  <div className="allocation-legend-value">
                    <strong>{item.percentage.toFixed(1)}%</strong>

                    <span>{formatCurrency(item.value, item.currency)}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
    </article>
  );
};

export default HoldingsAllocation;
