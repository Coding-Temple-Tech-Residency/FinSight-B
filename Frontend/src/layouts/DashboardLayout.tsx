import { Outlet } from "react-router-dom";

import { useModal } from "../hooks/useModal";

import AuthForm from "../features/auth/components/AuthForm";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import UserBanner from "../components/UserBanner";
import { useBreakpoint } from "../hooks/useBreakingPoint";
import { useState } from "react";
import SearchForm from "../components/SearchForm";

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isModalOpen } = useModal();
  const { isDesktop } = useBreakpoint();

  const openMenu = () => {
    setIsOpen(true);
  };
  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="dashboard max-h-screen h-full max-w-svw overflow-x-auto">
      <Sidebar isOpen={isOpen} closeMenu={closeMenu} />
      <Header openMenu={openMenu} />
      {!isDesktop && <SearchForm />}
      <main className="main max-lg:flex max-lg:flex-col gap-5">
        {!isDesktop && <UserBanner />}
        <Outlet />
      </main>

      {isModalOpen("login") && <AuthForm />}
    </div>
  );
};

export default DashboardLayout;
