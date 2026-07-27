import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import RegistrationForm from "./RegistrationForm";

const mockMutate = vi.fn();

vi.mock("@tanstack/react-query", () => ({
  useMutation: () => ({
    mutate: mockMutate,
    isPending: false,
    isError: false,
  }),
}));

describe("RegistrationForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders registration form", () => {
    render(<RegistrationForm />);

    expect(
      screen.getByRole("heading", {
        name: "Create Account",
      }),
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Last Name")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  });

  it("shows required field errors", async () => {
    const user = userEvent.setup();

    render(<RegistrationForm />);

    await user.click(
      screen.getByRole("button", {
        name: "Register",
      }),
    );

    expect(screen.getByText("First name is required.")).toBeInTheDocument();

    expect(screen.getByText("Last name is required.")).toBeInTheDocument();
  });

  it("shows invalid email error", async () => {
    const user = userEvent.setup();

    render(<RegistrationForm />);

    await user.type(screen.getByPlaceholderText("First Name"), "John");

    await user.type(screen.getByPlaceholderText("Last Name"), "Smith");

    await user.type(screen.getByPlaceholderText("Email"), "wrong-email");

    await user.click(
      screen.getByRole("button", {
        name: "Register",
      }),
    );

    expect(
      screen.getByText("Please enter a valid email address."),
    ).toBeInTheDocument();
  });

  it("shows password mismatch error", async () => {
    const user = userEvent.setup();

    render(<RegistrationForm />);

    await user.type(screen.getByPlaceholderText("Password"), "password123");

    await user.type(
      screen.getByPlaceholderText("Confirm Password"),
      "different123",
    );

    expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
  });

  it("calls register mutation with valid data", async () => {
    const user = userEvent.setup();

    render(<RegistrationForm />);

    await user.type(screen.getByPlaceholderText("First Name"), "John");

    await user.type(screen.getByPlaceholderText("Last Name"), "Smith");

    await user.type(screen.getByPlaceholderText("Email"), "john@test.com");

    await user.type(screen.getByPlaceholderText("Password"), "password123");

    await user.type(
      screen.getByPlaceholderText("Confirm Password"),
      "password123",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Register",
      }),
    );

    expect(mockMutate).toHaveBeenCalledWith({
      first_name: "John",
      last_name: "Smith",
      email: "john@test.com",
      password: "password123",
      confirm_password: "password123",
    });
  });
});
