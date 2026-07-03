import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useBreakpoint } from "../hooks/useBreakingPoint";
import Logo from "./Logo";
import SearchForm from "./SearchForm";
import UserBanner from "./UserBanner";
import { faBars, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

interface HeaderProps {
  openMenu: () => void;
}

const Header = ({ openMenu }: HeaderProps) => {
  const { isDesktop } = useBreakpoint();

  return (
    <header className="header">
      <div className="header-container h-full px-4 flex justify-between items-center w-full">
        <div className="header-left flex items-center gap-4">
          {!isDesktop && (
            <button className="menu-btn" onClick={openMenu}>
              <FontAwesomeIcon icon={faBars} className="text-xl" />
            </button>
          )}

          {!isDesktop && <Logo />}
          {isDesktop && <UserBanner />}
        </div>

        <div className="header-right flex items-center justify-end gap-4">
          {isDesktop ? (
            <SearchForm />
          ) : (
            <button className="search-icon-btn">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
