import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";

import DashboardNav from "../DashboardNav";
import Logo from "../Logo";
import ProfileMenu from "../ProfileMenu";

import "./Header.css";

interface HeaderProps {
  closeMenu: () => void;
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = ({ showSearch, setShowSearch, closeMenu }: HeaderProps) => {
  const handleSearchToggle = () => {
    setShowSearch((previous) => !previous);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" onClick={closeMenu}>
            <Logo />
          </Link>

          <div className="desktop-nav">
            <DashboardNav closeMenu={closeMenu} />
          </div>
        </div>

        <div className="header-right">
          <div className="desktop-actions">
            <button
              type="button"
              className="search-icon-btn"
              aria-label={
                showSearch ? "Close platform search" : "Open platform search"
              }
              aria-expanded={showSearch}
              aria-controls="platform-search-row"
              onClick={handleSearchToggle}
            >
              <FontAwesomeIcon
                icon={showSearch ? faXmark : faMagnifyingGlass}
                aria-hidden="true"
              />
            </button>

            <ProfileMenu />
          </div>

          <div className="mobile-actions">
            <button
              type="button"
              className="search-icon-btn"
              aria-label={
                showSearch ? "Close platform search" : "Open platform search"
              }
              aria-expanded={showSearch}
              aria-controls="platform-search-row"
              onClick={handleSearchToggle}
            >
              <FontAwesomeIcon
                icon={showSearch ? faXmark : faMagnifyingGlass}
                aria-hidden="true"
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
