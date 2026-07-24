import { Link, useSearchParams } from "react-router-dom";

import EmptyCard from "../../../components/ui/EmptyCard";

import SearchForm from "../components/SearchForm";
import SearchResultCard from "../components/SearchResultCard";
import SearchErrorState from "../components/states/SearchErrorState";
import SearchLoadingState from "../components/states/SearchLoadingState";

import { useUniversalSearch } from "../hooks/useUniversalSearch";

import type { SearchResultType, UniversalSearchResult } from "../types/search";

import "../styles/search.css";
import "../styles/SearchResults.css";

interface SearchResultGroup {
  type: SearchResultType;
  label: string;
  results: UniversalSearchResult[];
}

const RESULT_GROUPS: Array<{
  type: SearchResultType;
  label: string;
}> = [
  {
    type: "stock",
    label: "Stocks",
  },
  {
    type: "portfolio",
    label: "Portfolios",
  },
  {
    type: "watchlist",
    label: "Watchlists",
  },
  {
    type: "page",
    label: "Pages and Features",
  },
  {
    type: "ai",
    label: "AI",
  },
];

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return "FinSight could not complete your search.";
};

const groupSearchResults = (
  results: UniversalSearchResult[],
): SearchResultGroup[] => {
  return RESULT_GROUPS.map((group) => ({
    ...group,
    results: results.filter((result) => result.type === group.type),
  })).filter((group) => group.results.length > 0);
};

const PlatformSearchResults = () => {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q")?.trim() ?? "";

  const universalSearchQuery = useUniversalSearch(query);

  const results = universalSearchQuery.data ?? [];

  const groupedResults = groupSearchResults(results);

  const resultCount = results.length;
  const hasResults = resultCount > 0;

  const isLoading =
    query.length > 0 &&
    (universalSearchQuery.isLoading || universalSearchQuery.isFetching);

  const isError = query.length > 0 && universalSearchQuery.isError;

  return (
    <section className="search-results-page">
      <header className="search-results-header">
        <div>
          <p className="page-eyebrow">Universal Search</p>

          <h1>Search FinSight</h1>

          <p>
            Search across your dashboard, portfolios, watchlists, stocks, and AI
            tools.
          </p>
        </div>
      </header>

      <div className="search-results-form">
        <SearchForm
          key={query}
          placeholder="Search stocks, pages, portfolios, watchlists, AI tools..."
        />
      </div>

      {!query && (
        <EmptyCard
          title="Search FinSight"
          message="Enter a stock symbol, company, page, feature, portfolio, watchlist, or AI tool."
        />
      )}

      {isLoading && (
        <SearchLoadingState message={`Searching FinSight for “${query}”...`} />
      )}

      {!isLoading && isError && (
        <SearchErrorState
          title="Search is unavailable"
          message={getErrorMessage(universalSearchQuery.error)}
          fallbackMessage="Please try your search again."
        />
      )}

      {!isLoading && !isError && query && !hasResults && (
        <div className="search-no-results">
          <EmptyCard
            title="No results found"
            message={`No FinSight results matched “${query}”. Try another keyword or stock symbol.`}
          />

          <Link to="/dashboard" className="secondary-button">
            Return to Dashboard
          </Link>
        </div>
      )}

      {!isLoading && !isError && query && hasResults && (
        <>
          <div className="search-results-summary">
            <h2>Results for “{query}”</h2>

            <span>
              {resultCount} {resultCount === 1 ? "result" : "results"}
            </span>
          </div>

          <div className="flex flex-col gap-8">
            {groupedResults.map((group) => (
              <section
                key={group.type}
                aria-labelledby={`search-results-${group.type}`}
                className="flex flex-col gap-4"
              >
                <header
                  className="
                      flex
                      items-center
                      justify-between
                      gap-4
                    "
                >
                  <h2
                    id={`search-results-${group.type}`}
                    className="
                        text-lg
                        font-bold
                        text-(--text-primary)
                      "
                  >
                    {group.label}
                  </h2>

                  <span
                    className="
                        text-sm
                        text-(--text-secondary)
                      "
                  >
                    {group.results.length}{" "}
                    {group.results.length === 1 ? "result" : "results"}
                  </span>
                </header>

                <div className="search-results-list">
                  {group.results.map((result) => (
                    <SearchResultCard key={result.id} result={result} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default PlatformSearchResults;
