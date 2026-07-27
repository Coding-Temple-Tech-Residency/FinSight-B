import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import Home from "./Home";

const mockOpenMenu = vi.fn();
const mockCloseMenu = vi.fn();
const mockUseAuth = vi.fn();

vi.mock("react-router-dom", () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
  useNavigate: () => vi.fn(),
}));

vi.mock("../../../hooks/useBreakingPoint", () => ({
  useBreakpoint: () => ({
    isDesktop: true,
  }),
}));

vi.mock("../../../hooks/useModal", () => ({
  useModal: () => ({
    openModal: vi.fn(),
    isModalOpen: () => false,
  }),
}));

vi.mock("../../auth/hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("../../../components/Logo", () => ({
  default: () => <div>Logo</div>,
}));

vi.mock("../../../components/ThemeButton", () => ({
  default: () => <div>ThemeButton</div>,
}));

vi.mock("../../auth/components/AuthForm", () => ({
  default: () => <div>AuthForm</div>,
}));

vi.mock("../components/GuestHomePreview", () => ({
  default: () => <div>GuestHomePreview</div>,
}));

vi.mock("../components/AuthenticatedHomePreview", () => ({
  default: () => <div>AuthenticatedHomePreview</div>,
}));

vi.mock("../components/HomePreviewChart", () => ({
  default: () => <div>HomePreviewChart</div>,
}));

describe("Home", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: false,
      logout: vi.fn(),
    });
  });

  it("renders the guest home page", () => {
    render(
      <Home isOpen={false} openMenu={mockOpenMenu} closeMenu={mockCloseMenu} />,
    );

    expect(screen.getByText("GuestHomePreview")).toBeInTheDocument();

    expect(
      screen.getAllByRole("button", {
        name: "Get Started Free",
      }).length,
    ).toBeGreaterThan(1);

    expect(
      screen.queryByText("AuthenticatedHomePreview"),
    ).not.toBeInTheDocument();
  });

  it("renders the authenticated home page", () => {
    mockUseAuth.mockReturnValue({
      user: {
        first_name: "Farah",
      },
      isAuthenticated: true,
      loading: false,
      logout: vi.fn(),
    });

    render(
      <Home isOpen={false} openMenu={mockOpenMenu} closeMenu={mockCloseMenu} />,
    );

    expect(screen.getByText("AuthenticatedHomePreview")).toBeInTheDocument();

    expect(screen.queryByText("GuestHomePreview")).not.toBeInTheDocument();

    expect(screen.getByText("Welcome back, Farah")).toBeInTheDocument();
  });

  it("renders the loading state", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: true,
      logout: vi.fn(),
    });
    render(
      <Home isOpen={false} openMenu={mockOpenMenu} closeMenu={mockCloseMenu} />,
    );
    expect(screen.getByText("Loading your account...")).toBeInTheDocument();

    expect(
      screen.getByText("Loading your portfolio overview..."),
    ).toBeInTheDocument();
  });

  it("renders the navigation links", () => {
    render(
      <Home isOpen={false} openMenu={mockOpenMenu} closeMenu={mockCloseMenu} />,
    );

    expect(screen.getAllByText("Features").length).toBeGreaterThan(0);
    expect(screen.getAllByText("About").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/AI Insights/i).length).toBeGreaterThan(0);
  });
});
