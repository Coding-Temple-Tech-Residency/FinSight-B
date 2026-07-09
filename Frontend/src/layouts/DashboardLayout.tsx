import { Outlet } from "react-router-dom";
import { useState } from "react";

import Header from "../components/Header";
import MobileDashboardNav from "../components/MobileDashboardNav";
import SearchForm from "../components/SearchForm";

import { useBreakpoint } from "../hooks/useBreakingPoint";
import DashboardProvider from "../features/dashboard/providers/DashboardProvider";

const DashboardLayout = () => {
  const { isDesktop } = useBreakpoint();
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <DashboardProvider>
      <div className="dashboard-layout">
        <Header
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

        {!isDesktop && <MobileDashboardNav />}
      </div>
    </DashboardProvider>
  );
};

export default DashboardLayout;
