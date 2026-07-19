import QuoteCard from "../components/QuoteCard";
import StockLineChart from "../components/StockLineChart";
import StockSearch from "../components/StockSearch";

import { useMarketHistory } from "../hooks/useMarketHistory";
import { useStockQuote } from "../hooks/useStockQuote";
import { useDashboard } from "../../dashboard/hooks/useDashboard";

import "../styles/market.css";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to load market data.";
};

const Market = () => {
  const { symbol } = useDashboard();

  const normalizedSymbol = symbol.trim().toUpperCase();

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
            Search for a stock symbol to view its latest price and historical
            daily performance.
          </p>
        </div>

        <div className="market-search-container">
          <StockSearch />
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
          <section className="market-quote-section">
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

          <section className="market-chart-section">
            <div className="market-section-heading">
              <div>
                <p className="market-section-eyebrow">Historical data</p>

                <h2>Daily price history</h2>
              </div>
            </div>

            {historyQuery.isLoading ? (
              <div className="market-loading-state">
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
        </div>
      )}
    </section>
  );
};

export default Market;
