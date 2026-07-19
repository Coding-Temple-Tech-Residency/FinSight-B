import { Link } from "react-router-dom";

import {
  useAIInsights,
  useGeneratePortfolioAIInsight,
} from "../../insights/hooks/useAIInsights";

import {
  formatInsightDate,
  getInsightTypeLabel,
  getSentimentLabel,
} from "../../insights/utils/insightFormatting";

interface AIInsightCardProps {
  portfolioId?: number;
  portfolioLoading?: boolean;
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to generate an AI insight.";
};

const AIInsightCard = ({
  portfolioId,
  portfolioLoading = false,
}: AIInsightCardProps) => {
  const {
    data: insights = [],
    isLoading,
    isFetching,
    isError,
    error,
  } = useAIInsights();

  const generateMutation = useGeneratePortfolioAIInsight();

  const latestInsight = insights[0];

  const handleGenerateInsight = async () => {
    if (!portfolioId) return;

    try {
      await generateMutation.mutateAsync({
        portfolioId,
      });
    } catch (generationError) {
      console.error("Failed to generate portfolio insight:", generationError);
    }
  };

  const isGenerating = generateMutation.isPending;

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
          <span
            className={`insight-sentiment insight-sentiment-${latestInsight.sentiment}`}
          >
            {getSentimentLabel(latestInsight.sentiment)}
          </span>
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
        <p>
          Generate an AI analysis of your portfolio to see important insights.
        </p>
      )}

      {!isLoading && !isError && latestInsight && (
        <>
          <p>{latestInsight.summary}</p>

          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <span className="metric-label">
              Type:{" "}
              <strong>{getInsightTypeLabel(latestInsight.insight_type)}</strong>
            </span>

            <span className="metric-label">
              {formatInsightDate(latestInsight.created_at)}
            </span>
          </div>

          {latestInsight.source && (
            <p className="metric-label mt-2">Source: {latestInsight.source}</p>
          )}
        </>
      )}

      {generateMutation.isError && (
        <p className="negative mt-3" role="alert">
          {getErrorMessage(generateMutation.error)}
        </p>
      )}

      <div className="insight-actions">
        <button
          type="button"
          onClick={handleGenerateInsight}
          disabled={!portfolioId || portfolioLoading || isGenerating}
        >
          {isGenerating
            ? "Generating insight..."
            : latestInsight
              ? "Generate new insight"
              : "Generate portfolio insight"}
        </button>

        <Link to="/dashboard/insights">View all insights</Link>
      </div>

      {!portfolioLoading && !portfolioId && (
        <p className="metric-label mt-2">
          Create a portfolio before generating a portfolio insight.
        </p>
      )}

      <p className="ai-disclaimer">
        AI-generated information is for educational purposes and is not
        financial advice.
      </p>
    </article>
  );
};

export default AIInsightCard;
