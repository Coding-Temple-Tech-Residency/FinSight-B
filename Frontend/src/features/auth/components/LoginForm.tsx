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
    <form onSubmit={handleLogin} className="w-full space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>

      <input
        type="email"
        placeholder="Email"
        className="w-full border p-3 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full border p-3 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full bg-black text-white p-3 rounded"
      >
        {loginMutation.isPending ? "Logging in..." : "Login"}
      </button>

      {loginMutation.isError && (
        <p className="text-red-500 text-sm">Login failed. Please try again.</p>
      )}
    </form>
  );
};

export default LoginForm;
