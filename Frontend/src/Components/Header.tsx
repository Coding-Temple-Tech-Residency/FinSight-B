import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useBreakpoint } from "../hooks/useBreakingPoint";
import useTheme from "../hooks/useTheme";
import Logo from "./Logo";
import SearchForm from "./SearchForm";
import UserBanner from "./UserBanner";

import { faBars, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

interface HeaderProps {
  openMenu: () => void;
}

const Header = ({ openMenu }: HeaderProps) => {
  const { toggleTheme, darkTheme } = useTheme();
  const { isDesktop } = useBreakpoint();

  const theme = darkTheme ? faMoon : faSun;

  return (
    <header className="header shadow-(--bg-secondary)">
      <div className="header-container p-3 flex justify-between items-center w-full">
        <div className="header-left flex justify-between items-center gap-4 w-1/2">
          {!isDesktop && (
            <button className="menu-btn" onClick={openMenu}>
              <FontAwesomeIcon
                icon={faBars}
                className="text-2xl cursor-pointer"
              />
            </button>
          )}

          {!isDesktop && <Logo />}
          {isDesktop && <UserBanner />}
        </div>

        <div className="header-right flex items-center gap-4">
          {isDesktop && <SearchForm />}{" "}
          <button className="theme-btn">
            <FontAwesomeIcon
              icon={theme}
              className="cursor-pointer"
              onClick={toggleTheme}
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
