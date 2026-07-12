import { NavLink } from "react-router-dom";
import { navigation } from "../constants/navigation";

interface DashboardNavProps {
  closeMenu: () => void;
}

const DashboardNav = ({ closeMenu }: DashboardNavProps) => {
  return (
    <nav className="dashboard-nav">
      {navigation.map((item) => (
        <NavLink
          key={item.id}
          to={item.path}
          end={item.path === "/dashboard"}
          onClick={closeMenu}
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
