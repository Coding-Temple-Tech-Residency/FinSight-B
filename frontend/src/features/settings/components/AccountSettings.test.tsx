import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AccountSettings from "./AccountSettings";

const mockNavigate = vi.fn();
const mockMutate = vi.fn();

const mockDeleteMutation = {
  mutate: mockMutate,
  isPending: false,
  isError: false,
  error: null as Error | null,
};

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../hooks/useDeleteAccount", () => ({
  useDeleteAccount: () => mockDeleteMutation,
}));

describe("AccountSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockDeleteMutation.isPending = false;
    mockDeleteMutation.isError = false;
    mockDeleteMutation.error = null;

    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("renders account settings", () => {
    render(
      <MemoryRouter>
        <AccountSettings />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", {
        name: "Delete Account",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Permanently delete your profile and associated account data.",
      ),
    ).toBeInTheDocument();
  });

  it("calls delete mutation when confirmed", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AccountSettings />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Delete Account",
      }),
    );

    expect(window.confirm).toHaveBeenCalled();

    expect(mockMutate).toHaveBeenCalled();
  });

  it("does not delete when confirmation is cancelled", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);

    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AccountSettings />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Delete Account",
      }),
    );

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("shows pending state", () => {
    mockDeleteMutation.isPending = true;

    render(
      <MemoryRouter>
        <AccountSettings />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("button", {
        name: "Deleting Account...",
      }),
    ).toBeDisabled();
  });

  it("shows error message", () => {
    mockDeleteMutation.isError = true;
    mockDeleteMutation.error = new Error("Delete failed");

    render(
      <MemoryRouter>
        <AccountSettings />
      </MemoryRouter>,
    );

    expect(screen.getByText("Delete failed")).toBeInTheDocument();
  });
});
