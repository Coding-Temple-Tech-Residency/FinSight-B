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
    if (expanded) {
      inputRef.current?.focus();
    }
  }, [expanded]);

  return (
    <form
      className={`
    flex items-center
  
    rounded-4xl
    overflow-hidden
    transition-all duration-300 ease-in-out
    ${expanded ? "w-72 px-3 py-2 bg-stone-100" : "w-12 p-2 "} ${!isDesktop ? "sticky top-[70px] left-0 bg-[var(--bg-primary)] rounded-none min-w-screen z-90" : ""}
  `}
    >
      <button
        type="button"
        onClick={() => {
          if (isDesktop) {
            setIsExpanded(true);
          }
        }}
        className="shrink-0"
      >
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className={`${expanded ? "text-stone-700" : "text-stone-50"} cursor-pointer`}
        />
      </button>

      <input
        ref={inputRef}
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onBlur={() => {
          if (isDesktop && !search.trim()) {
            setIsExpanded(false);
          }
        }}
        placeholder="Search stocks, companies..."
        className={`
          ml-3
          flex-1
          bg-transparent
          outline-none
          text-stone-700
          transition-all
          duration-300
          ${
            expanded
              ? "w-full opacity-100"
              : "w-0 opacity-0 pointer-events-none"
          }
        `}
      />
    </form>
  );
};

export default SearchForm;
