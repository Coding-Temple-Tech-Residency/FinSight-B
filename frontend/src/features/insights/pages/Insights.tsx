import EmptyCard from "../../../components/ui/EmptyCard";
import ErrorCard from "../../../components/ui/ErrorCard";
import LoadingCard from "../../../components/ui/LoadingCard";
import "../styles/Insights.css";

import InsightCard from "../components/InsightCard";

import { useAIInsights, useDeleteAIInsight } from "../hooks/useAIInsights";

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
    } catch (error) {
      console.error("Failed to delete AI insight:", error);
    }
  };

  return (
    <section className="insights-page">
      <header className="insights-header">
        <div>
          <p className="page-eyebrow">Artificial Intelligence</p>

          <h1>AI Insights</h1>

          <p className="insights-description">
            Review saved market, stock, portfolio, watchlist, news, and earnings
            insights.
          </p>
        </div>

        {isFetching && !isLoading && (
          <span className="insights-updating" role="status">
            Updating insights...
          </span>
        )}
      </header>

      {isLoading && <LoadingCard title="Loading insights..." />}

      {!isLoading && isError && (
        <div className="insights-error-state">
          <ErrorCard message={getErrorMessage(error)} />

          <button
            type="button"
            onClick={() => refetch()}
            className="insights-retry-button"
          >
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

            return (
              <InsightCard
                key={insight.id}
                insight={insight}
                isDeleting={isDeleting}
                onDelete={handleDelete}
              />
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
