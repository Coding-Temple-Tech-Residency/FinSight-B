import { Routes, Route } from "react-router-dom";

import Home from "../features/dashboard/pages/Home";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import WatchlistPage from "../features/watchlist/pages/WatchlistPage";
import Portfolio from "../features/portfolio/pages/Portfolio";
import Insights from "../features/insights/pages/Insights";
import Chat from "../features/chat/pages/Chat";
import Settings from "../features/settings/pages/Settings";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Home />} />

        <Route
          path="portfolio"
          element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          }
        />

        <Route
          path="watchlist"
          element={
            <ProtectedRoute>
              <WatchlistPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="insights"
          element={
            <ProtectedRoute>
              <Insights />
            </ProtectedRoute>
          }
        />
        <Route
          path="chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
