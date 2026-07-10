import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  faChevronDown,
  faGear,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useAuth } from "../features/auth/hooks/useAuth";
import ThemeButton from "./ThemeButton";

const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const firstName = user?.first_name ?? "User";
  const lastName = user?.last_name ?? "";
  const fullName = `${firstName} ${lastName}`.trim();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  return (
    <div className="profile-menu" ref={menuRef}>
      <button
        type="button"
        className="profile-menu-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="profile-avatar">
          {firstName.charAt(0).toUpperCase()}
        </span>

        <span className="profile-name">{fullName}</span>

        <FontAwesomeIcon icon={faChevronDown} className="profile-chevron" />
      </button>

      {isOpen && (
        <div className="profile-dropdown">
          <div className="profile-dropdown-header">
            <strong>{fullName}</strong>
            <span>{user?.email}</span>
          </div>

          <Link
            to="/dashboard/settings"
            className="profile-dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            <FontAwesomeIcon icon={faUser} />
            Profile
          </Link>

          <Link
            to="/dashboard/settings"
            className="profile-dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            <FontAwesomeIcon icon={faGear} />
            Settings
          </Link>

          <div className="profile-dropdown-item profile-theme-row">
            <span>Theme</span>
            <ThemeButton />
          </div>

          <button
            type="button"
            className="profile-dropdown-item profile-logout"
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
