import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";

import { useLocation, useNavigate } from "react-router-dom";
import "./SearchForm.css";

interface SearchFormProps {
  closeSearch?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

const SearchForm = ({
  closeSearch,
  placeholder = "Search FinSight...",
  autoFocus = false,
}: SearchFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const currentQuery =
    location.pathname === "/dashboard/search"
      ? (new URLSearchParams(location.search).get("q") ?? "")
      : "";

  const [query, setQuery] = useState(currentQuery);

  useEffect(() => {
    setQuery(currentQuery);
  }, [currentQuery]);

  useEffect(() => {
    if (!autoFocus) return;

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, [autoFocus]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedQuery = query.trim();

    if (!normalizedQuery) return;

    navigate(`/dashboard/search?q=${encodeURIComponent(normalizedQuery)}`);

    closeSearch?.();
  };

  const handleClear = () => {
    setQuery("");

    if (location.pathname === "/dashboard/search") {
      navigate("/dashboard/search", {
        replace: true,
      });
    }

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  return (
    <form className="search-form" role="search" onSubmit={handleSubmit}>
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
          onChange={handleChange}
        />

        {query.length > 0 && (
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
        disabled={!query.trim()}
      >
        Search
      </button>
    </form>
  );
};

export default SearchForm;
