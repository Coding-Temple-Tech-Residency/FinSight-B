import EmptyCard from "../../../components/ui/EmptyCard";
import ErrorCard from "../../../components/ui/ErrorCard";
import LoadingCard from "../../../components/ui/LoadingCard";

import { useAIInsights, useDeleteAIInsight } from "../hooks/useAIInsight";

import {
  formatInsightDate,
  getInsightTypeLabel,
  getSentimentLabel,
  isInsightExpired,
} from "../utils/insightFormatting";

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
};

const Insights = () => {
  const {
    data: insights = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useAIInsights();

  const deleteMutation = useDeleteAIInsight();

  const handleDelete = async (insightId: number) => {
    const confirmed = window.confirm("Delete this AI insight?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(insightId);
    } catch {
      // The mutation error is displayed below.
    }
  };

  return (
    <section className="insights-page">
      <header className="insights-header">
        <div>
          <h1>AI Insights</h1>

          <p>
            Review saved market, stock, portfolio, watchlist, news, and earnings
            insights.
          </p>
        </div>

        {isFetching && !isLoading && (
          <span role="status">Updating insights...</span>
        )}
      </header>

      {isLoading && <LoadingCard title="Loading insights..." />}

      {!isLoading && isError && (
        <div>
          <ErrorCard message={getErrorMessage(error)} />

          <button type="button" onClick={() => refetch()}>
            Try Again
          </button>
        </div>
      )}

      {deleteMutation.isError && (
        <ErrorCard message={getErrorMessage(deleteMutation.error)} />
      )}

      {!isLoading && !isError && insights.length === 0 && (
        <EmptyCard
          title="No AI insights"
          message="No AI insights have been saved yet."
        />
      )}

      {!isLoading && !isError && insights.length > 0 && (
        <div className="insights-grid">
          {insights.map((insight) => {
            const isDeleting =
              deleteMutation.isPending &&
              deleteMutation.variables === insight.id;

            const expired = isInsightExpired(insight.expires_at);

            return (
              <article key={insight.id} className="insight-result-card">
                <div className="card-header">
                  <div>
                    <h2>{getInsightTypeLabel(insight.insight_type)}</h2>

                    <p className="metric-label">
                      {formatInsightDate(insight.created_at)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {insight.sentiment && (
                      <span className="badge">
                        {getSentimentLabel(insight.sentiment)}
                      </span>
                    )}

                    {expired && <span className="negative">Expired</span>}
                  </div>
                </div>

                <p>{insight.summary}</p>

                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  {insight.portfolio_id !== null && (
                    <span className="metric-label">
                      Portfolio ID: {insight.portfolio_id}
                    </span>
                  )}

                  {insight.stock_id !== null && (
                    <span className="metric-label">
                      Stock ID: {insight.stock_id}
                    </span>
                  )}

                  {insight.source && (
                    <span className="metric-label">
                      Source: {insight.source}
                    </span>
                  )}

                  {insight.expires_at && (
                    <span className="metric-label">
                      Expires: {formatInsightDate(insight.expires_at)}
                    </span>
                  )}
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    disabled={deleteMutation.isPending}
                    onClick={() => handleDelete(insight.id)}
                    className="negative"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <p className="ai-disclaimer">
        AI-generated information is for educational purposes only and is not
        financial advice.
      </p>
    </section>
  );
};

export default Insights;
