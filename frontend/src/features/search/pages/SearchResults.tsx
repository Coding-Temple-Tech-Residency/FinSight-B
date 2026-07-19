import { Link, useSearchParams } from "react-router-dom";

import SearchResultCard from "../components/SearchResultCard";
import { usePlatformSearch } from "../hooks/usePlatformSearch";
import EmptyCard from "../../../components/ui/EmptyCard";
import SearchForm from "../../../components/SearchForm";
// import "../styles/search.css";

const SearchResults = () => {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q")?.trim() ?? "";

  const { results, resultCount, hasResults } = usePlatformSearch(query);

  return (
    <section className="search-results-page">
      <header className="search-results-header">
        <div>
          <p className="page-eyebrow">Platform Search</p>

          <h1>Search FinSight</h1>

          <p>
            Search across your dashboard, portfolio, watchlist, AI tools, and
            settings.
          </p>
        </div>
      </header>

      <div className="search-results-form">
        <SearchForm placeholder="Search pages, portfolios, watchlists, AI tools..." />
      </div>

      {!query && (
        <EmptyCard
          title="Search the platform"
          message="Enter a page, feature, or action you would like to find."
        />
      )}

      {query && !hasResults && (
        <div className="search-no-results">
          <EmptyCard
            title="No results found"
            message={`No FinSight results matched “${query}”. Try another keyword.`}
          />

          <Link to="/dashboard" className="secondary-button">
            Return to Dashboard
          </Link>
        </div>
      )}

      {query && hasResults && (
        <>
          <div className="search-results-summary">
            <h2>Results for “{query}”</h2>

            <span>
              {resultCount} {resultCount === 1 ? "result" : "results"}
            </span>
          </div>

          <div className="search-results-list">
            {results.map((result) => (
              <SearchResultCard key={result.id} result={result} />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default SearchResults;
