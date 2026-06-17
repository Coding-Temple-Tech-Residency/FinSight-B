import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <>
      <main className="main">
        <Outlet />
      </main>
    </>
  );
};

export default DashboardLayout;
