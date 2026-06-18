import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="dashboard max-h-screen h-full max-w-svw overflow-auto">
      <Header />
      <Sidebar />
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
