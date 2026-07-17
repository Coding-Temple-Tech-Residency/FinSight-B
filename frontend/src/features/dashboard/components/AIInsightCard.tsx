import { Link } from "react-router-dom";

import { useDashboard } from "../hooks/useDashboard";
import { useGenerateAIInsight } from "../../insights/hooks/useAIInsight";

const AIInsightCard = () => {
  const { symbol } = useDashboard();

  const {
    data: insight,
    mutate: generateInsight,
    isPending,
    isError,
    error,
  } = useGenerateAIInsight();

  const handleGenerateInsight = () => {
    generateInsight({
      symbol,
      analysis_type: "market",
    });
  };

  return (
    <article className="insight-card">
      <div className="card-header">
        <h2>AI Market Insight</h2>

        {insight?.sentiment && (
          <span className="badge">{insight.sentiment}</span>
        )}
      </div>

      {!insight && !isPending && !isError && (
        <p>Generate an AI-powered market analysis for {symbol}.</p>
      )}

      {isPending && <p>Analyzing {symbol}...</p>}

      {isError && (
        <p className="negative">
          {error instanceof Error
            ? error.message
            : "Unable to generate an AI insight."}
        </p>
      )}

      {insight && (
        <>
          <p>{insight.summary}</p>

          {insight.key_points?.length ? (
            <ul className="insight-key-points">
              {insight.key_points.slice(0, 3).map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          ) : null}

          {insight.risk_level && (
            <p className="metric-label">
              Risk level: <strong>{insight.risk_level}</strong>
            </p>
          )}
        </>
      )}

      <div className="insight-actions">
        <button
          type="button"
          onClick={handleGenerateInsight}
          disabled={isPending}
        >
          {isPending
            ? "Analyzing..."
            : insight
              ? "Generate New Insight"
              : "Generate Insight"}
        </button>

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
