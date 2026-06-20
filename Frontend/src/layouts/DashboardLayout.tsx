import { Outlet } from "react-router-dom";

import { useModal } from "../hooks/useModal";

import AuthForm from "../features/auth/components/AuthForm";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  const { isModalOpen } = useModal();

  return (
    <div className="dashboard max-h-screen h-full max-w-svw overflow-auto">
      <Sidebar />
      <Header />
      <main className="main">
        <Outlet />
      </main>

      {isModalOpen("login") && <AuthForm />}
    </div>
  );
};

export default DashboardLayout;
