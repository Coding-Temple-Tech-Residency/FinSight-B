import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import { navigation } from "../../constants/navigation";
import "./MobileDashboardNav.css";

const MobileDashboardNav = () => {
  return (
    <nav
      className="mobile-dashboard-nav"
      aria-label="Mobile dashboard navigation"
    >
      {navigation.map((item) => (
        <NavLink
          key={item.id}
          to={item.path}
          end={item.path === "/dashboard"}
          className={({ isActive }) =>
            `mobile-dashboard-link ${isActive ? "active" : ""}`
          }
        >
          <FontAwesomeIcon icon={item.icon} aria-hidden="true" />

          <span>{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileDashboardNav;
