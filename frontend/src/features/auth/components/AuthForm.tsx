import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

import { useModal } from "../../../hooks/useModal";

import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";

import "../styles/auth.css";

type AuthMode = "login" | "register";

type AuthFormProps = {
  mode: AuthMode;
};

const AuthForm = ({ mode }: AuthFormProps) => {
  const [isRegistering, setIsRegistering] = useState(mode === "register");

  const { closeModal } = useModal();

  return (
    <aside className="login-form fixed top-0 left-0 z-90 min-h-svh w-svw">
      <button
        type="button"
        className="close-btn absolute top-3 right-3 cursor-pointer text-2xl"
        onClick={closeModal}
        aria-label="Close authentication form"
      >
        <FontAwesomeIcon icon={faX} />
      </button>

      <section className="flex min-h-screen items-center justify-center px-4">
        <div className="login-form-container w-full max-w-lg space-y-1 pt-2">
          <h1 className="logo-text mb-5 text-center">FinSight</h1>

          {isRegistering ? <RegistrationForm /> : <LoginForm />}

          <button
            type="button"
            className="mt-5 w-full cursor-pointer text-sm font-semibold underline"
            onClick={() => {
              setIsRegistering((previousMode) => !previousMode);
            }}
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
