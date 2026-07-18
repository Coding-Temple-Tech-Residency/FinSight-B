import { useState } from "react";
import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "../features/auth/components/ProtectedRoute";

import Dashboard from "../features/dashboard/pages/Dashboard";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../features/home/pages/Home";
import WatchlistPage from "../features/watchlist/pages/WatchlistPage";
import Portfolio from "../features/portfolio/pages/Portfolio";
import Insights from "../features/insights/pages/Insights";
import Chat from "../features/chat/pages/Chat";
import Settings from "../features/settings/pages/Settings";

const AppRoutes = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home isOpen={isOpen} openMenu={openMenu} closeMenu={closeMenu} />
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout closeMenu={closeMenu} />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="watchlist" element={<WatchlistPage />} />
        <Route path="insights" element={<Insights />} />
        <Route path="chat" element={<Chat />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
