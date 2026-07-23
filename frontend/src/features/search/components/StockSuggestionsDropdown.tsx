import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

import type { StockSearchResult } from "../../market/types/stock";

interface StockSuggestionsDropdownProps {
  query: string;
  results: StockSearchResult[];
  activeIndex: number;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  renderContainer?: boolean;
  onSelect: (stock: StockSearchResult) => void;
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
            const isActive = index === activeIndex;

            const formattedPrice = formatPrice(stock.latest_price);

            return (
              <button
                key={stock.id ?? stock.symbol}
                id={`stock-search-result-${stock.symbol}`}
                type="button"
                role="option"
                aria-selected={isActive}
                className={`
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    text-left
                    text-(--text-primary)
                    transition
                    duration-150
                    ${
                      isActive
                        ? "bg-(--bg-secondary)"
                        : "hover:bg-(--bg-secondary)"
                    }
                  `}
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                onClick={() => {
                  onSelect(stock);
                }}
              >
                <div
                  className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-xl
                      bg-(--bg-secondary)
                    "
                >
                  {stock.company_logo_url ? (
                    <img
                      src={stock.company_logo_url}
                      alt=""
                      className="
                          h-full
                          w-full
                          object-contain
                          p-1
                        "
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faBuilding}
                      aria-hidden="true"
                      className="opacity-60"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm">{stock.symbol}</strong>

                    {stock.exchange && (
                      <span
                        className="
                            rounded-full
                            bg-(--bg-secondary)
                            px-2
                            py-0.5
                            text-[0.65rem]
                            font-bold
                            uppercase
                            opacity-70
                          "
                      >
                        {stock.exchange}
                      </span>
                    )}
                  </div>

                  <span
                    className="
                        mt-0.5
                        block
                        truncate
                        text-xs
                        opacity-65
                      "
                  >
                    {stock.company_name}
                  </span>
                </div>

                {formattedPrice && (
                  <span
                    className="
                        shrink-0
                        text-xs
                        font-semibold
                        opacity-80
                      "
                  >
                    {formattedPrice}
                  </span>
                )}
              </button>
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
