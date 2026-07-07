import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { registerUser } from "../../../api/authApi";

const RegistrationForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      alert("Account created. You can now log in.");

      setFirstName("");
      setLastName("");
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
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    });
  };

  return (
    <div className="login-form-container">
      <form onSubmit={handleRegister} className="w-full space-y-4 ">
        <h2 className="text-xl font-bold text-center mb-3 -mt-4">
          Create Account
        </h2>

        <input
          type="text"
          placeholder="First Name"
          className="w-full border border-gray-400 rounded-xl p-4 mt-1 mb-4"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Last Name"
          className="w-full border border-gray-400 rounded-xl p-4 mt-1 mb-4"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-400 rounded-xl p-4 mt-1 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-400 rounded-xl p-4 mt-1 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border border-gray-400 rounded-xl p-4 mt-1 mb-4"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

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
