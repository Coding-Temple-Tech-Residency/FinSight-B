import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

import type { SearchResultType, UniversalSearchResult } from "../types/search";

import SearchResultGroup, {
  type IndexedSearchResult,
} from "./SearchResultGroup";
import SearchEmptyState from "./states/SearchEmptyState";
import SearchErrorState from "./states/SearchErrorState";
import SearchLoadingState from "./states/SearchLoadingState";

interface UniversalSearchDropdownProps {
  query: string;
  results: UniversalSearchResult[];
  activeIndex: number;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  renderContainer?: boolean;
  onResultSelect: (result: UniversalSearchResult) => void;
  onActiveIndexChange?: (index: number) => void;
  onViewAll?: () => void;
}

interface SearchResultGroupDefinition {
  type: SearchResultType;
  label: string;
}

const SEARCH_RESULT_GROUPS: SearchResultGroupDefinition[] = [
  {
    type: "stock",
    label: "Stocks",
  },
  {
    type: "portfolio",
    label: "Portfolios",
  },
  {
    type: "watchlist",
    label: "Watchlists",
  },
  {
    type: "page",
    label: "Pages",
  },
  {
    type: "ai",
    label: "AI",
  },
];

const groupResults = (
  results: UniversalSearchResult[],
): Map<SearchResultType, IndexedSearchResult[]> => {
  const groupedResults = new Map<SearchResultType, IndexedSearchResult[]>();

  results.forEach((result, index) => {
    const currentGroup = groupedResults.get(result.type) ?? [];

    currentGroup.push({
      result,
      index,
    });

    groupedResults.set(result.type, currentGroup);
  });

  return groupedResults;
};

const UniversalSearchDropdown = ({
  query,
  results,
  activeIndex,
  isLoading = false,
  isError = false,
  errorMessage,
  renderContainer = true,
  onResultSelect,
  onActiveIndexChange,
  onViewAll,
}: UniversalSearchDropdownProps) => {
  const normalizedQuery = query.trim();
  const hasResults = results.length > 0;

  const groupedResults = groupResults(results);

  const content = (
    <>
      <div
        className="
          flex
          items-center
          justify-between
          gap-3
          border-b
          border-white/10
          px-4
          py-3
          text-xs
          text-(--text-primary)
        "
      >
        <div className="flex min-w-0 items-center gap-2">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            aria-hidden="true"
            className="shrink-0 opacity-60"
          />

          <span className="min-w-0 truncate">
            Search results for{" "}
            <strong className="text-(--accent-primary)">
              “{normalizedQuery}”
            </strong>
          </span>
        </div>

        {!isLoading && !isError && hasResults && (
          <span className="shrink-0 font-bold opacity-60">
            {results.length}
          </span>
        )}
      </div>

      {isLoading && <SearchLoadingState message="Searching FinSight..." />}

      {!isLoading && isError && (
        <SearchErrorState
          title="Search is unavailable"
          message={errorMessage ?? "FinSight could not complete your search."}
          fallbackMessage="Please try your search again."
        />
      )}

      {!isLoading && !isError && !hasResults && (
        <SearchEmptyState
          title="No matching results found"
          description="Try a stock symbol, company, page, portfolio, watchlist, or AI feature."
        />
      )}

      {!isLoading && !isError && hasResults && (
        <div role="listbox" aria-label="Universal search results">
          {SEARCH_RESULT_GROUPS.map((group) => (
            <SearchResultGroup
              key={group.type}
              label={group.label}
              query={normalizedQuery}
              results={groupedResults.get(group.type) ?? []}
              activeIndex={activeIndex}
              onResultSelect={onResultSelect}
              onActiveIndexChange={onActiveIndexChange}
            />
          ))}
        </div>
      )}

      {!isLoading && !isError && hasResults && onViewAll && (
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onClick={onViewAll}
          className="
              flex
              w-full
              items-center
              justify-between
              gap-4
              rounded-b-2xl
              border-t
              border-white/10
              bg-(--bg-secondary)
              px-4
              py-3
              text-left
              text-xs
              font-bold
              text-(--accent-primary)
              transition
              hover:brightness-110
              focus-visible:outline-2
              focus-visible:outline-(--accent-primary)
              focus-visible:-outline-offset-2
            "
        >
          <span className="min-w-0 truncate">
            View all results for “{normalizedQuery}”
          </span>

          <FontAwesomeIcon
            icon={faArrowRight}
            aria-hidden="true"
            className="shrink-0"
          />
        </button>
      )}
    </>
  );

  if (!renderContainer) {
    return content;
  }

  return (
    <div
      id="universal-search-results"
      className="
        absolute
        top-[calc(100%+0.5rem)]
        left-0
        z-200
        max-h-[min(500px,calc(100vh-180px))]
        w-full
        overflow-y-auto
        rounded-2xl
        border
        border-white/10
        bg-(--bg-primary)
        shadow-2xl
        backdrop-blur-xl
      "
    >
      {content}
    </div>
  );
};

export default UniversalSearchDropdown;
