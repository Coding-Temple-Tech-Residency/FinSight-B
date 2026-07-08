import { Outlet } from "react-router-dom";
import { useState } from "react";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MobileDashboardNav from "../components/MobileDashboardNav";
import SearchForm from "../components/SearchForm";
import ThemeButton from "../components/ThemeButton";

import { useBreakpoint } from "../hooks/useBreakingPoint";
import DashboardProvider from "../features/dashboard/providers/DashboardProvider";

const DashboardLayout = ({
  isOpen,
  openMenu,
  closeMenu,
}: {
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
}) => {
  const { isDesktop } = useBreakpoint();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <DashboardProvider>
      <div
        className={`dashboard-layout ${
          isSidebarCollapsed ? "sidebar-collapsed" : ""
        }`}
      >
        {isDesktop && (
          <Sidebar
            isOpen={isOpen}
            closeMenu={closeMenu}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
          />
        )}

        <Header
          openMenu={openMenu}
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

        {isDesktop && <ThemeButton />}
        {!isDesktop && <MobileDashboardNav />}
      </div>
    </DashboardProvider>
  );
};

export default DashboardLayout;
