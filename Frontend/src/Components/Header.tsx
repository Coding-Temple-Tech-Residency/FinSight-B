import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useBreakpoint } from "../hooks/useBreakingPoint";
import useTheme from "../hooks/useTheme";
import Logo from "./Logo";
import SearchForm from "./SearchForm";
import UserBanner from "./UserBanner";
import { faBars, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const { toggleTheme, darkTheme } = useTheme();
  const { isDesktop } = useBreakpoint();

  const theme = darkTheme ? faMoon : faSun;
  return (
    <header className="header shadow-(--bg-secondary) flex items-center w-full">
      <div className="header-container p-3 flex justify-between w-full items-center">
        {!isDesktop && (
          <button className="menu-btn">
            <FontAwesomeIcon icon={faBars} className="text-2xl" />
          </button>
        )}
        {!isDesktop && <Logo />}
        {isDesktop && <UserBanner />}
        {isDesktop && <SearchForm />}

        <article className="header-account">
          <button className="theme-btn">
            <FontAwesomeIcon
              icon={theme}
              className="cursor-pointer"
              onClick={toggleTheme}
            />
          </button>
        </article>
      </div>
    </header>
  );
};

export default Header;
