import {
  type ChangeEvent,
  type FormEvent,
  useId,
  useRef,
  useState,
} from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";

import { useLocation, useNavigate } from "react-router-dom";

import "../styles/search.css";

interface SearchFormProps {
  closeSearch?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

const SearchForm = ({
  closeSearch,
  placeholder = "Search portfolios, watchlists, stocks, and dashboard pages...",
  autoFocus = false,
}: SearchFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const searchParams = new URLSearchParams(location.search);

  const currentQuery =
    location.pathname === "/dashboard/search"
      ? (searchParams.get("q") ?? "")
      : "";

  const [query, setQuery] = useState(currentQuery);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      inputRef.current?.focus();
      return;
    }

    navigate(`/dashboard/search?q=${encodeURIComponent(normalizedQuery)}`);

    closeSearch?.();
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();

    if (location.pathname === "/dashboard/search") {
      navigate("/dashboard/search", {
        replace: true,
      });
    }
  };

  return (
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
          onChange={handleChange}
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
      </div>

      <button
        type="submit"
        className="search-submit-button"
        aria-label="Submit search"
        disabled={!query.trim()}
      >
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="search-submit-icon"
          aria-hidden="true"
        />

        <span className="search-submit-text">Search</span>
      </button>
    </form>
  );
};

export default SearchForm;
