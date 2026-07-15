import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { useHoldings } from "../../portfolio/hooks/useHoldings";

type HoldingsAllocationProps = {
  portfolioId?: number;
  portfolioLoading?: boolean;
  portfolioError?: boolean;
};

type AllocationItem = {
  name: string;
  symbol: string;
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

const formatCurrency = (value: number) => {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

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

  const allocationData = holdings
    .map((holding) => {
      const shares = Number(holding.shares);

      const latestPrice =
        holding.latest_price === null ? null : Number(holding.latest_price);

      const marketValue =
        Number.isFinite(shares) &&
        latestPrice !== null &&
        Number.isFinite(latestPrice)
          ? shares * latestPrice
          : null;

      if (marketValue === null || marketValue <= 0) {
        return null;
      }

      return {
        name: holding.company_name || holding.symbol,
        symbol: holding.symbol,
        value: marketValue,
      };
    })
    .filter(
      (
        item,
      ): item is {
        name: string;
        symbol: string;
        value: number;
      } => item !== null,
    );

  const totalMarketValue = allocationData.reduce(
    (total, item) => total + item.value,
    0,
  );

  const allocationWithPercentages: AllocationItem[] = allocationData.map(
    (item) => ({
      ...item,
      percentage:
        totalMarketValue > 0 ? (item.value / totalMarketValue) * 100 : 0,
    }),
  );

  return (
    <article className="hold-card">
      <div className="card-header">
        <h2>Holdings Allocation</h2>

        {totalMarketValue > 0 && (
          <span className="metric-label">
            {formatCurrency(totalMarketValue)}
          </span>
        )}
      </div>

      {isLoading && (
        <div className="dashboard-unavailable-state">
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
        holdings.length > 0 &&
        allocationWithPercentages.length === 0 && (
          <div className="dashboard-unavailable-state">
            <h3>Allocation unavailable</h3>

            <p>Latest prices are missing for the holdings in this portfolio.</p>
          </div>
        )}

      {!isLoading && !isError && allocationWithPercentages.length > 0 && (
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
                      key={`${item.symbol}-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, _name, context) => {
                    const payload = context.payload as AllocationItem;

                    return [
                      `${formatCurrency(
                        Number(value),
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
              <div
                key={`${item.symbol}-${index}`}
                className="allocation-legend-item"
              >
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
                  <span>{formatCurrency(item.value)}</span>
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
