import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faX } from "@fortawesome/free-solid-svg-icons";

import Logo from "./Logo";
import DashboardNav from "./DashboardNav";
import SearchForm from "./SearchForm";
import ProfileMenu from "./ProfileMenu";

interface HeaderProps {
  showMobileSearch: boolean;
  setShowMobileSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = ({ showMobileSearch, setShowMobileSearch }: HeaderProps) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Logo />

          <div className="desktop-nav">
            <DashboardNav />
          </div>
        </div>

        <div className="header-right">
          <div className="desktop-actions">
            <SearchForm />
            <ProfileMenu />
          </div>

          <div className="mobile-actions">
            <button
              type="button"
              className="search-icon-btn"
              onClick={() => setShowMobileSearch((prev) => !prev)}
            >
              <FontAwesomeIcon
                icon={showMobileSearch ? faX : faMagnifyingGlass}
              />
            </button>

            <ProfileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
