import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import type { StockSearchResult } from "../../market/types/stock";

import SearchResultItem from "./resultItem/SearchResultItem";
import { highlightMatch } from "../utils/highlightMatch";

interface StockSuggestionsDropdownProps {
  query: string;
  results: StockSearchResult[];
  activeIndex: number;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  renderContainer?: boolean;
  onSelect: (stock: StockSearchResult) => void;
  onActiveIndexChange?: (index: number) => void;
}

const formatPrice = (value: number | string | null | undefined) => {
  if (value === null || value === undefined) {
    return null;
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return null;
  }

  return numericValue.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

const StockSuggestionsDropdown = ({
  query,
  results,
  activeIndex,
  isLoading,
  isError,
  errorMessage,
  renderContainer = true,
  onSelect,
  onActiveIndexChange,
}: StockSuggestionsDropdownProps) => {
  const normalizedQuery = query.trim();
  const hasResults = results.length > 0;

  const content = (
    <>
      <div
        className="
          flex
          items-center
          gap-2
          border-b
          border-white/10
          px-4
          py-3
          text-xs
          text-(--text-primary)
        "
      >
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          aria-hidden="true"
          className="opacity-60"
        />

        <span className="min-w-0 truncate">
          Searching stocks for{" "}
          <strong className="text-(--accent-primary)">
            “{normalizedQuery}”
          </strong>
        </span>
      </div>

      {isLoading && (
        <div
          className="
            flex
            items-center
            gap-3
            px-4
            py-5
            text-sm
            text-(--text-primary)
          "
          role="status"
        >
          <span
            className="
              h-4
              w-4
              animate-spin
              rounded-full
              border-2
              border-current
              border-r-transparent
              opacity-70
            "
            aria-hidden="true"
          />

          <span>Searching companies and symbols...</span>
        </div>
      )}

      {!isLoading && isError && (
        <div
          className="
            flex
            flex-col
            gap-2
            px-4
            py-5
            text-(--text-primary)
          "
          role="alert"
        >
          <strong className="negative text-sm">
            Stock search is unavailable
          </strong>

          <span className="text-xs leading-5 opacity-70">
            {errorMessage ?? "The stock search service could not be reached."}
          </span>

          <span className="text-xs leading-5 opacity-70">
            You can still enter a valid ticker and press Search.
          </span>
        </div>
      )}

      {!isLoading && !isError && !hasResults && (
        <div
          className="
            flex
            flex-col
            gap-2
            px-4
            py-5
            text-(--text-primary)
          "
        >
          <strong className="text-sm">No matching stocks found</strong>

          <span className="text-xs leading-5 opacity-70">
            Try a company name such as Apple or a symbol such as AAPL.
          </span>
        </div>
      )}

      {!isLoading && !isError && hasResults && (
        <div
          role="listbox"
          aria-label="Stock search suggestions"
          className="flex flex-col gap-1 p-2"
        >
          {results.map((stock, index) => {
            const formattedPrice = formatPrice(stock.latest_price);

            return (
              <SearchResultItem
                key={stock.id ?? stock.symbol}
                id={`stock-search-result-${stock.symbol}`}
                title={highlightMatch(stock.symbol, normalizedQuery)}
                subtitle={highlightMatch(stock.company_name, normalizedQuery)}
                badge={stock.exchange}
                image={stock.company_logo_url}
                imageAlt={
                  stock.company_logo_url ? `${stock.company_name} logo` : ""
                }
                trailing={formattedPrice}
                selected={index === activeIndex}
                onMouseEnter={() => {
                  onActiveIndexChange?.(index);
                }}
                onClick={() => {
                  onSelect(stock);
                }}
              />
            );
          })}
        </div>
      )}
    </>
  );

  if (!renderContainer) {
    return content;
  }

  return (
    <div
      id="stock-search-suggestions"
      className="
        absolute
        top-[calc(100%+0.5rem)]
        left-0
        z-200
        max-h-[min(420px,calc(100vh-180px))]
        w-full
        overflow-y-auto
        rounded-2xl
        border
        border-white/10
        bg-(--bg-primary)
        shadow-2xl
      "
    >
      {content}
    </div>
  );
};

export default StockSuggestionsDropdown;
