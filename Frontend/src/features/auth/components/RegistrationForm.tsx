import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { registerUser } from "../../../api/authApi";

const RegistrationForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      alert("Account created. You can now log in.");

      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    },
    onError: (error) => {
      console.error(error);
      alert("Registration failed");
    },
  });

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    registerMutation.mutate({
      full_name: fullName,
      email,
      password,
    });
  };

  return (
    <form onSubmit={handleRegister} className="w-full space-y-4">
      <h1 className="text-2xl font-bold">Create Account</h1>

      <input
        type="text"
        placeholder="Full Name"
        className="w-full border p-3 rounded"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        className="w-full border p-3 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full border p-3 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Confirm Password"
        className="w-full border p-3 rounded"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="w-full bg-black text-white p-3 rounded"
      >
        {registerMutation.isPending ? "Creating account..." : "Register"}
      </button>
    </form>
  );
};

export default RegistrationForm;
