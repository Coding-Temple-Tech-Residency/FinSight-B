import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import Portfolio from "./Portfolio";

const mockUsePortfolios = vi.fn();
const mockUseHoldings = vi.fn();
vi.mock("react-router-dom", () => ({
  useSearchParams: () => [new URLSearchParams(), vi.fn()],
}));

const openModal = vi.fn();
const closeModal = vi.fn();

vi.mock("../../../hooks/useModal", () => ({
  useModal: () => ({
    openModal,
    closeModal,
  }),
}));

vi.mock("../hooks/usePortfolio", () => ({
  usePortfolios: () => mockUsePortfolios(),
  useCreatePortfolio: () => ({
    isPending: false,
    isError: false,
    reset: vi.fn(),
    mutate: vi.fn(),
  }),

  useUpdatePortfolio: () => ({
    isPending: false,
    isError: false,
    reset: vi.fn(),
    mutate: vi.fn(),
  }),
  useDeletePortfolio: () => ({
    isPending: false,
    isError: false,
    mutate: vi.fn(),
  }),
}));

vi.mock("../hooks/useHoldings", () => ({
  useHoldings: () => mockUseHoldings(),
  useCreateHolding: () => ({
    isPending: false,
    isError: false,
    reset: vi.fn(),
  }),
  useUpdateHolding: () => ({
    isPending: false,
    isError: false,
    reset: vi.fn(),
  }),
  useDeleteHolding: () => ({
    isPending: false,
    isError: false,
  }),
}));

vi.mock("../../../components/ui/LoadingCard", () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

vi.mock("../../../components/ui/ErrorCard", () => ({
  default: ({ message }: { message: string }) => <div>{message}</div>,
}));

vi.mock("../../../components/ui/EmptyCard", () => ({
  default: ({ title, message }: { title: string; message: string }) => (
    <div>
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  ),
}));

vi.mock("../components/PortfolioFormModal", () => ({
  default: () => null,
}));

vi.mock("../components/HoldingFormModal", () => ({
  default: () => null,
}));
vi.mock("../../dashboard/components/AIInsightCard", () => ({
  default: () => <div>AI Insight Card</div>,
}));
vi.mock("../components/PortfolioSummary", () => ({
  default: () => <div>Portfolio Summary</div>,
}));

vi.mock("../components/PortfolioAnalytics", () => ({
  default: () => <div>Portfolio Analytics</div>,
}));

vi.mock("../components/PortfolioAllocation", () => ({
  default: () => <div>Portfolio Allocation</div>,
}));

vi.mock("../components/HoldingsTable", () => ({
  default: () => <div>Holdings Table</div>,
}));
vi.stubGlobal(
  "confirm",
  vi.fn(() => true),
);
describe("Portfolio", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseHoldings.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    });
  });
  it("renders loading state", () => {
    mockUsePortfolios.mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
    });

    render(<Portfolio />);

    expect(screen.getByText("Loading portfolios...")).toBeInTheDocument();
  });

  it("renders error state", () => {
    mockUsePortfolios.mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
      error: new Error("Failed to load"),
    });

    render(<Portfolio />);

    expect(screen.getByText("Failed to load")).toBeInTheDocument();
  });

  it("renders empty portfolios state", () => {
    mockUsePortfolios.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    render(<Portfolio />);

    expect(
      screen.getByRole("heading", { name: "No portfolios yet" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Create your first portfolio to begin organizing your investments.",
      ),
    ).toBeInTheDocument();
  });
  it("renders portfolio page when a portfolio exists", () => {
    mockUsePortfolios.mockReturnValue({
      data: [
        {
          id: 1,
          name: "Growth Portfolio",
          description: "Test",
          currency: "USD",
        },
      ],
      isLoading: false,
      isError: false,
    });

    render(<Portfolio />);

    expect(
      screen.getByRole("heading", { name: "Portfolio" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Create and manage your investment portfolios and holdings.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Create Portfolio" }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Portfolio")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Rename" })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });
  it("renders holdings section when holdings exist", () => {
    mockUsePortfolios.mockReturnValue({
      data: [
        {
          id: 1,
          name: "Growth Portfolio",
          description: "Test",
          currency: "USD",
        },
      ],
      isLoading: false,
      isError: false,
    });

    mockUseHoldings.mockReturnValue({
      data: [
        {
          id: 1,
          symbol: "AAPL",
          shares: 10,
          average_buy_price: 100,
          latest_price: 120,
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
    });
    mockUseHoldings.mockReturnValue({
      data: [
        {
          id: 1,
          symbol: "AAPL",
          shares: 10,
          average_buy_price: 100,
          latest_price: 120,
        },
      ],
      isLoading: false,
      isError: false,
    });

    render(<Portfolio />);

    expect(
      screen.getByRole("heading", { name: "Holdings" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Track the stocks held in Growth Portfolio."),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Add Holding" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Holdings Table")).toBeInTheDocument();
  });
  it("opens create portfolio modal when Create Portfolio is clicked", async () => {
    const user = userEvent.setup();

    mockUsePortfolios.mockReturnValue({
      data: [
        {
          id: 1,
          name: "Growth Portfolio",
          description: "Test",
          currency: "USD",
        },
      ],
      isLoading: false,
      isError: false,
    });

    render(<Portfolio />);

    await user.click(screen.getByRole("button", { name: "Create Portfolio" }));

    expect(openModal).toHaveBeenCalledWith("portfolio-form");
  });

  it("opens rename portfolio modal when Rename is clicked", async () => {
    const user = userEvent.setup();

    mockUsePortfolios.mockReturnValue({
      data: [
        {
          id: 1,
          name: "Growth Portfolio",
          description: "Test",
          currency: "USD",
        },
      ],
      isLoading: false,
      isError: false,
    });

    render(<Portfolio />);

    await user.click(screen.getByRole("button", { name: "Rename" }));

    expect(openModal).toHaveBeenCalledWith("portfolio-form");
  });
  it("confirms portfolio deletion when Delete is clicked", async () => {
    const user = userEvent.setup();

    mockUsePortfolios.mockReturnValue({
      data: [
        {
          id: 1,
          name: "Growth Portfolio",
          description: "Test",
          currency: "USD",
        },
      ],
      isLoading: false,
      isError: false,
    });

    render(<Portfolio />);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(window.confirm).toHaveBeenCalled();
  });
});
