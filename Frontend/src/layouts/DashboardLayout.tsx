import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import UserBanner from "../components/UserBanner";
import { useBreakpoint } from "../hooks/useBreakingPoint";
import MobileDashboardNav from "../components/MobileDashboardNav";
import SearchForm from "../components/SearchForm";
import { useState } from "react";
import ThemeButton from "../components/ThemeBtn";

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
        {!isDesktop && <UserBanner />}
        <Outlet />
      </main>

      {isDesktop && <ThemeButton />}
      {!isDesktop && <MobileDashboardNav />}
    </div>
  );
};

export default DashboardLayout;
