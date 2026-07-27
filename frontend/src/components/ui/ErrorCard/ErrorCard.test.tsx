import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import ErrorCard from "./ErrorCard";

describe("ErrorCard", () => {
  it("renders the default heading and message", () => {
    render(<ErrorCard />);

    expect(screen.getByText("Unable to load data")).toBeInTheDocument();

    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
  });

  it("renders a custom error message", () => {
    render(<ErrorCard message="Unable to connect to the server." />);

    expect(
      screen.getByText("Unable to connect to the server."),
    ).toBeInTheDocument();
  });

  it("renders the error heading", () => {
    render(<ErrorCard />);

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Unable to load data",
      }),
    ).toBeInTheDocument();
  });
});
