import { Link, useNavigate } from "react-router-dom";
import { navigation } from "../data/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useBreakpoint } from "../hooks/useBreakingPoint";
import {
  faArrowRightFromBracket,
  faBars,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../features/auth/hooks/useAuth";

interface SidebarProps {
  isOpen: boolean;
  closeMenu: () => void;
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({
  isOpen,
  closeMenu,
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) => {
  const { user, logout } = useAuth();
  const { isDesktop } = useBreakpoint();
  const navigate = useNavigate();

  const mobileStatus = isOpen
    ? "translate-x-0 opacity-100"
    : "-translate-x-full opacity-0";

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <aside
      className={`
        side-bar
        flex flex-col py-2 h-svh bg-(--bg-primary)
        transition-all duration-300
        max-lg:w-svw max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:z-50
        ${!isDesktop ? mobileStatus : ""}
      `}
    >
      <div
        className={`
          flex items-center px-3 mb-6
          ${isCollapsed && isDesktop ? "justify-center flex-col gap-3" : "justify-between"}
        `}
      >
        <h1 className="logo-text px-3 z-60">
          {isDesktop && !isCollapsed ? "FinSight" : "FS"}
        </h1>

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
          {navigation.map((item) => (
            <li className="nav-li relative group" key={item.id}>
              <Link
                to={item.path ? `/dashboard/${item.path}` : "/dashboard"}
                onClick={() => {
                  if (!isDesktop) closeMenu();
                }}
                className={`
                  nav-li-a flex items-center gap-3 py-4 px-3 rounded-xl
                  hover:bg-(--bg-secondary) transition-opacity duration-300
                  ${isCollapsed && isDesktop ? "justify-center" : ""}
                `}
              >
                <FontAwesomeIcon icon={item.icon} className="text-lg" />

                {(!isCollapsed || !isDesktop) && (
                  <span
                    className={`whitespace-nowrap ${isCollapsed && isDesktop ? "opacity-0" : "opacity-100"}`}
                  >
                    {item.name}
                  </span>
                )}
              </Link>

              {isCollapsed && isDesktop && (
                <span
                  className="
                    absolute left-full top-1/2 -translate-y-1/2 ml-3
                    rounded-md bg-(--bg-secondary) px-3 py-2 text-sm
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
      </nav>
    </aside>
  );
};

export default Sidebar;
