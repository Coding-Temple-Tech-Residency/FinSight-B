import { useAuth } from "../features/auth/hooks/useAuth";

const UserBanner = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <article className="header-intro">
      <p className="font-semibold">
        Welcome, {isAuthenticated ? user?.firstName : "Guest"}
      </p>

      <p className="text-sm opacity-75">
        {isAuthenticated
          ? "Here's what's happening with your investments today."
          : "Log in to access your portfolio, watchlist, and AI insights."}
      </p>
    </article>
  );
};

export default UserBanner;
