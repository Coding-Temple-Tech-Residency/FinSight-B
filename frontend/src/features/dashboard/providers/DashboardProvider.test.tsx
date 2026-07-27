import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import DashboardProvider from "./DashboardProvider";
import { useDashboard } from "../hooks/useDashboard";

const TestComponent = () => {
  const { symbol, setSymbol } = useDashboard();

  return (
    <div>
      <p>{symbol}</p>

      <button onClick={() => setSymbol("TSLA")}>Change Symbol</button>
    </div>
  );
};

describe("DashboardProvider", () => {
  it("provides default symbol", () => {
    render(
      <DashboardProvider>
        <TestComponent />
      </DashboardProvider>,
    );

    expect(screen.getByText("AAPL")).toBeInTheDocument();
  });

  it("updates symbol", async () => {
    const user = userEvent.setup();

    render(
      <DashboardProvider>
        <TestComponent />
      </DashboardProvider>,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Change Symbol",
      }),
    );

    expect(screen.getByText("TSLA")).toBeInTheDocument();
  });
});
