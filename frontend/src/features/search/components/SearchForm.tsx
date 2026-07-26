import {
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";

import { useLocation, useNavigate } from "react-router-dom";

import StockDetailsModal from "../../market/components/StockDetailsModal";

import type { StockSearchResult } from "../../market/types/stock";
import type { SearchResultType, UniversalSearchResult } from "../types/search";

import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useUniversalSearch } from "../hooks/useUniversalSearch";

import SearchResultGroup, {
  type IndexedSearchResult,
} from "./SearchResultGroup";
import SearchEmptyState from "./states/SearchEmptyState";
import SearchErrorState from "./states/SearchErrorState";
import SearchLoadingState from "./states/SearchLoadingState";

import "../styles/search.css";

interface SearchFormProps {
  closeSearch?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

interface SearchResultGroupData {
  type: SearchResultType;
  label: string;
  results: IndexedSearchResult[];
}

const MINIMUM_QUERY_LENGTH = 2;

const RESULT_GROUPS: Array<{
  type: SearchResultType;
  label: string;
}> = [
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
    label: "Pages and Features",
  },
  {
    type: "ai",
    label: "AI",
  },
];

const EMPTY_RESULTS: UniversalSearchResult[] = [];

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to search the FinSight platform.";
};

const isStockSearchResult = (value: unknown): value is StockSearchResult => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const possibleStock = value as Partial<StockSearchResult>;

  return (
    typeof possibleStock.symbol === "string" &&
    typeof possibleStock.company_name === "string"
  );
};

