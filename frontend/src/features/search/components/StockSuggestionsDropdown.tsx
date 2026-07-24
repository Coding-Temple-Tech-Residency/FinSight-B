import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import type { StockSearchResult } from "../../market/types/stock";

import { highlightMatch } from "../utils/highlightMatch";
import { mapStockToSearchResult } from "../utils/mapStockToSearchResult";

import SearchResultItem from "./resultItem/SearchResultItem";
import SearchEmptyState from "./states/SearchEmptyState";
import SearchErrorState from "./states/SearchErrorState";
import SearchLoadingState from "./states/SearchLoadingState";

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
        <SearchLoadingState message="Searching companies and symbols..." />
      )}

      {!isLoading && isError && (
        <SearchErrorState
          title="Stock search is unavailable"
          message={
            errorMessage ?? "The stock search service could not be reached."
          }
          fallbackMessage="You can still enter a valid ticker and press Search."
        />
      )}

      {!isLoading && !isError && !hasResults && (
        <SearchEmptyState
          title="No matching stocks found"
          description="Try a company name such as Apple or a symbol such as AAPL."
        />
      )}

      {!isLoading && !isError && hasResults && (
        <div
          role="listbox"
          aria-label="Stock search suggestions"
          className="flex flex-col gap-1 p-2"
        >
          {results.map((stock, index) => {
            const searchResult = mapStockToSearchResult(stock);

            return (
              <SearchResultItem
                key={searchResult.id}
                id={searchResult.id}
                title={highlightMatch(searchResult.title, normalizedQuery)}
                subtitle={
                  searchResult.subtitle
                    ? highlightMatch(searchResult.subtitle, normalizedQuery)
                    : undefined
                }
                badge={searchResult.badge}
                image={searchResult.image}
                imageAlt={
                  searchResult.image && searchResult.subtitle
                    ? `${searchResult.subtitle} logo`
                    : ""
                }
                trailing={searchResult.trailing}
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
