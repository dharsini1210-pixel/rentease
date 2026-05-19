import {
  useState,
} from "react";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import axios from "axios";

function Login() {

  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  // =========================
  // LOGIN FUNCTION
  // =========================
  const handleLogin =
    async (e) => {

      e.preventDefault();

      try {

        const res =
          await axios.post(

            "http://localhost:5000/api/users/login",

            {
              email,
              password,
            }
          );

        const data =
          res.data;

        console.log(data);

        // =========================
        // BLOCK ADMINS
        // =========================
        if (
          data.role === "admin"
        ) {

          alert(
            "Admins must login from Admin Login page"
          );

          return;
        }

        // =========================
        // REMOVE ADMIN SESSION
        // =========================
        localStorage.removeItem(
          "adminInfo"
        );

        // =========================
        // SAVE USER INFO
        // =========================
        localStorage.setItem(

          "userInfo",

          JSON.stringify(data)
        );

        alert(
          "Login Successful"
        );

        navigate("/");

      } catch (error) {

        console.log(error);

        alert(

          error.response?.data
            ?.message ||

          "Login Failed"
        );
      }
    };

  return (

    <div
      style={styles.container}
    >

      <form
        style={styles.card}

        onSubmit={
          handleLogin
        }
      >

        <h2>
          User Login
        </h2>

        <p>
          Welcome Back 👋
        </p>

        {/* EMAIL */}
        <input
          type="email"

          placeholder="Email"

          value={email}

          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }

          required

          style={styles.input}
        />

        {/* PASSWORD */}
        <input
          type="password"

          placeholder="Password"

          value={password}

          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }

          required

          style={styles.input}
        />

        {/* BUTTON */}
        <button
          type="submit"

          style={styles.button}
        >
          Login
        </button>

        <p
          style={{
            marginTop: "15px",
          }}
        >
          Don’t have an account?{" "}

          <Link
            to="/register"

            style={styles.link}
          >
            Register
          </Link>
        </p>

      </form>

    </div>
  );
}

// =========================
// STYLES
// =========================
const styles = {

  container: {

    height: "100vh",

    background:
      "linear-gradient(135deg, #1e3c72, #2a5298)",

    display: "flex",

    justifyContent:
      "center",

    alignItems:
      "center",
  },

  card: {

    background:
      "rgba(255,255,255,0.1)",

    backdropFilter:
      "blur(10px)",

    padding: "40px",

    borderRadius: "15px",

    color: "#fff",

    width: "320px",

    textAlign: "center",

    boxShadow:
      "0 10px 25px rgba(0,0,0,0.3)",
  },

  input: {

    width: "100%",

    padding: "12px",

    margin: "10px 0",

    borderRadius: "8px",

    border: "none",

    outline: "none",
  },

  button: {

    width: "100%",

    padding: "12px",

    background:
      "linear-gradient(135deg, #667eea, #764ba2)",

    color: "#fff",

    border: "none",

    borderRadius: "8px",

    cursor: "pointer",

    fontWeight: "bold",

    fontSize: "15px",
  },

  link: {

    color: "#a5b4fc",

    textDecoration: "none",

    fontWeight: "bold",
  },
};

export default Login;