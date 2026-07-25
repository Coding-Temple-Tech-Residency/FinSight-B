import {
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";

import { useLocation, useNavigate } from "react-router-dom";

import type { StockSearchResult } from "../../market/types/stock";

import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useStockSearch } from "../hooks/useStockSearch";

import StockSuggestionsDropdown from "./StockSuggestionsDropdown";

import "../styles/search.css";

interface SearchFormProps {
  closeSearch?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

const MINIMUM_QUERY_LENGTH = 2;
const DEFAULT_RESULT_LIMIT = 6;
const EMPTY_RESULTS: StockSearchResult[] = [];

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to search stocks.";
};

const SearchForm = ({
  closeSearch,
  placeholder = "Search portfolios, watchlists, stocks, and dashboard pages...",
  autoFocus = false,
}: SearchFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const inputId = useId();

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

  const debouncedQuery = useDebouncedValue(query, 300);
  const normalizedQuery = query.trim();
  const normalizedDebouncedQuery = debouncedQuery.trim();

  const hasValidQuery = normalizedQuery.length >= MINIMUM_QUERY_LENGTH;

  const stockSearchQuery = useStockSearch(
    normalizedDebouncedQuery,
    DEFAULT_RESULT_LIMIT,
  );

  const results = stockSearchQuery.data ?? EMPTY_RESULTS;

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

  const navigateToSearchResults = (searchQuery: string) => {
    const normalizedSearchQuery = searchQuery.trim();

    if (!normalizedSearchQuery) {
      return;
    }

    navigate(
      `/dashboard/search?q=${encodeURIComponent(normalizedSearchQuery)}`,
    );

    setIsDropdownOpen(false);
    setActiveIndex(-1);

    closeSearch?.();
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

  const handleSelect = (stock: StockSearchResult) => {
    const normalizedSymbol = stock.symbol.trim().toUpperCase();

    setQuery(
      stock.company_name
        ? `${normalizedSymbol} — ${stock.company_name}`
        : normalizedSymbol,
    );

    navigateToSearchResults(normalizedSymbol);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (activeIndex >= 0 && activeIndex < results.length) {
      handleSelect(results[activeIndex]);
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
    setIsDropdownOpen(false);
    setActiveIndex(-1);

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

      setIsDropdownOpen(false);
      setActiveIndex(-1);

      return;
    }

    if (!shouldShowDropdown || results.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setActiveIndex((currentIndex) => {
        if (currentIndex >= results.length - 1) {
          return 0;
        }

        return currentIndex + 1;
      });

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setActiveIndex((currentIndex) => {
        if (currentIndex <= 0) {
          return results.length - 1;
        }

        return currentIndex - 1;
      });

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
      handleSelect(results[activeIndex]);
    }
  };

  const activeDescendant =
    activeIndex >= 0 && results[activeIndex]
      ? `stock-search-result-${results[activeIndex].symbol}`
      : undefined;

  return (
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
            aria-controls={
              shouldShowDropdown ? "stock-search-suggestions" : undefined
            }
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
            <StockSuggestionsDropdown
              query={normalizedDebouncedQuery}
              results={results}
              activeIndex={activeIndex}
              isLoading={
                stockSearchQuery.isLoading || stockSearchQuery.isFetching
              }
              isError={stockSearchQuery.isError}
              errorMessage={
                stockSearchQuery.isError
                  ? getErrorMessage(stockSearchQuery.error)
                  : undefined
              }
              onSelect={handleSelect}
              onActiveIndexChange={setActiveIndex}
            />
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
  );
};

export default SearchForm;
