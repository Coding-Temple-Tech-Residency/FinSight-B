import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import FinancialAssistantCard from "./FinancialAssistantCard";

const mockUseCurrency = vi.fn();
const mockUseGenerateGeneralAIInsight = vi.fn();

vi.mock("../../currency/hooks/useCurrency", () => ({
  useCurrency: () => mockUseCurrency(),
}));

vi.mock("../../insights/hooks/useAIInsights", () => ({
  useGenerateGeneralAIInsight: () => mockUseGenerateGeneralAIInsight(),
}));

vi.mock("react-router-dom", () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}));

describe("FinancialAssistantCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseCurrency.mockReturnValue({
      preferredCurrency: "USD",
    });

    mockUseGenerateGeneralAIInsight.mockReturnValue({
      isPending: false,
      isError: false,
      error: null,
      mutateAsync: vi.fn(),
    });
  });

  it("renders financial assistant card", () => {
    render(<FinancialAssistantCard symbol="AAPL" portfolioCount={2} />);

    expect(screen.getByText("Dashboard AI Briefing")).toBeInTheDocument();

    expect(
      screen.getByText(/Generate an overview of all your portfolios/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Generate dashboard briefing",
      }),
    ).toBeInTheDocument();
  });

  it("shows loading state while generating briefing", () => {
    mockUseGenerateGeneralAIInsight.mockReturnValue({
      isPending: true,
      isError: false,
      error: null,
      mutateAsync: vi.fn(),
    });

    render(<FinancialAssistantCard symbol="AAPL" portfolioCount={2} />);

    expect(
      screen.getByText("FinSight AI is reviewing your portfolios..."),
    ).toBeInTheDocument();
  });

  it("generates briefing when button is clicked", async () => {
    const user = userEvent.setup();

    const mutateAsync = vi.fn().mockResolvedValue({
      summary: "Your portfolio is diversified.",
      sentiment: "positive",
    });

    mockUseGenerateGeneralAIInsight.mockReturnValue({
      isPending: false,
      isError: false,
      error: null,
      mutateAsync,
    });

    render(<FinancialAssistantCard symbol="AAPL" portfolioCount={2} />);

    await user.click(
      screen.getByRole("button", {
        name: "Generate dashboard briefing",
      }),
    );

    expect(mutateAsync).toHaveBeenCalledWith({
      message: expect.stringContaining("AAPL"),
    });
  });

  it("renders generated briefing", async () => {
    const user = userEvent.setup();

    const mutateAsync = vi.fn().mockResolvedValue({
      summary: "Your portfolio is diversified.",
      sentiment: "positive",
    });

    mockUseGenerateGeneralAIInsight.mockReturnValue({
      isPending: false,
      isError: false,
      error: null,
      mutateAsync,
    });

    render(<FinancialAssistantCard symbol="AAPL" portfolioCount={2} />);

    await user.click(
      screen.getByRole("button", {
        name: "Generate dashboard briefing",
      }),
    );

    expect(
      await screen.findByText("Your portfolio is diversified."),
    ).toBeInTheDocument();
  });
});
