import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";

import type { UniversalSearchResult } from "../types/search";

import { getSearchResultColor } from "../utils/getSearchResultColor";
import { getSearchResultIcon } from "../utils/getSearchResultIcon";

interface SearchResultCardProps {
  result: UniversalSearchResult;
}

const formatResultType = (type: UniversalSearchResult["type"]): string => {
  const labels: Record<UniversalSearchResult["type"], string> = {
    stock: "Stock",
    portfolio: "Portfolio",
    watchlist: "Watchlist",
    page: "Page",
    ai: "AI",
  };

  return labels[type];
};

const SearchResultCard = ({ result }: SearchResultCardProps) => {
  const icon = getSearchResultIcon(result.type);
  const iconColor = getSearchResultColor(result.type);

  const resultLabel = result.badge ?? formatResultType(result.type);

  const content = (
    <>
      <div className="search-result-icon">
        {result.image ? (
          <img
            src={result.image}
            alt=""
            loading="lazy"
            className="
              h-full
              w-full
              rounded-full
              object-cover
            "
          />
        ) : (
          <FontAwesomeIcon
            icon={icon}
            aria-hidden="true"
            className={iconColor}
          />
        )}
      </div>

      <div className="search-result-content">
        <div className="search-result-heading">
          <h2>{result.title}</h2>

          <span className="search-result-category">{resultLabel}</span>
        </div>

        {result.subtitle && <p>{result.subtitle}</p>}

        {result.trailing && (
          <span
            className="
              mt-2
              inline-block
              text-sm
              font-bold
              text-(--text-primary)
            "
          >
            {result.trailing}
          </span>
        )}
      </div>

      <FontAwesomeIcon
        icon={faArrowRight}
        className="search-result-arrow"
        aria-hidden="true"
      />
    </>
  );

  if (!result.href) {
    return (
      <article className="search-result-card">
        <div className="search-result-link">{content}</div>
      </article>
    );
  }

  return (
    <article className="search-result-card">
      <Link to={result.href} className="search-result-link">
        {content}
      </Link>
    </article>
  );
};

export default SearchResultCard;
