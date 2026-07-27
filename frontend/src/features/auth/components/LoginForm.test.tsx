import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";

import LoginForm from "./LoginForm";

const mockMutate = vi.fn();
const mockCloseModal = vi.fn();
const mockNavigate = vi.fn();
const mockFetchQuery = vi.fn();

vi.mock("../../../hooks/useModal", () => ({
  useModal: () => ({
    closeModal: mockCloseModal,
  }),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("@tanstack/react-query", () => ({
  useMutation: () => ({
    mutate: mockMutate,
    isPending: false,
    isError: false,
  }),
  useQueryClient: () => ({
    fetchQuery: mockFetchQuery,
  }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    localStorage.clear();
  });

  it("renders login form", () => {
    render(<LoginForm />);

    expect(
      screen.getByRole("heading", {
        name: "Login",
      }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  it("shows email validation error", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText("Email"), "wrong-email");

    await user.click(
      screen.getByRole("button", {
        name: "Login",
      }),
    );

    expect(
      screen.getByText("Please enter a valid email address."),
    ).toBeInTheDocument();
  });

  it("shows password validation error", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText("Email"), "test@test.com");

    await user.type(screen.getByPlaceholderText("Password"), "123");

    await user.click(
      screen.getByRole("button", {
        name: "Login",
      }),
    );

    expect(
      screen.getByText("Password must be at least 8 characters."),
    ).toBeInTheDocument();
  });

  it("calls login mutation with valid data", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText("Email"), "test@test.com");

    await user.type(screen.getByPlaceholderText("Password"), "password123");

    await user.click(
      screen.getByRole("button", {
        name: "Login",
      }),
    );

    expect(mockMutate).toHaveBeenCalledWith({
      email: "test@test.com",
      password: "password123",
    });
  });
});
