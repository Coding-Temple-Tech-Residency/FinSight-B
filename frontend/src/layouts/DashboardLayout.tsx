import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/Header";
import MobileDashboardNav from "../components/MobileDashboardNav";
import SearchForm from "../components/SearchForm";

import DashboardProvider from "../features/dashboard/providers/DashboardProvider";
import { useBreakpoint } from "../hooks/useBreakingPoint";

interface DashboardLayoutProps {
  closeMenu: () => void;
}

const DashboardLayout = ({ closeMenu }: DashboardLayoutProps) => {
  const { isDesktop } = useBreakpoint();

  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <DashboardProvider>
      <div className="dashboard-layout">
        <Header
          closeMenu={closeMenu}
          showMobileSearch={showMobileSearch}
          setShowMobileSearch={setShowMobileSearch}
        />

        {!isDesktop && showMobileSearch && (
          <div className="mobile-search-row">
            <SearchForm />
          </div>
        )}

        <main className="main">
          <Outlet />
        </main>

        {!isDesktop && <MobileDashboardNav closeMenu={closeMenu} />}
      </div>
    </DashboardProvider>
  );
};

export default DashboardLayout;
