import { useEffect, useRef, useState } from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useBreakpoint } from "../hooks/useBreakingPoint";

const SearchForm = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { isDesktop } = useBreakpoint();

  const expanded = !isDesktop || isExpanded;

  useEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);

  return (
    <form
      className={`
        search-form
        ${expanded ? "search-form-expanded" : "search-form-collapsed"}
      `}
    >
      <button
        type="button"
        onClick={() => {
          if (isDesktop) setIsExpanded(true);
        }}
        className="shrink-0"
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>

      <input
        ref={inputRef}
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onBlur={() => {
          if (isDesktop && !search.trim()) setIsExpanded(false);
        }}
        placeholder="Search stocks, companies..."
      />
    </form>
  );
};

export default SearchForm;
