import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

import { useModal } from "../../../hooks/useModal";
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";

type AuthMode = "login" | "register";

const AuthForm = ({ mode }: { mode: AuthMode }) => {
  const [isRegistering, setIsRegistering] = useState(mode === "register");
  const { closeModal } = useModal();

  return (
    <aside className="login-form min-h-svh w-svw fixed top-0 left-0 z-90 ">
      <button
        type="button"
        className="absolute top-3 right-3 cursor-pointer text-2xl close-btn"
        onClick={closeModal}
        aria-label="Close auth modal"
      >
        <FontAwesomeIcon icon={faX} />
      </button>

      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="login-form-container w-full max-w-lg space-y-1 pt-2">
          <h1 className="logo-text text-center mb-5">FinSight</h1>

          {isRegistering ? <RegistrationForm /> : <LoginForm />}

          <button
            type="button"
            className="w-full text-sm underline text-grey-800 font-semibold mt-5 cursor-pointer"
            onClick={() => setIsRegistering((prev) => !prev)}
          >
            {isRegistering
              ? "Already have an account? Login"
              : "Need an account? Register"}
          </button>
        </div>
      </section>
    </aside>
  );
};

export default AuthForm;
