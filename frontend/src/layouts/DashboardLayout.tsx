import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/Header";
import MobileDashboardNav from "../components/MobileDashboardNav";
import SearchForm from "../features/search/components/SearchForm";

import { useBreakpoint } from "../hooks/useBreakingPoint";

import "./DashboardLayout.css";

const DashboardLayout = () => {
  const { isDesktop } = useBreakpoint();
  const [showSearch, setShowSearch] = useState(false);

  const closeSearch = () => {
    setShowSearch(false);
  };

  return (
    <div className="dashboard-layout">
      <Header showSearch={showSearch} setShowSearch={setShowSearch} />

      {showSearch && (
        <div id="platform-search-row" className="search-row">
          <SearchForm
            closeSearch={closeSearch}
            placeholder="Search the platform..."
            autoFocus
          />
        </div>
      )}

      <main className="main">
        <div className="main-container">
          <Outlet />
        </div>
      </main>

      {!isDesktop && <MobileDashboardNav />}
    </div>
  );
};

export default DashboardLayout;
