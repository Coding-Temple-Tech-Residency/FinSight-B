import { useNavigate } from "react-router-dom";

import { useDashboard } from "../../dashboard/hooks/useDashboard";

import { useTrendingStocks } from "../hooks/useTrendingStocks";

import type { TrendingCategory, TrendingStock } from "../types/trending";

import "./TrendingStocks.css";

type TrendingGroupProps = {
  title: string;
  description: string;
  stocks: TrendingStock[];
  category: TrendingCategory;
  onSelectStock: (symbol: string) => void;
};

const formatCurrency = (value: number | null) => {
  if (value === null) {
    return "Unavailable";
  }

  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

const formatPercentage = (value: number | null) => {
  if (value === null) {
    return "Unavailable";
  }

  const prefix = value > 0 ? "+" : "";

  return `${prefix}${value.toFixed(2)}%`;
};

const formatVolume = (value: number | null) => {
  if (value === null) {
    return "Unavailable";
  }

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

const TrendingGroup = ({
  title,
  description,
  stocks,
  category,
  onSelectStock,
}: TrendingGroupProps) => {
  return (
    <article className="trending-group">
      <header className="trending-group__header">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </header>

      {stocks.length === 0 ? (
        <p className="trending-group__empty">
          No stocks are currently available.
        </p>
      ) : (
        <div className="trending-table-wrapper">
          <table className="trending-table">
            <thead>
              <tr>
                <th scope="col">Stock</th>
                <th scope="col">Price</th>

                {category === "active" ? (
                  <th scope="col">Volume</th>
                ) : (
                  <th scope="col">Change</th>
                )}
              </tr>
            </thead>

            <tbody>
              {stocks.map((stock) => {
                const changeClassName =
                  stock.percentage_change === null
                    ? ""
                    : stock.percentage_change >= 0
                      ? "trending-change--positive"
                      : "trending-change--negative";

                return (
                  <tr key={`${category}-${stock.symbol}`}>
                    <td>
                      <button
                        type="button"
                        className="trending-stock-button"
                        onClick={() => onSelectStock(stock.symbol)}
                        aria-label={`View ${
                          stock.company_name?.trim() || stock.symbol
                        } (${stock.symbol}) market data`}
                      >
                        <span className="trending-stock-rank">
                          {stock.rank}
                        </span>

                        <span className="trending-stock-identity">
                          <strong>
                            {stock.company_name?.trim()
                              ? `${stock.company_name.trim()} (${stock.symbol})`
                              : stock.symbol}
                          </strong>
                        </span>
                      </button>
                    </td>

                    <td>{formatCurrency(stock.price)}</td>

                    <td
                      className={category === "active" ? "" : changeClassName}
                    >
                      {category === "active"
                        ? formatVolume(stock.volume)
                        : formatPercentage(stock.percentage_change)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
};

const TrendingStocks = () => {
  const navigate = useNavigate();
  const { setSymbol } = useDashboard();

  const { data, isLoading, isFetching, isError, error, refetch } =
    useTrendingStocks();

  const handleSelectStock = (symbol: string) => {
    const normalizedSymbol = symbol.trim().toUpperCase();

    if (!normalizedSymbol) {
      return;
    }

    setSymbol(normalizedSymbol);

    navigate(
      `/dashboard/market?symbol=${encodeURIComponent(normalizedSymbol)}`,
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return (
      <div className="trending-loading" role="status">
        <div className="trending-loading__skeleton" />
        <div className="trending-loading__skeleton" />
        <div className="trending-loading__skeleton" />

        <span className="sr-only">Loading trending stocks...</span>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="trending-error" role="alert">
        <div>
          <h3>Trending stocks unavailable</h3>

          <p>
            {error instanceof Error
              ? error.message
              : "Unable to load trending market data."}
          </p>
        </div>

        <button type="button" onClick={() => refetch()}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="trending-stocks">
      <div className="trending-stocks__meta">
        {data.lastUpdated && (
          <p>
            Last updated: {new Date(data.lastUpdated).toLocaleString("en-US")}
          </p>
        )}

        {isFetching && <span role="status">Refreshing...</span>}
      </div>

      <div className="trending-stocks__grid">
        <TrendingGroup
          title="Top Gainers"
          description="Stocks with the strongest positive movement."
          stocks={data.topGainers}
          category="gainer"
          onSelectStock={handleSelectStock}
        />

        <TrendingGroup
          title="Top Losers"
          description="Stocks with the largest negative movement."
          stocks={data.topLosers}
          category="loser"
          onSelectStock={handleSelectStock}
        />

        <TrendingGroup
          title="Most Active"
          description="Stocks with the highest trading activity."
          stocks={data.mostActive}
          category="active"
          onSelectStock={handleSelectStock}
        />
      </div>
    </div>
  );
};

export default TrendingStocks;
