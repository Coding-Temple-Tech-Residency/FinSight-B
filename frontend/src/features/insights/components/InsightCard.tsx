import type { AIInsight } from "../types/ai";

import {
  formatInsightDate,
  getInsightTypeLabel,
  getSentimentLabel,
  isInsightExpired,
} from "../utils/insightFormatting";

interface InsightCardProps {
  insight: AIInsight;
  isDeleting: boolean;
  onDelete: (insightId: number) => void;
}

const InsightCard = ({ insight, isDeleting, onDelete }: InsightCardProps) => {
  const expired = isInsightExpired(insight.expires_at);

  const sentimentClassName =
    insight.sentiment !== null
      ? `insight-sentiment insight-sentiment-${insight.sentiment}`
      : "";

  return (
    <article className="insight-result-card">
      <div className="card-header">
        <div>
          <h2>{getInsightTypeLabel(insight.insight_type)}</h2>

          <p className="metric-label">
            {formatInsightDate(insight.created_at)}
          </p>
        </div>

        <div className="insight-badges">
          {insight.sentiment && (
            <span className={sentimentClassName}>
              {getSentimentLabel(insight.sentiment)}
            </span>
          )}

          {expired && <span className="insight-expired">Expired</span>}
        </div>
      </div>

      <p className="insight-summary">{insight.summary}</p>

      <div className="insight-metadata">
        {insight.portfolio_id !== null && (
          <span className="metric-label">
            Portfolio ID: {insight.portfolio_id}
          </span>
        )}

        {insight.stock_id !== null && (
          <span className="metric-label">Stock ID: {insight.stock_id}</span>
        )}

        {insight.source && (
          <span className="metric-label">Source: {insight.source}</span>
        )}

        {insight.expires_at && (
          <span className="metric-label">
            Expires: {formatInsightDate(insight.expires_at)}
          </span>
        )}
      </div>

      <div className="insight-card-actions">
        <button
          type="button"
          disabled={isDeleting}
          onClick={() => onDelete(insight.id)}
          className="insight-delete-button"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </article>
  );
};

export default InsightCard;
