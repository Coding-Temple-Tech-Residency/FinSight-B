import { useState } from "react";
import { Link } from "react-router-dom";

import { useCurrency } from "../../currency/hooks/useCurrency";
import { useGenerateGeneralAIInsight } from "../../insights/hooks/useAIInsights";

import type { AIInsight } from "../../insights/types/ai";

type FinancialAssistantCardProps = {
  symbol: string;
  portfolioCount: number;
  portfolioLoading?: boolean;
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to generate your financial briefing.";
};

const FinancialAssistantCard = ({
  symbol,
  portfolioCount,
  portfolioLoading = false,
}: FinancialAssistantCardProps) => {
  const { preferredCurrency } = useCurrency();

  const [briefing, setBriefing] = useState<AIInsight | null>(null);

  const generateMutation = useGenerateGeneralAIInsight();

  const buildBriefingPrompt = (): string => {
    return [
      "Create a concise FinSight dashboard briefing using all of my portfolios and holdings available to you.",
      "",
      "Current interface context:",
      `- Selected market symbol: ${symbol}`,
      `- Preferred display currency: ${preferredCurrency}`,
      `- Portfolio count currently shown: ${portfolioCount}`,
      "",
      "Organize the briefing into these sections:",
      "1. Overall position",
      "2. Diversification and concentration",
      "3. Strongest positive",
      "4. Biggest risk",
      "5. One practical next step",
      "",
      "Use short headings and clear bullet points.",
      "Mention missing or unavailable data when necessary.",
      "Do not tell me to buy or sell a security.",
      "Make it clear that the response is educational and not financial advice.",
    ].join("\n");
  };

  const handleGenerateBriefing = async () => {
    if (generateMutation.isPending) {
      return;
    }

    try {
      const generatedBriefing = await generateMutation.mutateAsync({
        message: buildBriefingPrompt(),
      });

      setBriefing(generatedBriefing);
    } catch (error) {
      console.error("Failed to generate dashboard briefing:", error);
    }
  };

  return (
    <article className="insight-card">
      <div className="card-header">
        <div>
          <p className="dashboard-section-eyebrow">Financial assistant</p>

          <h2>Dashboard AI Briefing</h2>

          <p className="metric-label mt-2">
            Generate an overview of all your portfolios, concentration,
            strengths, and potential risks.
          </p>
        </div>

        {briefing?.sentiment && (
          <span
            className={`insight-sentiment insight-sentiment-${briefing.sentiment}`}
          >
            {briefing.sentiment}
          </span>
        )}
      </div>

      {!briefing && !generateMutation.isPending && (
        <div className="insight-preview">
          <p>
            Your financial assistant can review the portfolio information
            securely loaded by FinSight and create a concise account-level
            briefing.
          </p>
        </div>
      )}

      {generateMutation.isPending && (
        <div className="insight-preview" role="status" aria-live="polite">
          <p>FinSight AI is reviewing your portfolios...</p>
        </div>
      )}

      {briefing && !generateMutation.isPending && (
        <>
          <div className="insight-preview">
            <p className="whitespace-pre-wrap">{briefing.summary}</p>
          </div>

          <div className="insight-meta">
            <span className="metric-label">
              Preferred currency: <strong>{preferredCurrency}</strong>
            </span>

            <span className="metric-label">
              Portfolios reviewed: <strong>{portfolioCount}</strong>
            </span>
          </div>
        </>
      )}

      {generateMutation.isError && (
        <p className="negative insight-generation-error" role="alert">
          {getErrorMessage(generateMutation.error)}
        </p>
      )}

      <div className="insight-actions">
        <button
          type="button"
          onClick={handleGenerateBriefing}
          disabled={generateMutation.isPending || portfolioLoading}
        >
          {generateMutation.isPending
            ? "Generating briefing..."
            : briefing
              ? "Generate new briefing"
              : "Generate dashboard briefing"}
        </button>

        <Link to="/dashboard/insights">View saved insights</Link>
      </div>

      <p className="metric-label">
        AI responses are for educational purposes only and are not financial
        advice.
      </p>
    </article>
  );
};

export default FinancialAssistantCard;
