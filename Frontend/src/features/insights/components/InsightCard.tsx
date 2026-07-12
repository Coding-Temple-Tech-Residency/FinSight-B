import { Link } from "react-router-dom";
import { useDashboard } from "../../dashboard/hooks/useDashboard";
import { useGenerateAIInsight } from "../hooks/useAIInsight";

const AIInsightCard = () => {
  const { symbol } = useDashboard();

  const {
    data: insight,
    mutate: generateInsight,
    isPending,
    isError,
  } = useGenerateAIInsight();

  const handleGenerate = () => {
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

      {!insight && !isPending && (
        <p>Generate an AI-powered summary for {symbol}.</p>
      )}

      {isPending && <p>Analyzing {symbol}...</p>}

      {isError && <p className="negative">Unable to generate an insight.</p>}

      {insight && <p>{insight.summary}</p>}

      <div className="insight-actions">
        <button type="button" onClick={handleGenerate} disabled={isPending}>
          {isPending ? "Analyzing..." : "Generate Insight"}
        </button>

        {insight && <Link to="/dashboard/insights">View details</Link>}
      </div>
    </article>
  );
};

export default AIInsightCard;
