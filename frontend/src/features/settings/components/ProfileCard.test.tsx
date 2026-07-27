import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ProfileCard from "./ProfileCard";

const mockMutate = vi.fn();
const mockReset = vi.fn();

const mockUserProfile = {
  data: {
    first_name: "Farah",
    last_name: "Alansari",
    email: "farah@test.com",
  },
  isLoading: false,
  isError: false,
  error: null as Error | null,
};

const mockUpdateMutation = {
  mutate: mockMutate,
  reset: mockReset,
  isPending: false,
  isError: false,
  error: null as Error | null,
};

vi.mock("../hooks/useUserProfile", () => ({
  useUserProfile: () => mockUserProfile,
}));

vi.mock("../hooks/useUpdateUser", () => ({
  useUpdateUser: () => mockUpdateMutation,
}));

vi.mock("../../../components/ui/LoadingCard", () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

vi.mock("../../../components/ui/ErrorCard", () => ({
  default: ({ message }: { message: string }) => <div>{message}</div>,
}));

describe("ProfileCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUserProfile.data = {
      first_name: "Farah",
      last_name: "Alansari",
      email: "farah@test.com",
    };
    mockUserProfile.isLoading = false;
    mockUserProfile.isError = false;
    mockUserProfile.error = null;

    mockUpdateMutation.isPending = false;
    mockUpdateMutation.isError = false;
    mockUpdateMutation.error = null;
  });

  it("renders profile information", () => {
    render(
      <MemoryRouter>
        <ProfileCard />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "Profile" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Farah")).toBeInTheDocument();
    expect(screen.getByText("Alansari")).toBeInTheDocument();
    expect(screen.getByText("farah@test.com")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    mockUserProfile.isLoading = true;

    render(
      <MemoryRouter>
        <ProfileCard />
      </MemoryRouter>,
    );

    expect(screen.getByText("Loading profile...")).toBeInTheDocument();
  });

  it("shows error state", () => {
    mockUserProfile.isError = true;
    mockUserProfile.error = new Error("Failed to load");

    render(
      <MemoryRouter>
        <ProfileCard />
      </MemoryRouter>,
    );

    expect(screen.getByText("Failed to load")).toBeInTheDocument();
  });

  it("enters edit mode", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ProfileCard />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Edit Profile",
      }),
    );

    expect(screen.getByDisplayValue("Farah")).toBeInTheDocument();

    expect(screen.getByDisplayValue("Alansari")).toBeInTheDocument();

    expect(screen.getByDisplayValue("farah@test.com")).toBeInTheDocument();
  });

  it("calls update mutation", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ProfileCard />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Edit Profile",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Save Changes",
      }),
    );

    expect(mockMutate).toHaveBeenCalled();
  });

  it("shows update error", async () => {
    const user = userEvent.setup();

    mockUpdateMutation.isError = true;
    mockUpdateMutation.error = new Error("Update failed");

    render(
      <MemoryRouter>
        <ProfileCard />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Edit Profile",
      }),
    );

    expect(screen.getByText("Update failed")).toBeInTheDocument();
  });
});