const SearchForm = ({
  closeSearch,
  placeholder = "Search portfolios, watchlists, stocks, and dashboard pages...",
  autoFocus = false,
}: SearchFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const inputId = useId();
  const listboxId = useId();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchParams = new URLSearchParams(location.search);

  const currentQuery =
    location.pathname === "/dashboard/search"
      ? (searchParams.get("q") ?? "")
      : "";

  const [query, setQuery] = useState(currentQuery);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectedStock, setSelectedStock] = useState<StockSearchResult | null>(
    null,
  );

  const debouncedQuery = useDebouncedValue(query, 300);

  const normalizedQuery = query.trim();
  const normalizedDebouncedQuery = debouncedQuery.trim();

  const hasValidQuery = normalizedQuery.length >= MINIMUM_QUERY_LENGTH;

  const universalSearchQuery = useUniversalSearch(normalizedDebouncedQuery);

  const results = universalSearchQuery.data ?? EMPTY_RESULTS;

  const groupedResults = useMemo<SearchResultGroupData[]>(() => {
    return RESULT_GROUPS.map((group) => ({
      ...group,
      results: results
        .map((result, index) => ({
          result,
          index,
        }))
        .filter(({ result }) => result.type === group.type),
    })).filter((group) => group.results.length > 0);
  }, [results]);

  const shouldShowDropdown = isDropdownOpen && hasValidQuery;

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (!containerRef.current?.contains(target)) {
        setIsDropdownOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const closeDropdown = () => {
    setIsDropdownOpen(false);
    setActiveIndex(-1);
  };

  const navigateToSearchResults = (searchQuery: string) => {
    const normalizedSearchQuery = searchQuery.trim();

    if (!normalizedSearchQuery) {
      return;
    }

    navigate(
      `/dashboard/search?q=${encodeURIComponent(normalizedSearchQuery)}`,
    );

    closeDropdown();
    closeSearch?.();
  };

  const openStockModal = (result: UniversalSearchResult): boolean => {
    if (result.type !== "stock" || !isStockSearchResult(result.data)) {
      return false;
    }

    closeDropdown();
    setSelectedStock(result.data);

    return true;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextQuery = event.target.value;

    setQuery(nextQuery);
    setActiveIndex(-1);
    setIsDropdownOpen(nextQuery.trim().length >= MINIMUM_QUERY_LENGTH);
  };

  const handleFocus = () => {
    if (hasValidQuery) {
      setIsDropdownOpen(true);
    }
  };

  const handleResultSelect = (result: UniversalSearchResult) => {
    if (openStockModal(result)) {
      return;
    }

    closeDropdown();
    closeSearch?.();

    if (result.href) {
      navigate(result.href);
      return;
    }

    navigateToSearchResults(result.title);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const activeResult = results[activeIndex];

    if (activeResult) {
      handleResultSelect(activeResult);
      return;
    }

    if (!normalizedQuery) {
      inputRef.current?.focus();
      return;
    }

    navigateToSearchResults(normalizedQuery);
  };

  const handleClear = () => {
    setQuery("");
    closeDropdown();

    inputRef.current?.focus();

    if (location.pathname === "/dashboard/search") {
      navigate("/dashboard/search", {
        replace: true,
      });
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeDropdown();
      return;
    }

    if (!shouldShowDropdown || results.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setActiveIndex((currentIndex) =>
        currentIndex >= results.length - 1 ? 0 : currentIndex + 1,
      );

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setActiveIndex((currentIndex) =>
        currentIndex <= 0 ? results.length - 1 : currentIndex - 1,
      );

      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(results.length - 1);
      return;
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();

      const selectedResult = results[activeIndex];

      if (selectedResult) {
        handleResultSelect(selectedResult);
      }
    }
  };

  const handleCloseStockModal = () => {
    setSelectedStock(null);
  };

  const handleViewStockMarket = (symbol: string) => {
    const normalizedSymbol = symbol.trim().toUpperCase();

    if (!normalizedSymbol) {
      return;
    }

    setSelectedStock(null);
    closeDropdown();
    closeSearch?.();

    navigate(
      `/dashboard/market?symbol=${encodeURIComponent(normalizedSymbol)}`,
    );
  };

  const activeResult = results[activeIndex];

  const activeDescendant = activeResult
    ? `universal-search-result-${activeResult.id}`
    : undefined;

  const isLoading =
    universalSearchQuery.isLoading || universalSearchQuery.isFetching;

  const isError = universalSearchQuery.isError;

  const hasResults = results.length > 0;

  return (
    <>
      <div ref={containerRef} className="search-autocomplete-container">
        <form className="search-form" role="search" onSubmit={handleSubmit}>
          <div className="search-input-wrapper">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="search-form-icon"
              aria-hidden="true"
            />

            <label htmlFor={inputId} className="sr-only">
              Search the FinSight platform
            </label>

            <input
              ref={inputRef}
              id={inputId}
              name="platform-search"
              type="search"
              value={query}
              placeholder={placeholder}
              autoComplete="off"
              autoFocus={autoFocus}
              spellCheck={false}
              aria-autocomplete="list"
              aria-expanded={shouldShowDropdown}
              aria-controls={shouldShowDropdown ? listboxId : undefined}
              aria-activedescendant={activeDescendant}
              onChange={handleChange}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
            />

            {query && (
              <button
                type="button"
                className="search-clear-button"
                aria-label="Clear search"
                onClick={handleClear}
              >
                <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
              </button>
            )}

            {shouldShowDropdown && (
              <div
                id={listboxId}
                role="listbox"
                aria-label="FinSight search results"
                className="
                  search-suggestions-dropdown
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
                {isLoading && (
                  <SearchLoadingState
                    message={`Searching FinSight for “${normalizedDebouncedQuery}”...`}
                  />
                )}

                {!isLoading && isError && (
                  <SearchErrorState
                    title="Search is unavailable"
                    message={getErrorMessage(universalSearchQuery.error)}
                    fallbackMessage="Please try your search again."
                  />
                )}

                {!isLoading &&
                  !isError &&
                  normalizedDebouncedQuery.length >= MINIMUM_QUERY_LENGTH &&
                  !hasResults && (
                    <SearchEmptyState
                      title="No results found"
                      description={`No FinSight results matched “${normalizedDebouncedQuery}”.`}
                    />
                  )}

                {!isLoading &&
                  !isError &&
                  hasResults &&
                  groupedResults.map((group) => (
                    <SearchResultGroup
                      key={group.type}
                      label={group.label}
                      query={normalizedDebouncedQuery}
                      results={group.results}
                      activeIndex={activeIndex}
                      onResultSelect={handleResultSelect}
                      onActiveIndexChange={setActiveIndex}
                    />
                  ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="search-submit-button"
            aria-label="Submit search"
            disabled={!normalizedQuery}
          >
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="search-submit-icon"
              aria-hidden="true"
            />

            <span className="search-submit-text">Search</span>
          </button>
        </form>
      </div>

      <StockDetailsModal
        stock={selectedStock}
        isOpen={selectedStock !== null}
        onClose={handleCloseStockModal}
        onViewMarket={handleViewStockMarket}
      />
    </>
  );
};

export default SearchForm;
