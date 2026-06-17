const Login = () => {
  return (
    <div>
      <h1>Finsight</h1>
      <br />

      <form>
        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            placeholder="Enter your email"
            style={{
              padding: "10px",
              width: "250px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              marginTop: "5px",
              marginBottom: "15px",
            }}
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            placeholder="Enter your password"
            style={{
              padding: "10px",
              width: "250px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              marginTop: "5px",
              marginBottom: "15px",
            }}
          />
          <br />
        </div>
        <br />
        <p
          style={{
            textAlign: "center",
            fontSize: "14px",
            marginTop: "5px",
            cursor: "pointer",
          }}
        >
          Forget Password?
        </p>

        <div>
          <button
            type="submit"
            style={{
              color: "white",
              background: "#ooc48c",
              padding: "10px 20px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              display: "block",
              width: "100%",
            }}
          >
            Login
          </button>
        </div>
      </form>

      <p>Don't have an account ? Register</p>
    </div>
  );
};

export default Login;
