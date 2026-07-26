import { useSearchParams } from "react-router-dom";

import { useDashboard } from "../../dashboard/hooks/useDashboard";

import CompanyOverviewCard from "../components/CompanyOverviewCard";
import StockLineChart from "../components/StockLineChart";
import QuoteCard from "../components/StockQuoteCard";
import StockSearch from "../components/StockSearch";
import TrendingStocks from "../components/TrendingStocks";

import { useMarketHistory } from "../hooks/useMarketHistory";
import { useStockQuote } from "../hooks/useStockQuote";

import "../styles/market.css";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to load market data.";
};

const MarketPage = () => {
  const [searchParams] = useSearchParams();
  const { symbol } = useDashboard();

  const symbolFromUrl = searchParams.get("symbol")?.trim() ?? "";

  const normalizedSymbol = (symbolFromUrl || symbol).trim().toUpperCase();

  const quoteQuery = useStockQuote(normalizedSymbol);
  const historyQuery = useMarketHistory(normalizedSymbol, "daily");

  const hasQuoteError = quoteQuery.isError;
  const hasHistoryError = historyQuery.isError;

  return (
    <section className="market-page">
      <header className="market-header">
        <div className="market-header-content">
          <p className="market-eyebrow">Market research</p>

          <h1 className="market-title">Stock Market</h1>

          <p className="market-description">
            Search for a stock symbol to view its latest price, company
            information, historical performance, and broader market activity.
          </p>
        </div>

        <div className="market-search-container">
          <StockSearch
            key={normalizedSymbol}
            initialSymbol={normalizedSymbol}
          />
        </div>
      </header>

      {!normalizedSymbol ? (
        <section className="market-empty-state">
          <h2>Search for a stock</h2>

          <p>
            Enter a symbol such as AAPL, MSFT, NVDA, AMZN, or TSLA to view
            market information.
          </p>
        </section>
      ) : (
        <div className="market-content">
          <div className="market-summary-grid">
            <section className="market-panel market-quote-section">
              <div className="market-section-heading">
                <div>
                  <p className="market-section-eyebrow">Current quote</p>

                  <h2>{normalizedSymbol}</h2>
                </div>

                {(quoteQuery.isFetching || historyQuery.isFetching) && (
                  <span className="market-refresh-status">Refreshing…</span>
                )}
              </div>

              <QuoteCard
                quote={quoteQuery.data}
                loading={quoteQuery.isLoading}
                isError={hasQuoteError}
              />

              {hasQuoteError && (
                <p className="market-error-message" role="alert">
                  {getErrorMessage(quoteQuery.error)}
                </p>
              )}
            </section>

            <section className="market-panel market-overview-section">
              <div className="market-section-heading">
                <div>
                  <p className="market-section-eyebrow">Company information</p>

                  <h2>Overview</h2>
                </div>
              </div>

              <CompanyOverviewCard
                quote={quoteQuery.data}
                loading={quoteQuery.isLoading}
                isError={hasQuoteError}
              />
            </section>
          </div>

          <section className="market-panel market-chart-section">
            <div className="market-section-heading">
              <div>
                <p className="market-section-eyebrow">Historical data</p>

                <h2>Daily price history</h2>
              </div>
            </div>

            {historyQuery.isLoading ? (
              <div className="market-loading-state" role="status">
                <p>Loading price history...</p>
              </div>
            ) : hasHistoryError ? (
              <div className="market-error-state" role="alert">
                <h3>Price history unavailable</h3>

                <p>{getErrorMessage(historyQuery.error)}</p>
              </div>
            ) : (
              <StockLineChart data={historyQuery.data ?? []} />
            )}
          </section>

          <section className="market-panel market-trending-section">
            <div className="market-section-heading">
              <div>
                <p className="market-section-eyebrow">Market activity</p>

                <h2>Trending Stocks</h2>
              </div>
            </div>

            <TrendingStocks />
          </section>
        </div>
      )}
    </section>
  );
};

export default MarketPage;
