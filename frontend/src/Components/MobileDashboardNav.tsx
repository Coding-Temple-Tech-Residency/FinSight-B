import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { navigation } from "../constants/navigation";

interface MobileDashboardNavProps {
  closeMenu: () => void;
}

const MobileDashboardNav = ({ closeMenu }: MobileDashboardNavProps) => {
  return (
    <nav className="mobile-dashboard-nav">
      {navigation.map((item) => (
        <NavLink
          key={item.id}
          to={item.path}
          end={item.path === "/dashboard"}
          onClick={closeMenu}
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
