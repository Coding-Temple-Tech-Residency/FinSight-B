import { Link, useNavigate } from "react-router-dom";
import { navigation } from "../data/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from "./Logo";
import { useBreakpoint } from "../hooks/useBreakingPoint";
import { useModal } from "../hooks/useModal";
import {
  faArrowRightFromBracket,
  faArrowRightToBracket,
  faBars,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  closeMenu: () => void;
}

const Sidebar = ({ isOpen, closeMenu }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { isAuthenticated, user, logout } = useAuth();
  const { isDesktop } = useBreakpoint();
  const { openModal } = useModal();
  const navigate = useNavigate();

  const nav = isAuthenticated ? navigation : navigation.slice(0, 1);

  const mobileStatus = isOpen
    ? "translate-x-0 opacity-100"
    : "-translate-x-full opacity-0";

  const desktopWidth = isCollapsed ? "lg:w-20" : "lg:w-64";

  const handleLogout = () => {
    logout();
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  return (
    <aside
      className={`
        side-bar
        flex flex-col py-2 h-svh bg-(--bg-secondary)
        transition-all duration-300
        max-lg:w-svw max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:z-50
        ${isDesktop ? desktopWidth : mobileStatus}
      `}
    >
      <div
        className={`
          flex items-center px-3 mb-6
          ${isCollapsed && isDesktop ? "justify-center" : "justify-between"}
        `}
      >
        {(!isCollapsed || !isDesktop) && <Logo />}

        {isDesktop ? (
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="text-xl cursor-pointer"
            aria-label="Toggle sidebar"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        ) : (
          <FontAwesomeIcon
            icon={faX}
            className="text-2xl cursor-pointer"
            onClick={closeMenu}
          />
        )}
      </div>

      <nav className="nav flex flex-col justify-between flex-1">
        <ul className="nav-ul space-y-2 px-3">
          {nav.map((item) => (
            <li className="nav-li relative group" key={item.id}>
              <Link
                to={item.path ? `/dashboard/${item.path}` : "/dashboard"}
                onClick={() => {
                  if (!isDesktop) closeMenu();
                }}
                className={`
                  nav-li-a flex items-center gap-3 py-4 px-3 rounded-xl
                  hover:bg-(--bg-primary) transition-all duration-300
                  ${isCollapsed && isDesktop ? "justify-center" : ""}
                `}
              >
                <FontAwesomeIcon icon={item.icon} className="text-lg" />

                {(!isCollapsed || !isDesktop) && (
                  <span className="whitespace-nowrap">{item.name}</span>
                )}
              </Link>

              {isCollapsed && isDesktop && (
                <span
                  className="
                    absolute left-full top-1/2 -translate-y-1/2 ml-3
                    rounded-md bg-(--bg-primary) px-3 py-2 text-sm
                    opacity-0 invisible group-hover:opacity-100 group-hover:visible
                    transition-all duration-200 whitespace-nowrap z-50
                  "
                >
                  {item.name}
                </span>
              )}
            </li>
          ))}
        </ul>

        {isAuthenticated ? (
          <div className="px-3 pb-4 space-y-3 text-center">
            {(!isCollapsed || !isDesktop) && (
              <p className="text-sm truncate">{user?.email}</p>
            )}

            <button
              className={`
                login-btn flex items-center justify-center gap-2 w-full
                ${isCollapsed && isDesktop ? "px-2" : ""}
              `}
              onClick={handleLogout}
            >
              {(!isCollapsed || !isDesktop) && <span>Log Out</span>}
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
            </button>
          </div>
        ) : (
          <div className="px-3 pb-4 relative group">
            <button
              className="login-btn flex items-center justify-center gap-2 w-full"
              onClick={() => openModal("login")}
            >
              {(!isCollapsed || !isDesktop) && <span>Log In</span>}
              <FontAwesomeIcon icon={faArrowRightToBracket} />
            </button>

            {isCollapsed && isDesktop && (
              <span
                className="
                  absolute left-full top-1/2 -translate-y-1/2 ml-3
                  rounded-md bg-(--bg-primary) px-3 py-2 text-sm
                  opacity-0 invisible group-hover:opacity-100 group-hover:visible
                  transition-all duration-200 whitespace-nowrap z-50
                "
              >
                Log In
              </span>
            )}
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
