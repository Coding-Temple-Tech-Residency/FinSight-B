import { type ChangeEvent, type FormEvent, useRef, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";

import { useLocation, useNavigate } from "react-router-dom";

interface SearchFormProps {
  closeSearch?: () => void;
  placeholder?: string;
}

const SearchForm = ({
  closeSearch,
  placeholder = "Search FinSight...",
}: SearchFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();

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
      <FontAwesomeIcon icon={faMagnifyingGlass} aria-hidden="true" />

      <label htmlFor="platform-search" className="sr-only">
        Search the FinSight platform
      </label>

      <input
        ref={inputRef}
        id="platform-search"
        name="platform-search"
        type="search"
        value={query}
        placeholder={placeholder}
        autoComplete="off"
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

      <button
        type="submit"
        className="search-submit-button"
        aria-label="Submit search"
        disabled={!query.trim()}
      >
        Search
      </button>
    </form>
  );
};

export default SearchForm;
