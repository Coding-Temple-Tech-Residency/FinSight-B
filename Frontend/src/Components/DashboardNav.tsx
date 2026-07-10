import { NavLink } from "react-router-dom";
import { navigation } from "../data/navigation";

const DashboardNav = () => {
  return (
    <nav className="dashboard-nav">
      {navigation.map((item) => (
        <NavLink
          key={item.id}
          to={item.path}
          end={item.path === "/dashboard"}
          className={({ isActive }) =>
            `dashboard-nav-link ${isActive ? "active" : ""}`
          }
        >
          {item.name}
        </NavLink>
      ))}
    </nav>
  );
};

export default DashboardNav;
