import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useModal } from "../hooks/useModal";
import Login from "../Components/Login";

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
