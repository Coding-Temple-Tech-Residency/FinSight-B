import { Link } from "react-router-dom";

import { useAIInsights } from "../../insights/hooks/useAIInsight";

const formatDate = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(date);
};

const AIInsightCard = () => {
  const {
    data: insights = [],
    isLoading,
    isFetching,
    isError,
    error,
  } = useAIInsights();

  const latestInsight = insights[0];

  return (
    <article className="insight-card">
      <div className="card-header">
        <div>
          <h2>AI Insights</h2>

          {isFetching && !isLoading && (
            <p className="metric-label">Updating...</p>
          )}
        </div>

        {latestInsight?.sentiment && (
          <span className="badge">{latestInsight.sentiment}</span>
        )}
      </div>

      {isLoading && <p role="status">Loading AI insights...</p>}

      {!isLoading && isError && (
        <p className="negative" role="alert">
          {error instanceof Error
            ? error.message
            : "Unable to load AI insights."}
        </p>
      )}

      {!isLoading && !isError && !latestInsight && (
        <div>
          <p>No AI insights have been created yet.</p>
        </div>
      )}

      {!isLoading && !isError && latestInsight && (
        <>
          <p>{latestInsight.summary}</p>

          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <span className="metric-label">
              Type: <strong>{latestInsight.insight_type}</strong>
            </span>

            <span className="metric-label">
              {formatDate(latestInsight.created_at)}
            </span>
          </div>

          {latestInsight.source && (
            <p className="metric-label mt-2">Source: {latestInsight.source}</p>
          )}
        </>
      )}

      <div className="insight-actions">
        <Link to="/dashboard/insights">View all insights</Link>
      </div>

      <p className="ai-disclaimer">
        AI-generated information is for educational purposes and is not
        financial advice.
      </p>
    </article>
  );
};

export default AIInsightCard;
