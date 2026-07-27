import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import AuthForm from "./AuthForm";

const mockCloseModal = vi.fn();

vi.mock("../../../hooks/useModal", () => ({
  useModal: () => ({
    closeModal: mockCloseModal,
  }),
}));

vi.mock("./LoginForm", () => ({
  default: () => <div>LoginForm</div>,
}));

vi.mock("./RegistrationForm", () => ({
  default: () => <div>RegistrationForm</div>,
}));

vi.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => <span>Icon</span>,
}));

describe("AuthForm", () => {
  it("renders login form by default", () => {
    render(<AuthForm mode="login" />);

    expect(screen.getByText("LoginForm")).toBeInTheDocument();

    expect(screen.getByText("Need an account? Register")).toBeInTheDocument();
  });

  it("renders registration form when mode is register", () => {
    render(<AuthForm mode="register" />);

    expect(screen.getByText("RegistrationForm")).toBeInTheDocument();

    expect(
      screen.getByText("Already have an account? Login"),
    ).toBeInTheDocument();
  });

  it("switches between login and register", async () => {
    const user = userEvent.setup();

    render(<AuthForm mode="login" />);

    await user.click(
      screen.getByRole("button", {
        name: "Need an account? Register",
      }),
    );

    expect(screen.getByText("RegistrationForm")).toBeInTheDocument();

    expect(
      screen.getByText("Already have an account? Login"),
    ).toBeInTheDocument();
  });

  it("closes authentication form", async () => {
    const user = userEvent.setup();

    render(<AuthForm mode="login" />);

    await user.click(
      screen.getByRole("button", {
        name: "Close authentication form",
      }),
    );

    expect(mockCloseModal).toHaveBeenCalled();
  });
});
