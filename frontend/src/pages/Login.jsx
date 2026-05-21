import { useState } from "react";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import axios from "axios";

import { toast } from "react-toastify";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  // LOGIN FUNCTION
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

        const data = res.data;

        // BLOCK ADMINS
        if (data.role === "admin") {

          toast.warning(
            "Admins must login from Admin Login page"
          );

          return;
        }

        localStorage.removeItem(
          "adminInfo"
        );

        localStorage.setItem(
          "userInfo",
          JSON.stringify(data)
        );

        toast.success(
          "Login Successful 🎉"
        );

        navigate("/");

      } catch (error) {

        toast.error(
          error.response?.data?.message ||
          "Login Failed"
        );
      }
    };

  return (

    <div style={styles.container}>

      {/* LEFT SIDE */}
      <div style={styles.leftSection}>

        <h1 style={styles.brand}>
          RentEase
        </h1>

        <p style={styles.tagline}>
          Smart Furniture &
          Appliance Rentals
        </p>

        <div style={styles.featureBox}>
          <h3>
            Why Choose RentEase?
          </h3>

          <ul style={styles.list}>
            <li>✔ Affordable monthly rentals</li>
            <li>✔ Premium furniture collection</li>
            <li>✔ Easy online booking</li>
            <li>✔ Fast delivery & support</li>
          </ul>
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div style={styles.rightSection}>

        <form
          style={styles.card}
          onSubmit={handleLogin}
        >

          <h2 style={styles.title}>
            Welcome Back
          </h2>

          <p style={styles.subtitle}>
            Login to continue
          </p>

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
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
              setPassword(e.target.value)
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

          {/* REGISTER */}
          <p style={styles.registerText}>
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

    </div>
  );
}

// =========================
// STYLES
// =========================

const styles = {

  container: {

    display: "flex",

    height: "100vh",

    fontFamily:
      "'Segoe UI', sans-serif",
  },

  // LEFT SECTION

  leftSection: {

    flex: 1,

    background:
      "linear-gradient(135deg, #0f172a, #1e293b)",

    color: "#fff",

    display: "flex",

    flexDirection: "column",

    justifyContent: "center",

    padding: "80px",
  },

  brand: {

    fontSize: "56px",

    fontWeight: "bold",

    marginBottom: "10px",
  },

  tagline: {

    fontSize: "20px",

    color: "#cbd5e1",

    marginBottom: "40px",
  },

  featureBox: {

    background:
      "rgba(255,255,255,0.08)",

    padding: "25px",

    borderRadius: "16px",

    width: "80%",
  },

  list: {

    marginTop: "15px",

    lineHeight: "2",

    color: "#e2e8f0",
  },

  // RIGHT SECTION

  rightSection: {

    flex: 1,

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    background: "#f8fafc",
  },

  // CARD

  card: {

    width: "380px",

    background: "#fff",

    padding: "45px",

    borderRadius: "20px",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
  },

  title: {

    fontSize: "32px",

    marginBottom: "10px",

    color: "#0f172a",
  },

  subtitle: {

    color: "#64748b",

    marginBottom: "30px",
  },

  // INPUTS

  input: {

    width: "100%",

    padding: "14px",

    marginBottom: "18px",

    borderRadius: "10px",

    border: "1px solid #cbd5e1",

    fontSize: "15px",

    outline: "none",

    background: "#fff",
  },

  // BUTTON

  button: {

    width: "100%",

    padding: "14px",

    background:
      "linear-gradient(135deg, #2563eb, #4f46e5)",

    color: "#fff",

    border: "none",

    borderRadius: "10px",

    fontSize: "16px",

    fontWeight: "bold",

    cursor: "pointer",

    marginTop: "10px",
  },

  // REGISTER

  registerText: {

    marginTop: "20px",

    textAlign: "center",

    color: "#64748b",
  },

  link: {

    color: "#2563eb",

    textDecoration: "none",

    fontWeight: "bold",
  },
};

export default Login;