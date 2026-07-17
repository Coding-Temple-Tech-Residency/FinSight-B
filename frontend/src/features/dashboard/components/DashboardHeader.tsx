import { useCurrentUser } from "../../auth/hooks/useCurrentUser";
import StockSearch from "../../market/components/StockSearch";
import { useDashboard } from "../hooks/useDashboard";

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";

  return "Good Evening";
};

const DashboardHeader = () => {
  const { data: user, isLoading } = useCurrentUser();
  const { symbol } = useDashboard();

  const firstName = user?.first_name ?? "Investor";

  const greeting = getGreeting();

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="dashboard-header flex flex-col lg:flex-row justify-between gap-6 items-start lg:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold">
          {isLoading ? `${greeting} 👋` : `${greeting}, ${firstName} 👋`}
        </h1>

        <p className="opacity-70 mt-2">{formattedDate}</p>

        <p className="text-sm opacity-60 mt-1">
          Viewing market data for {symbol}.
        </p>
      </div>

      <StockSearch />
    </header>
  );
};

export default DashboardHeader;
