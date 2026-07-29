import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getCurrentUser, loginUser } from "../../../api/authApi";

import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      localStorage.setItem("token", data.access_token);

      await queryClient.fetchQuery({
        queryKey: ["current-user"],
        queryFn: getCurrentUser,
      });

      navigate("/dashboard", { replace: true });
    },
    onError: (error) => {
      console.error(error);
      alert("Login failed");
    },
  });

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      isValid = false;
    }
    if (!isValid) {
      return;
    }

    loginMutation.mutate({
      email,
      password,
    });
  };

  return (
    <div className="login-form-container">
      <form onSubmit={handleLogin} noValidate className="w-full space-y-4">
        <h2 className="text-xl font-bold text-center mb-3 -mt-4">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full max-w-xl p-3 border border-gray-300 rounded-xl px-4 py-4 mb-5"
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
        />
        {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border border-gray-300 rounded-xl px-4 py-4 mb-5"
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
        />
        {passwordError && (
          <p className="text-red-500 text-sm">{passwordError}</p>
        )}
        <p className="text-right font-semibold text-emerald-500 cursor-pointer">
          Forget Password?
        </p>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full bg-emerald-500 text-white p-3 rounded-xl hover:bg-emerald-600 cursor-pointer"
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </button>

        {loginMutation.isError && (
          <p className="text-red-500 text-sm">
            Login failed. Please try again.
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
