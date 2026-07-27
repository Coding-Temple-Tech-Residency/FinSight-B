import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Logo from "./Logo";
import { useBreakpoint } from "../../hooks/useBreakingPoint";

vi.mock("../../hooks/useBreakingPoint", () => ({
  useBreakpoint: vi.fn(),
}));
describe("Logo", () => {
  it("renders FinSight on desktop", () => {
    vi.mocked(useBreakpoint).mockReturnValue({
      isDesktop: true,
    });

    render(<Logo />);

    expect(screen.getByText("FinSight")).toBeInTheDocument();
  });

  it("renders FS on mobile", () => {
    vi.mocked(useBreakpoint).mockReturnValue({
      isDesktop: false,
    });

    render(<Logo />);

    expect(screen.getByText("FS")).toBeInTheDocument();
  });
});
