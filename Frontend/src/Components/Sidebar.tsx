import { Link } from "react-router-dom";
import { navigation } from "../data/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from "./Logo";
import { useBreakpoint } from "../hooks/useBreakingPoint";
import { useModal } from "../hooks/useModal";
import { faArrowRightToBracket, faX } from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const isLoggedIn = false;
  const { isDesktop } = useBreakpoint();
  const { openModal } = useModal();
  const nav = !isLoggedIn ? navigation.slice(0, 1) : navigation;
  return (
    <aside className="side-bar py-2 max-lg:h-svh max-lg:w-svw lg:flex flex-col max-lg:fixed max-lg:top-0 max-lg:left-0  hidden">
      <div className="flex justify-between items-center pr-3">
        <Logo />
        {!isDesktop && <FontAwesomeIcon icon={faX} className="text-2xl" />}
      </div>

      <nav className="nav flex flex-col justify-between h-full">
        <ul className="nav-ul">
          {nav.map((item) => (
            <li className="nav-li" key={item.id}>
              <Link
                to={`/${item.path}`}
                className={"nav-li-a block py-5 px-3 w-full"}
              >
                <FontAwesomeIcon icon={item.icon} className="pr-3" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        <button className="login-btn" onClick={() => openModal("login")}>
          <span className="pr-1"> Log In</span>
          <FontAwesomeIcon icon={faArrowRightToBracket} />
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
