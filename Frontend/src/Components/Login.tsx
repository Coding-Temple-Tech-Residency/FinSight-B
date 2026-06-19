import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoginForm from "./LoginForm";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useModal } from "../hooks/useModal";
import { useState } from "react";
import RegistrationForm from "./RegistrationForm";

const Login = () => {
  const [register, setRegister] = useState<boolean>(false);
  const { closeModal } = useModal();

  return (
    <aside className="login-form min-h-svh w-svw fixed top-0 left-0 flex flex-col m-auto">
      <FontAwesomeIcon
        icon={faX}
        className="absolute top-3 right-3"
        onClick={closeModal}
      />
      <section className="login-form-container w-full max-w-125 min-h-175 flex flex-col justify-center items-center m-auto">
        <article className="flex flex-col justify-evenly items-center h-full ">
          <h1 className="logo-text">Finsight</h1>
          {!register ? <LoginForm /> : <RegistrationForm />}

          <p>
            {register ? "Already have an account?" : "Don't have an account? "}
            <span onClick={() => setRegister((prev) => !prev)}>
              {register ? "Login" : "Register"}
            </span>
          </p>
        </article>
      </section>
    </aside>
  );
};

export default Login;
