import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { UniversalSearchResult } from "../types/search";

import { getSearchResultColor } from "../utils/getSearchResultColor";
import { getSearchResultIcon } from "../utils/getSearchResultIcon";
import { highlightMatch } from "../utils/highlightMatch";

import SearchResultItem from "./resultItem/SearchResultItem";

export interface IndexedSearchResult {
  result: UniversalSearchResult;
  index: number;
}

interface SearchResultGroupProps {
  label: string;
  query: string;
  results: IndexedSearchResult[];
  activeIndex: number;
  onResultSelect: (result: UniversalSearchResult) => void;
  onActiveIndexChange?: (index: number) => void;
}

const SearchResultGroup = ({
  label,
  query,
  results,
  activeIndex,
  onResultSelect,
  onActiveIndexChange,
}: SearchResultGroupProps) => {
  if (results.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby={`search-group-${label.toLowerCase()}`}>
      <div
        className="
          border-b
          border-white/10
          px-4
          py-2
          text-(--text-primary)
        "
      >
        <h3
          id={`search-group-${label.toLowerCase()}`}
          className="
            text-[0.7rem]
            font-bold
            uppercase
            tracking-wider
            opacity-60
          "
        >
          {label}
        </h3>
      </div>

      <div
        role="group"
        aria-label={`${label} search results`}
        className="flex flex-col gap-1 p-2"
      >
        {results.map(({ result, index }) => {
          const icon = getSearchResultIcon(result.type);
          const iconColor = getSearchResultColor(result.type);

          return (
            <SearchResultItem
              key={result.id}
              id={`universal-search-result-${result.id}`}
              title={highlightMatch(result.title, query)}
              subtitle={
                result.subtitle
                  ? highlightMatch(result.subtitle, query)
                  : undefined
              }
              badge={result.badge}
              image={result.image}
              imageAlt={
                result.image && result.subtitle ? `${result.subtitle} logo` : ""
              }
              fallbackIcon={
                <FontAwesomeIcon
                  icon={icon}
                  aria-hidden="true"
                  className={iconColor}
                />
              }
              trailing={result.trailing}
              selected={index === activeIndex}
              onMouseEnter={() => {
                onActiveIndexChange?.(index);
              }}
              onClick={() => {
                onResultSelect(result);
              }}
            />
          );
        })}
      </div>
    </section>
  );
};

export default SearchResultGroup;
