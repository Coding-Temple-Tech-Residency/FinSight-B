import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  faChevronDown,
  faGear,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../features/auth/hooks/useAuth";
import ThemeButton from "../ThemeButton";
import "./ProfileMenu.css";

const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const firstName = user?.first_name ?? "Investor";
  const lastName = user?.last_name ?? "";
  const fullName = `${firstName} ${lastName}`.trim();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <div className="profile-menu" ref={menuRef}>
      <button
        type="button"
        className="profile-menu-trigger"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="profile-avatar">
          {firstName.charAt(0).toUpperCase()}
        </span>

        <span className="profile-name">{fullName}</span>

        <FontAwesomeIcon
          icon={faChevronDown}
          className={`profile-chevron ${isOpen ? "profile-chevron-open" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="profile-dropdown" role="menu">
          <div className="profile-dropdown-header">
            <strong>{fullName}</strong>
            <span>{user?.email ?? "No email available"}</span>
          </div>

          <Link
            to="/dashboard/settings"
            className="profile-dropdown-item"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            <FontAwesomeIcon icon={faGear} />
            Settings
          </Link>

          <div className="profile-dropdown-item profile-theme-row">
            <span>Appearance</span>
            <ThemeButton />
          </div>

          <div className="profile-dropdown-divider" />

          <button
            type="button"
            className="profile-dropdown-item profile-logout"
            role="menuitem"
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
