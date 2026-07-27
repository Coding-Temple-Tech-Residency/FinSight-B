import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import MobileDashboardNav from "./MobileDashboardNav";

vi.mock("../../constants/navigation", () => ({
  navigation: [
    {
      id: 1,
      name: "Dashboard",
      path: "/dashboard",
      icon: "icon",
    },
    {
      id: 2,
      name: "Portfolio",
      path: "/portfolio",
      icon: "icon",
    },
  ],
}));

vi.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => <span>Icon</span>,
}));

describe("MobileDashboardNav", () => {
  it("renders navigation links", () => {
    render(
      <MemoryRouter>
        <MobileDashboardNav />
      </MemoryRouter>,
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();

    expect(screen.getByText("Portfolio")).toBeInTheDocument();
  });

  it("renders correct links", () => {
    render(
      <MemoryRouter>
        <MobileDashboardNav />
      </MemoryRouter>,
    );

    expect(screen.getByText("Dashboard").closest("a")).toHaveAttribute(
      "href",
      "/dashboard",
    );

    expect(screen.getByText("Portfolio").closest("a")).toHaveAttribute(
      "href",
      "/portfolio",
    );
  });

  it("adds active class to current route", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <MobileDashboardNav />
      </MemoryRouter>,
    );

    expect(screen.getByText("Dashboard").closest("a")).toHaveClass("active");
  });
});
