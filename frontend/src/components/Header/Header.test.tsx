import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import Header from "./Header";

vi.mock("../DashboardNav", () => ({
  default: () => <div>DashboardNav</div>,
}));

vi.mock("../Logo", () => ({
  default: () => <div>Logo</div>,
}));

vi.mock("../ProfileMenu", () => ({
  default: () => <div>ProfileMenu</div>,
}));

vi.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => <span>Icon</span>,
}));

describe("Header", () => {
  it("renders the logo, navigation, and profile menu", () => {
    render(
      <MemoryRouter>
        <Header showSearch={false} setShowSearch={vi.fn()} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Logo")).toBeInTheDocument();
    expect(screen.getByText("DashboardNav")).toBeInTheDocument();
    expect(screen.getByText("ProfileMenu")).toBeInTheDocument();
  });

  it("shows the open search buttons when search is closed", () => {
    render(
      <MemoryRouter>
        <Header showSearch={false} setShowSearch={vi.fn()} />
      </MemoryRouter>,
    );

    expect(
      screen.getAllByRole("button", {
        name: "Open platform search",
      }),
    ).toHaveLength(2);
  });

  it("shows the close search buttons when search is open", () => {
    render(
      <MemoryRouter>
        <Header showSearch={true} setShowSearch={vi.fn()} />
      </MemoryRouter>,
    );

    expect(
      screen.getAllByRole("button", {
        name: "Close platform search",
      }),
    ).toHaveLength(2);
  });

  it("calls setShowSearch when a search button is clicked", async () => {
    const user = userEvent.setup();
    const setShowSearch = vi.fn();

    render(
      <MemoryRouter>
        <Header showSearch={false} setShowSearch={setShowSearch} />
      </MemoryRouter>,
    );

    const buttons = screen.getAllByRole("button", {
      name: "Open platform search",
    });

    await user.click(buttons[0]);

    expect(setShowSearch).toHaveBeenCalledTimes(1);
  });
});
