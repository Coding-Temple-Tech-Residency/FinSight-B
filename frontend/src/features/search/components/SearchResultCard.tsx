import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";

import type { SearchResult } from "../types/search";

interface SearchResultCardProps {
  result: SearchResult;
}

const SearchResultCard = ({ result }: SearchResultCardProps) => {
  return (
    <article className="search-result-card">
      <Link to={result.path} className="search-result-link">
        <div className="search-result-icon">
          {result.icon && (
            <FontAwesomeIcon icon={result.icon} aria-hidden="true" />
          )}
        </div>

        <div className="search-result-content">
          <div className="search-result-heading">
            <h2>{result.title}</h2>

            <span className="search-result-category">{result.category}</span>
          </div>

          <p>{result.description}</p>
        </div>

        <FontAwesomeIcon
          icon={faArrowRight}
          className="search-result-arrow"
          aria-hidden="true"
        />
      </Link>
    </article>
  );
};

export default SearchResultCard;
