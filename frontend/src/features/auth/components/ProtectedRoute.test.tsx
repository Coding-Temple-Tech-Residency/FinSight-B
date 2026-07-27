import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import ProtectedRoute from "./ProtectedRoute";

const mockUseAuth = vi.fn();

vi.mock("../hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

describe("ProtectedRoute", () => {
  it("renders loading state", () => {
    mockUseAuth.mockReturnValue({
      loading: true,
      isAuthenticated: false,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Dashboard</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("redirects unauthenticated users", () => {
    mockUseAuth.mockReturnValue({
      loading: false,
      isAuthenticated: false,
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <ProtectedRoute>
          <div>Dashboard</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("renders children for authenticated users", () => {
    mockUseAuth.mockReturnValue({
      loading: false,
      isAuthenticated: true,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Dashboard</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });
});
