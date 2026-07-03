// components/MobileDashboardNav.tsx

import { NavLink } from "react-router-dom";
import { navigation } from "../data/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MobileDashboardNav = () => {
  return (
    <nav className="mobile-dashboard-nav">
      {navigation.map((item) => (
        <NavLink
          key={item.id}
          to={item.path ? `/dashboard/${item.path}` : "/dashboard"}
          end={!item.path}
          className={({ isActive }) =>
            `mobile-dashboard-link ${isActive ? "active" : ""}`
          }
        >
          <FontAwesomeIcon icon={item.icon} />
          <span>{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileDashboardNav;
