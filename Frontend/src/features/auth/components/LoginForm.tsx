import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { loginUser } from "../../../api/authApi";
import { useModal } from "../../../hooks/useModal";

const LoginForm = () => {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      localStorage.setItem("token", data.access_token);

      await queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });

      closeModal();
    },
    onError: (error) => {
      console.error(error);
      alert("Login failed");
    },
  });

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    loginMutation.mutate({
      email,
      password,
    });
  };

  return (
    <div className="login-form-container">
      <form onSubmit={handleLogin} className="w-full space-y-4">
        <h2 className="text-xl font-bold text-center mb-3 -mt-4">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full max-w-xl p-3 border border-gray-300 rounded-xl px-4 py-4 mb-5"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border border-gray-300 rounded-xl px-4 py-4 mb-5"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
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
