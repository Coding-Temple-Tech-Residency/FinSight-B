import { Outlet } from "react-router-dom";

import { useModal } from "../hooks/useModal";
import Login from "../Components/Login";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";

const DashboardLayout = () => {
  const { isModalOpen } = useModal();

  return (
    <div className="dashboard max-h-screen h-full max-w-svw overflow-auto">
      <Header />
      <Sidebar />
      <main className="main">
        <Outlet />
      </main>
      {isModalOpen("login") && <Login />}
    </div>
  );
};

export default DashboardLayout;
