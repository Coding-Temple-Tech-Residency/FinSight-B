import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/Header";
import MobileDashboardNav from "../components/MobileDashboardNav";

import { useBreakpoint } from "../hooks/useBreakingPoint";

import "./DashboardLayout.css";
import SearchForm from "../features/search/components/SearchForm";

interface DashboardLayoutProps {
  closeMenu: () => void;
}

const DashboardLayout = ({ closeMenu }: DashboardLayoutProps) => {
  const { isDesktop } = useBreakpoint();
  const [showSearch, setShowSearch] = useState(false);

  const closeSearch = () => {
    setShowSearch(false);
  };

  return (
    <div className="dashboard-layout">
      <Header
        closeMenu={closeMenu}
        showSearch={showSearch}
        setShowSearch={setShowSearch}
      />

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

      {!isDesktop && <MobileDashboardNav closeMenu={closeMenu} />}
    </div>
  );
};

export default DashboardLayout;
