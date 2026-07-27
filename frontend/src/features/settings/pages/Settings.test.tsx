import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Settings from "./Settings";

vi.mock("../components/ProfileCard", () => ({
  default: () => <div>ProfileCard</div>,
}));

vi.mock("../components/ThemeSettings", () => ({
  default: () => <div>ThemeSettings</div>,
}));

vi.mock("../components/CurrencySettings", () => ({
  default: () => <div>CurrencySettings</div>,
}));

vi.mock("../components/AccountSettings", () => ({
  default: () => <div>AccountSettings</div>,
}));

describe("Settings", () => {
  it("renders the settings page", () => {
    render(<Settings />);

    expect(
      screen.getByRole("heading", { name: "Settings" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Manage your profile, appearance, currency, and account preferences.",
      ),
    ).toBeInTheDocument();

    expect(screen.getByText("ProfileCard")).toBeInTheDocument();
    expect(screen.getByText("ThemeSettings")).toBeInTheDocument();
    expect(screen.getByText("CurrencySettings")).toBeInTheDocument();
    expect(screen.getByText("AccountSettings")).toBeInTheDocument();
  });
});
