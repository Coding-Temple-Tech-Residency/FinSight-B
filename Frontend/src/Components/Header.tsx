import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useBreakpoint } from "../hooks/useBreakingPoint";
import Logo from "./Logo";
import SearchForm from "./SearchForm";
import UserBanner from "./UserBanner";
import { faMagnifyingGlass, faX } from "@fortawesome/free-solid-svg-icons";
import ThemeButton from "./ThemeBtn";

interface HeaderProps {
  openMenu: () => void;
  showMobileSearch: boolean;
  setShowMobileSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = ({ showMobileSearch, setShowMobileSearch }: HeaderProps) => {
  const { isDesktop } = useBreakpoint();

  return (
    <header className="header">
      <div className="header-container h-full px-4 flex justify-between items-center w-full">
        <div className="header-left flex items-center gap-4">
          {!isDesktop && <Logo />}
          {isDesktop && <UserBanner />}
        </div>

        <div className="header-right flex items-center justify-end gap-4">
          {isDesktop ? (
            <SearchForm />
          ) : (
            <>
              <button
                type="button"
                className="search-icon-btn"
                onClick={() => setShowMobileSearch((prev) => !prev)}
              >
                <FontAwesomeIcon
                  icon={showMobileSearch ? faX : faMagnifyingGlass}
                />
              </button>
              <ThemeButton />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
