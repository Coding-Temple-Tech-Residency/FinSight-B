import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import type { PlatformSearchResult } from "../types/search";

interface SearchResultsDropdownProps {
  query: string;
  results: PlatformSearchResult[];
  activeIndex: number;
  onResultSelect: (result: PlatformSearchResult) => void;
  onViewAll: () => void;
}

const formatCategory = (category: PlatformSearchResult["category"]) => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

const SearchResultsDropdown = ({
  query,
  results,
  activeIndex,
  onResultSelect,
  onViewAll,
}: SearchResultsDropdownProps) => {
  const hasResults = results.length > 0;

  return (
    <div
      id="instant-search-results"
      role="listbox"
      aria-label="Search suggestions"
      className="
        absolute
        top-[calc(100%+0.75rem)]
        left-0
        z-200
        w-full
        max-h-[min(500px,calc(100vh-160px))]
        overflow-y-auto
        rounded-2xl
        border
        border-white/10
        bg-(--bg-primary)
        shadow-2xl
        backdrop-blur-xl
        animate-in
        fade-in
        slide-in-from-top-2
        duration-200
      "
    >
      <div
        className="
          flex
          items-center
          gap-1
          border-b
          border-white/10
          px-4
          py-3
          text-xs
          font-bold
          text-(--text-primary)
        "
      >
        <span>
          {hasResults
            ? `${results.length} result${results.length === 1 ? "" : "s"}`
            : "No results"}
        </span>

        <span
          className="
            min-w-0
            overflow-hidden
            text-ellipsis
            whitespace-nowrap
            text-(--accent-primary)
          "
        >
          for &ldquo;{query}&rdquo;
        </span>
      </div>

      {hasResults ? (
        <>
          <div className="flex flex-col gap-1 p-2">
            {results.map((result, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={result.id}
                  id={`instant-search-result-${result.id}`}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onMouseDown={(event) => {
                    event.preventDefault();
                  }}
                  onClick={() => {
                    onResultSelect(result);
                  }}
                  className={`
                    grid
                    w-full
                    grid-cols-[40px_minmax(0,1fr)_18px]
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    text-left
                    text-(--text-primary)
                    transition
                    duration-150
                    hover:bg-(--bg-secondary)
                    focus-visible:outline-2
                    focus-visible:outline-(--accent-primary)
                    focus-visible:outline-offset-2
                    ${isActive ? "bg-(--bg-secondary)" : "bg-transparent"}
                  `}
                >
                  <span
                    className="
                      flex
                      size-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-(--bg-secondary)
                      text-(--accent-primary)
                    "
                  >
                    {result.icon && (
                      <FontAwesomeIcon icon={result.icon} aria-hidden="true" />
                    )}
                  </span>

                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="flex min-w-0 items-center justify-between gap-3">
                      <strong className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {result.title}
                      </strong>

                      <span
                        className="
                          shrink-0
                          rounded-full
                          bg-(--bg-secondary)
                          px-2
                          py-1
                          text-[0.65rem]
                          font-bold
                          opacity-70
                          max-[479px]:hidden
                        "
                      >
                        {formatCategory(result.category)}
                      </span>
                    </span>

                    <span
                      className="
                        line-clamp-1
                        text-xs
                        leading-5
                        opacity-60
                        max-[479px]:line-clamp-2
                      "
                    >
                      {result.description}
                    </span>
                  </span>

                  <FontAwesomeIcon
                    icon={faArrowRight}
                    aria-hidden="true"
                    className={`
                      text-xs
                      text-(--accent-primary)
                      transition
                      duration-150
                      max-[479px]:hidden
                      ${
                        isActive
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-1 opacity-0"
                      }
                    `}
                  />
                </button>
              );
            })}
          </div>

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
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              View all results for &ldquo;{query}&rdquo;
            </span>

            <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
          </button>
        </>
      ) : (
        <div className="flex flex-col gap-2 px-4 py-6 text-(--text-primary)">
          <strong className="text-sm">
            No matching FinSight features found.
          </strong>

          <span className="text-xs leading-5 opacity-60">
            Try searching for portfolio, holdings, watchlist, market, insights,
            or AI.
          </span>
        </div>
      )}
    </div>
  );
};

export default SearchResultsDropdown;
