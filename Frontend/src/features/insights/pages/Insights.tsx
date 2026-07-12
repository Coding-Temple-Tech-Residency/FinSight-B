import EmptyCard from "../../../components/ui/EmptyCard";
import ErrorCard from "../../../components/ui/ErrorCard";
import LoadingCard from "../../../components/ui/LoadingCard";

import { useDashboard } from "../../dashboard/hooks/useDashboard";
import { useAIInsights, useGenerateAIInsight } from "../hooks/useAIInsight";

const Insights = () => {
  const { symbol } = useDashboard();

  const { data: insights = [], isLoading, isError, error } = useAIInsights();

  const {
    mutate: generateInsight,
    isPending,
    isError: generateError,
    error: generateErrorData,
  } = useGenerateAIInsight();

  const handleGenerate = () => {
    generateInsight({
      symbol,
      analysis_type: "market",
    });
  };

  return (
    <section className="insights-page">
      <header className="insights-header">
        <div>
          <h1>AI Insights</h1>
          <p>AI-generated market analysis for {symbol}.</p>
        </div>

        <button type="button" disabled={isPending} onClick={handleGenerate}>
          {isPending ? "Analyzing..." : "Generate Insight"}
        </button>
      </header>

      {isLoading && <LoadingCard title="Loading insights..." />}

      {isError && (
        <ErrorCard
          message={
            error instanceof Error
              ? error.message
              : "Unable to load AI insights."
          }
        />
      )}

      {generateError && (
        <ErrorCard
          message={
            generateErrorData instanceof Error
              ? generateErrorData.message
              : "Unable to generate an insight."
          }
        />
      )}

      {!isLoading && !isError && insights.length === 0 && (
        <EmptyCard
          title="No AI insights"
          message={`Generate your first market insight for ${symbol}.`}
          action={
            <button type="button" disabled={isPending} onClick={handleGenerate}>
              Generate Insight
            </button>
          }
        />
      )}

      <div className="insights-grid">
        {insights.map((insight) => (
          <article key={insight.id} className="insight-result-card">
            <div className="card-header">
              <h2>{insight.symbol}</h2>
              <span className="badge">{insight.sentiment}</span>
            </div>

            <p>{insight.summary}</p>

            {insight.key_points?.length ? (
              <ul className="insight-key-points">
                {insight.key_points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            ) : null}

            {insight.risk_level && (
              <p>
                Risk level: <strong>{insight.risk_level}</strong>
              </p>
            )}
          </article>
        ))}
      </div>

      <p className="ai-disclaimer">
        AI-generated information is educational and is not financial advice.
      </p>
    </section>
  );
};

export default Insights;
