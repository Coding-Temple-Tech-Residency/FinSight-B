import React from "react";

const LoginForm = () => {
  return (
    <form className="h-full w-full flex flex-1 flex-col">
      <article className="flex flex-col gap-1 mb-6 items-center">
        <label
          style={{
            marginTop: "8px",
            width: "420px",
            textAlign: "left",
          }}
        >
          Email
        </label>

        <input
          type="email"
          placeholder="Enter your email"
          style={{
            padding: "10px",
            width: "450px",
            border: "1px solid #ccc",
            borderRadius: "12px",
            marginTop: "5px",
            marginBottom: "15px",
          }}
        />
      </article>
      <article className="flex flex-col gap-1 mb-6 items-center">
        <label
          style={{
            marginTop: "8px",
            width: "420px",
            textAlign: "left",
          }}
        >
          Password
        </label>

        <input
          type="password"
          placeholder="Enter your password"
          style={{
            padding: "10px",
            width: "450px",
            border: "1px solid #ccc",
            borderRadius: "12px",
            marginTop: "5px",
            marginBottom: "15px",
          }}
        />
      </article>

      <article>
        <p
          style={{
            textAlign: "right",
            fontSize: "14px",
            marginTop: "-15px",
            cursor: "pointer",
            width: "450px",
            margin: "0 auto",
          }}
        >
          Forget Password?
        </p>
      </article>

      <button
        type="submit"
        style={{
          background: "#ooc48c",
          padding: "12px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          display: "block",
          width: "250px",
          margin: "20px auto",
        }}
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
