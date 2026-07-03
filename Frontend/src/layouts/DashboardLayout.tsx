import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import UserBanner from "../components/UserBanner";
import { useBreakpoint } from "../hooks/useBreakingPoint";
import MobileDashboardNav from "../components/MobileDashboardNav";

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

  return (
    <div className="dashboard-layout">
      {isDesktop && <Sidebar isOpen={isOpen} closeMenu={closeMenu} />}

      <div className="dashboard-content">
        <Header openMenu={openMenu} />

        <main className="main">
          {!isDesktop && <UserBanner />}
          <Outlet />
        </main>
      </div>

      {!isDesktop && <MobileDashboardNav />}
    </div>
  );
};

export default DashboardLayout;
