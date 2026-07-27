import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import ProfileMenu from "./ProfileMenu";

const mockNavigate = vi.fn();
const mockLogout = vi.fn();

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

vi.mock("../../features/auth/hooks/useAuth", () => ({
  useAuth: () => ({
    user: {
      first_name: "Farah",
      last_name: "Alansari",
      email: "farah@test.com",
    },
    logout: mockLogout,
  }),
}));

vi.mock("../ThemeButton", () => ({
  default: () => <button>ThemeButton</button>,
}));

describe("ProfileMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the user name and avatar", () => {
    render(
      <MemoryRouter>
        <ProfileMenu />
      </MemoryRouter>,
    );

    expect(screen.getByText("Farah Alansari")).toBeInTheDocument();
    expect(screen.getByText("F")).toBeInTheDocument();
  });

  it("opens the dropdown when the profile button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ProfileMenu />
      </MemoryRouter>,
    );

    const trigger = screen.getByRole("button", {
      name: /farah alansari/i,
    });

    await user.click(trigger);

    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Appearance")).toBeInTheDocument();
    expect(screen.getByText("Sign Out")).toBeInTheDocument();
    expect(screen.getByText("ThemeButton")).toBeInTheDocument();
  });

  it("logs the user out and navigates to the home page", async () => {
    const user = userEvent.setup();

    mockLogout.mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <ProfileMenu />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", {
        name: /farah alansari/i,
      }),
    );

    await user.click(
      screen.getByRole("menuitem", {
        name: /sign out/i,
      }),
    );

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/", {
      replace: true,
    });
  });
});
