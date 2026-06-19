import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

import { useModal } from "../../../hooks/useModal";
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";

const AuthForm = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const { closeModal } = useModal();

  return (
    <aside className="login-form min-h-svh w-svw fixed top-0 left-0 z-50 bg-white">
      <button
        type="button"
        className="absolute top-3 right-3 cursor-pointer text-2xl"
        onClick={closeModal}
        aria-label="Close login modal"
      >
        <FontAwesomeIcon icon={faX} />
      </button>

      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-4">
          <h1 className="logo-text text-center">FinSight</h1>

          {isRegistering ? <RegistrationForm /> : <LoginForm />}

          <button
            type="button"
            className="w-full text-sm underline"
            onClick={() => setIsRegistering((prev) => !prev)}
          >
            {isRegistering ? "Already have an account?" : "Need an account?"}
          </button>
        </div>
      </section>
    </aside>
  );
};

export default AuthForm;
