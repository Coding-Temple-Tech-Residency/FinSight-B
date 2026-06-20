import { Routes, Route } from "react-router-dom";

import Home from "../features/dashboard/pages/Home";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import WatchlistPage from "../features/watchlist/pages/WatchlistPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Home />} />

        <Route
          path="watchlist"
          element={
            <ProtectedRoute>
              <WatchlistPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
