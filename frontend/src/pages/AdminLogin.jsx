import { useState } from "react";

import axios from "axios";

import {
  useNavigate
} from "react-router-dom";

import {
  toast
} from "react-toastify";

function AdminLogin() {

  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword
  ] = useState("");

  const [
    loading,
    setLoading
  ] = useState(false);

  // =========================
  // ADMIN LOGIN
  // =========================
  const handleLogin =
    async (e) => {

      e.preventDefault();

      setLoading(true);

      try {

        const res =
          await axios.post(

            "https://rentease-d1zx.onrender.com/api/users/login",

            {
              email,
              password,
            }
          );

        console.log(
          "LOGIN RESPONSE:",
          res.data
        );

        // =========================
        // CHECK ADMIN ROLE
        // =========================
        if (
          res.data.role !==
          "admin"
        ) {

          toast.error(
            "❌ Only Admin Allowed"
          );

          setLoading(false);

          return;
        }

        // =========================
        // REMOVE USER SESSION
        // =========================
        localStorage.removeItem(
          "userInfo"
        );

        // =========================
        // SAVE ADMIN INFO
        // =========================
        localStorage.setItem(

          "adminInfo",

          JSON.stringify({

            _id:
              res.data._id,

            name:
              res.data.name,

            email:
              res.data.email,

            role:
              res.data.role,

            token:
              res.data.token,
          })
        );

        console.log(
          "ADMIN SAVED"
        );

        // =========================
        // SUCCESS TOAST
        // =========================
        toast.success(
          "✅ Admin Login Successful"
        );

        // =========================
        // REDIRECT
        // =========================
        setTimeout(() => {

          navigate(
            "/admin/dashboard"
          );

        }, 1500);

      } catch (error) {

        console.log(
          "LOGIN ERROR:",
          error
        );

        toast.error(

          error.response?.data
            ?.message ||

          "❌ Login Failed"
        );
      }

      setLoading(false);
    };

  return (

    <div
      style={styles.page}
    >

      <form
        onSubmit={
          handleLogin
        }

        style={styles.card}
      >

        <h1
          style={styles.heading}
        >
          Admin Login
        </h1>

        <p
          style={styles.subtext}
        >
          Welcome Admin 👨‍💼
        </p>

        {/* EMAIL */}
        <input

          type="email"

          placeholder="Enter Email"

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

          placeholder="Enter Password"

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

          {
            loading

              ? "Logging in..."

              : "Login"
          }

        </button>

      </form>

    </div>
  );
}

const styles = {

  page: {

    minHeight: "100vh",

    background:
      "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",
  },

  card: {

    background:
      "rgba(255,255,255,0.1)",

    padding: "40px",

    borderRadius:
      "20px",

    width: "360px",

    backdropFilter:
      "blur(10px)",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.3)",
  },

  heading: {

    color: "white",

    textAlign: "center",

    marginBottom:
      "10px",

    fontSize: "40px",
  },

  subtext: {

    color: "#ddd",

    textAlign: "center",

    marginBottom:
      "30px",
  },

  input: {

    width: "100%",

    padding: "14px",

    marginBottom:
      "20px",

    borderRadius:
      "10px",

    border: "none",

    outline: "none",

    fontSize: "15px",
  },

  button: {

    width: "100%",

    padding: "14px",

    border: "none",

    borderRadius:
      "10px",

    background:
      "linear-gradient(135deg,#667eea,#764ba2)",

    color: "white",

    fontWeight:
      "bold",

    cursor:
      "pointer",

    fontSize: "16px",
  },
};

export default AdminLogin;