import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ThemeButton from "./ThemeButton";
import useTheme from "../../hooks/useTheme";

const mockToggleTheme = vi.fn();

vi.mock("../../hooks/useTheme", () => ({
  default: vi.fn(),
}));

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    matches: false,
    media: "",
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
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
