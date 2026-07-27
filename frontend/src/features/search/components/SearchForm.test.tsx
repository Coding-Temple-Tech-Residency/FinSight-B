import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import SearchForm from "./SearchForm";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      pathname: "/dashboard",
      search: "",
    }),
  };
});
vi.mock("../hooks/useDebouncedValue", () => ({
  useDebouncedValue: (value: string) => value,
}));

vi.mock("../hooks/useUniversalSearch", () => ({
  useUniversalSearch: () => ({
    data: [],
    isLoading: false,
    isFetching: false,
    isError: false,
    error: null,
  }),
}));

vi.mock("./SearchResultGroup", () => ({
  default: () => null,
}));

vi.mock("./states/SearchLoadingState", () => ({
  default: () => null,
}));

vi.mock("./states/SearchErrorState", () => ({
  default: () => null,
}));

vi.mock("./states/SearchEmptyState", () => ({
  default: () => null,
}));

vi.mock("../../market/components/StockDetailsModal", () => ({
  default: () => null,
}));
describe("SearchForm", () => {
  const closeSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders search input and submit button", () => {
    render(
      <MemoryRouter>
        <SearchForm closeSearch={closeSearch} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("searchbox")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Submit search",
      }),
    ).toBeDisabled();
  });

  it("enables submit button when user types", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <SearchForm closeSearch={closeSearch} />
      </MemoryRouter>,
    );

    await user.type(screen.getByRole("searchbox"), "Apple");

    expect(
      screen.getByRole("button", {
        name: "Submit search",
      }),
    ).toBeEnabled();
  });

  it("navigates when form is submitted", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <SearchForm closeSearch={closeSearch} />
      </MemoryRouter>,
    );

    await user.type(screen.getByRole("searchbox"), "Apple");

    await user.click(
      screen.getByRole("button", {
        name: "Submit search",
      }),
    );

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard/search?q=Apple");

    expect(closeSearch).toHaveBeenCalledTimes(1);
  });

  it("shows clear button when input has text", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <SearchForm closeSearch={closeSearch} />
      </MemoryRouter>,
    );

    await user.type(screen.getByRole("searchbox"), "Tesla");

    expect(
      screen.getByRole("button", {
        name: "Clear search",
      }),
    ).toBeInTheDocument();
  });

  it("clears the search input", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <SearchForm closeSearch={closeSearch} />
      </MemoryRouter>,
    );

    const input = screen.getByRole("searchbox");

    await user.type(input, "Tesla");

    await user.click(
      screen.getByRole("button", {
        name: "Clear search",
      }),
    );

    expect(input).toHaveValue("");

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("renders custom placeholder", () => {
    render(
      <MemoryRouter>
        <SearchForm placeholder="Search stocks..." />
      </MemoryRouter>,
    );

    expect(screen.getByPlaceholderText("Search stocks...")).toBeInTheDocument();
  });
});
