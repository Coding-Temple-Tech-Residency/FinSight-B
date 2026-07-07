import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";

import { useAuth } from "../features/auth/hooks/useAuth";

const UserAvatar = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <button className="flex items-center gap-3">
      <div className="text-right hidden lg:block">
        <p className="text-sm font-medium">
          {isAuthenticated ? user?.email : "Guest"}
        </p>
      </div>

      <FontAwesomeIcon icon={faUserCircle} className="text-3xl" />
    </button>
  );
};

export default UserAvatar;
