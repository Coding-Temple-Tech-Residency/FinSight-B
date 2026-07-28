import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import {
  getCurrentUser,
  loginUser,
  registerUser,
  type RegisterPayload,
} from "../../../api/authApi";
import { useModal } from "../../../hooks/useModal";
import { CURRENT_USER_QUERY_KEY } from "../hooks/useCurrentUser";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { closeModal } = useModal();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const registerMutation = useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      await registerUser(payload);

      return loginUser({
        email: payload.email,
        password: payload.password,
      });
    },
    onSuccess: async (data) => {
      localStorage.setItem("token", data.access_token);

      await queryClient.fetchQuery({
        queryKey: CURRENT_USER_QUERY_KEY,
        queryFn: getCurrentUser,
      });

      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      closeModal();
      navigate("/dashboard", { replace: true });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!firstName.trim()) {
      setFirstNameError("First name is required.");
      isValid = false;
    }

    if (!lastName.trim()) {
      setLastNameError("Last name is required.");
      isValid = false;
    }

    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      isValid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    }
    if (!isValid) return;

    registerMutation.mutate({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      confirm_password: confirmPassword,
    });
  };

  return (
    <div className="login-form-container">
      <form onSubmit={handleRegister} noValidate className="w-full space-y-4 ">
        <h2 className="text-xl font-bold text-center mb-3 -mt-4">
          Create Account
        </h2>

        <input
          type="text"
          placeholder="First Name"
          className="w-full border border-gray-400 rounded-xl p-4 mt-1 mb-4"
          value={firstName}
          onChange={(e) => {
            const value = e.target.value;
            setFirstName(value);
            if (value.trim() === "") {
              setFirstNameError("First name is required.");
            } else {
              setFirstNameError("");
            }
          }}
          onBlur={() => {
            if (firstName.trim() === "") {
              setFirstNameError("First name is required.");
            }
          }}
          required
        />
        {firstNameError && (
          <p className="text-red-500 text-sm">{firstNameError}</p>
        )}

        <input
          type="text"
          placeholder="Last Name"
          className="w-full border border-gray-400 rounded-xl p-4 mt-1 mb-4"
          value={lastName}
          onChange={(e) => {
            const value = e.target.value;
            setLastName(value);
            if (value.trim() === "") {
              setLastNameError("Last name is required.");
            } else {
              setLastNameError("");
            }
          }}
          onBlur={() => {
            if (lastName.trim() === "") {
              setLastNameError("Last name is required.");
            }
          }}
          required
        />
        {lastNameError && (
          <p className="text-red-500 text-sm">{lastNameError}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-400 rounded-xl p-4 mt-1 mb-4"
          value={email}
          onChange={(e) => {
            const value = e.target.value;
            setEmail(value);
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value === "" || emailRegex.test(value)) {
              setEmailError("");
            } else {
              setEmailError("Please enter a valid email address.");
            }
          }}
          onBlur={() => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
              setEmailError("Please enter a valid email address.");
            }
          }}
          required
        />
        {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-400 rounded-xl p-4 mt-1 mb-4"
          value={password}
          onChange={(e) => {
            const value = e.target.value;
            setPassword(value);
            if (value.length === 0) {
              setPasswordError("");
            } else if (value.length < 8) {
              setPasswordError("Password must be at least 8 characters.");
            } else {
              setPasswordError("");
            }
          }}
          onBlur={() => {
            if (password.length < 8) {
              setPasswordError("Password must be at least 8 characters.");
            }
          }}
          required
        />
        {passwordError && (
          <p className="text-red-500 text-sm">{passwordError}</p>
        )}

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border border-gray-400 rounded-xl p-4 mt-1 mb-4"
          value={confirmPassword}
          onChange={(e) => {
            const value = e.target.value;
            setConfirmPassword(value);
            if (value !== password) {
              setConfirmPasswordError("Passwords do not match.");
            } else {
              setConfirmPasswordError("");
            }
          }}
          onBlur={() => {
            if (confirmPassword !== password) {
              setConfirmPasswordError("Passwords do not match.");
            }
          }}
          required
        />
        {confirmPasswordError && (
          <p className="text-red-500 text-sm">{confirmPasswordError}</p>
        )}

        {registerMutation.isError && (
          <p className="text-red-500 text-sm" role="alert">
            {registerMutation.error instanceof Error
              ? registerMutation.error.message
              : "Registration failed. Please try again."}
          </p>
        )}

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full bg-emerald-500 text-white p-3 rounded-xl hover:bg-emerald-600 cursor-pointer"
        >
          {registerMutation.isPending ? "Creating account..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
