import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import StockLineChart from "./StockLineChart";

vi.mock("../utils/chartData", () => ({
  formatChartData: vi.fn(),
}));

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CartesianGrid: () => <div>CartesianGrid</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  Tooltip: () => <div>Tooltip</div>,
  Line: () => <div>Line</div>,
}));

import { formatChartData } from "../utils/chartData";

describe("StockLineChart", () => {
  it("renders empty state when there is no chart data", () => {
    vi.mocked(formatChartData).mockReturnValue([]);

    render(<StockLineChart data={[]} />);

    expect(
      screen.getByText("No price history is available."),
    ).toBeInTheDocument();
  });

  it("renders chart when data is available", () => {
    vi.mocked(formatChartData).mockReturnValue([
      {
        date: "Jan 1",
        close: 100,
      },
    ] as never);

    render(<StockLineChart data={[]} />);

    expect(
      screen.getByRole("heading", { name: "Price History" }),
    ).toBeInTheDocument();

    expect(screen.getByText("CartesianGrid")).toBeInTheDocument();
    expect(screen.getByText("XAxis")).toBeInTheDocument();
    expect(screen.getByText("YAxis")).toBeInTheDocument();
    expect(screen.getByText("Tooltip")).toBeInTheDocument();
    expect(screen.getByText("Line")).toBeInTheDocument();
  });
});
