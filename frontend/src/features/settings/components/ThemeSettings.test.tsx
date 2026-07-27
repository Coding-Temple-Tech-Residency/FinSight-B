import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ThemeSettings from "./ThemeSettings";

const mockToggleTheme = vi.fn();

const mockUseTheme = {
  darkTheme: false,
  toggleTheme: mockToggleTheme,
};

vi.mock("../../../hooks/useTheme", () => ({
  default: () => mockUseTheme,
}));

describe("ThemeSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTheme.darkTheme = false;
  });

  it("renders light theme", () => {
    render(<ThemeSettings />);

    expect(
      screen.getByRole("heading", {
        name: "Appearance",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Current theme: Light")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Switch to Dark",
      }),
    ).toBeInTheDocument();
  });

  it("renders dark theme", () => {
    mockUseTheme.darkTheme = true;

    render(<ThemeSettings />);

    expect(screen.getByText("Current theme: Dark")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Switch to Light",
      }),
    ).toBeInTheDocument();
  });

  it("calls toggleTheme when button is clicked", async () => {
    const user = userEvent.setup();

    render(<ThemeSettings />);

    await user.click(
      screen.getByRole("button", {
        name: "Switch to Dark",
      }),
    );

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });
});
