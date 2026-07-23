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

import SearchResultsDropdown from "../../features/search/components/SearchResultsDropdown";
import { useDebouncedValue } from "../../features/search/hooks/useDebouncedValue";
import { usePlatformSearch } from "../../features/search/hooks/usePlatformSearch";
import type { PlatformSearchResult } from "../../features/search/types/search";

import "./SearchForm.css";

interface SearchFormProps {
  closeSearch?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

const MAX_INSTANT_RESULTS = 6;
const MINIMUM_QUERY_LENGTH = 2;

const SearchForm = ({
  closeSearch,
  placeholder = "Search FinSight...",
  autoFocus = false,
}: SearchFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const inputId = useId();

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentQuery =
    location.pathname === "/dashboard/search"
      ? (new URLSearchParams(location.search).get("q") ?? "")
      : "";

  const [query, setQuery] = useState(() => currentQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const debouncedQuery = useDebouncedValue(query, 250);
  const normalizedDebouncedQuery = debouncedQuery.trim();

  const { results } = usePlatformSearch(normalizedDebouncedQuery);

  const instantResults = results.slice(0, MAX_INSTANT_RESULTS);

  const hasValidQuery = normalizedDebouncedQuery.length >= MINIMUM_QUERY_LENGTH;

  const shouldShowDropdown = isFocused && isDropdownOpen && hasValidQuery;

  useEffect(() => {
    if (!autoFocus) return;

    const frameId = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [autoFocus]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (!formRef.current?.contains(target)) {
        setIsDropdownOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const openSearchResultsPage = (searchQuery: string) => {
    const normalizedQuery = searchQuery.trim();

    if (!normalizedQuery) return;

    setIsDropdownOpen(false);
    setActiveIndex(-1);

    navigate(`/dashboard/search?q=${encodeURIComponent(normalizedQuery)}`);

    closeSearch?.();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextQuery = event.target.value;

    setQuery(nextQuery);
    setActiveIndex(-1);
    setIsDropdownOpen(nextQuery.trim().length >= MINIMUM_QUERY_LENGTH);
  };

  const handleFocus = () => {
    setIsFocused(true);

    if (query.trim().length >= MINIMUM_QUERY_LENGTH) {
      setIsDropdownOpen(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (activeIndex >= 0 && activeIndex < instantResults.length) {
      handleResultSelect(instantResults[activeIndex]);
      return;
    }

    openSearchResultsPage(query);
  };

  const handleResultSelect = (result: PlatformSearchResult) => {
    setQuery("");
    setIsDropdownOpen(false);
    setActiveIndex(-1);

    navigate(result.path);

    closeSearch?.();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();

      setIsDropdownOpen(false);
      setActiveIndex(-1);

      return;
    }

    if (!shouldShowDropdown || instantResults.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setActiveIndex((currentIndex) => {
        if (currentIndex >= instantResults.length - 1) {
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
          return instantResults.length - 1;
        }

        return currentIndex - 1;
      });

      return;
    }

    if (
      event.key === "Enter" &&
      activeIndex >= 0 &&
      activeIndex < instantResults.length
    ) {
      event.preventDefault();
      handleResultSelect(instantResults[activeIndex]);
    }
  };

  const handleClear = () => {
    setQuery("");
    setIsDropdownOpen(false);
    setActiveIndex(-1);

    if (location.pathname === "/dashboard/search") {
      navigate("/dashboard/search", {
        replace: true,
      });
    }

    window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  return (
    <form
      ref={formRef}
      className="search-form"
      role="search"
      onSubmit={handleSubmit}
    >
      <div className="search-field relative flex-1 min-w-0">
        <label htmlFor={inputId} className="sr-only">
          Search the FinSight platform
        </label>

        <div className="search-input-wrapper">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="search-form-icon"
            aria-hidden="true"
          />

          <input
            ref={inputRef}
            id={inputId}
            name="platform-search"
            type="search"
            value={query}
            placeholder={placeholder}
            autoComplete="off"
            aria-autocomplete="list"
            aria-controls={
              shouldShowDropdown ? "instant-search-results" : undefined
            }
            aria-expanded={shouldShowDropdown}
            aria-activedescendant={
              activeIndex >= 0
                ? `instant-search-result-${instantResults[activeIndex]?.id}`
                : undefined
            }
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />

          {query.length > 0 && (
            <button
              type="button"
              className="search-clear-button"
              aria-label="Clear search"
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              onClick={handleClear}
            >
              <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
            </button>
          )}
        </div>

        {shouldShowDropdown && (
          <SearchResultsDropdown
            query={normalizedDebouncedQuery}
            results={instantResults}
            activeIndex={activeIndex}
            onResultSelect={handleResultSelect}
            onViewAll={() => {
              openSearchResultsPage(query);
            }}
          />
        )}
      </div>

      <button
        type="submit"
        className="search-submit-button"
        disabled={!query.trim()}
      >
        Search
      </button>
    </form>
  );
};

export default SearchForm;
