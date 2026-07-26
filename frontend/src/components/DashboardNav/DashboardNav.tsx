import { NavLink } from "react-router-dom";
import { navigation } from "../../constants/navigation";
import "./DashboardNav.css";

const DashboardNav = () => {
  return (
    <nav className="dashboard-nav" aria-label="Dashboard navigation">
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
