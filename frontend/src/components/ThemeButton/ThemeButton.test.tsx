import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ThemeButton from "./ThemeButton";
import useTheme from "../../hooks/useTheme";

const mockToggleTheme = vi.fn();

vi.mock("../../hooks/useTheme", () => ({
  default: vi.fn(),
}));

describe("ThemeButton", () => {
  it("renders the theme button", () => {
    vi.mocked(useTheme).mockReturnValue({
      darkTheme: true,
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeButton />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls toggleTheme when clicked", () => {
    vi.mocked(useTheme).mockReturnValue({
      darkTheme: true,
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeButton />);

    fireEvent.click(screen.getByRole("button"));

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });
});
