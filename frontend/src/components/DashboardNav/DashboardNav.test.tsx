import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import DashboardNav from "./DashboardNav";
import { navigation } from "../../constants/navigation";

describe("DashboardNav", () => {
  it("renders all navigation links", () => {
    render(
      <MemoryRouter>
        <DashboardNav />
      </MemoryRouter>,
    );

    navigation.forEach((item) => {
      expect(
        screen.getByRole("link", {
          name: item.name,
        }),
      ).toBeInTheDocument();
    });
  });

  it("renders links with the correct destinations", () => {
    render(
      <MemoryRouter>
        <DashboardNav />
      </MemoryRouter>,
    );

    navigation.forEach((item) => {
      expect(
        screen.getByRole("link", {
          name: item.name,
        }),
      ).toHaveAttribute("href", item.path);
    });
  });
});
