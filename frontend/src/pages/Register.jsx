import React, { useState } from "react";

import axios from "axios";

import {
  useNavigate,
  Link,
} from "react-router-dom";

const Register = () => {

  const navigate =
    useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  // =========================
  // PHONE STATE
  // =========================
  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  // =========================
  // REGISTER FUNCTION
  // =========================
  const handleRegister =
    async (e) => {

      e.preventDefault();

      // =========================
      // PHONE VALIDATION
      // =========================
      if (
        phone.length !== 10
      ) {

        return alert(
          "Phone number must be 10 digits"
        );
      }

      try {

        // =========================
        // API CALL
        // =========================
        const res =
          await axios.post(

            "http://localhost:5000/api/users/register",

            {
              name,
              email,
              phone,
              password,
            }
          );

        console.log(
          "REGISTER RESPONSE:",
          res.data
        );

        // =========================
        // SAVE USER INFO
        // =========================
        localStorage.setItem(

          "userInfo",

          JSON.stringify(
            res.data
          )
        );

        // =========================
        // SUCCESS MESSAGE
        // =========================
        alert(
          "Registration Successful 🎉"
        );

        // =========================
        // REDIRECT
        // =========================
        navigate("/products");

      } catch (err) {

        console.log(
          "REGISTER ERROR:",
          err
        );

        alert(

          err.response?.data
            ?.message ||

          err.message ||

          "Registration Failed"
        );
      }
    };

  return (

    <div style={styles.container}>

      <form
        style={styles.card}

        onSubmit={
          handleRegister
        }
      >

        <h2>
          Create Account
        </h2>

        <p>
          Join RentEase 🚀
        </p>

        {/* NAME */}
        <input
          type="text"

          placeholder="Full Name"

          style={styles.input}

          value={name}

          onChange={(e) =>
            setName(
              e.target.value
            )
          }

          required
        />

        {/* EMAIL */}
        <input
          type="email"

          placeholder="Email"

          style={styles.input}

          value={email}

          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }

          required
        />

        {/* PHONE */}
        <input
          type="tel"

          placeholder="Phone Number"

          style={styles.input}

          value={phone}

          onChange={(e) =>
            setPhone(
              e.target.value
            )
          }

          pattern="[0-9]{10}"

          maxLength="10"

          required
        />

        {/* PASSWORD */}
        <input
          type="password"

          placeholder="Password"

          style={styles.input}

          value={password}

          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }

          required
        />

        {/* BUTTON */}
        <button
          type="submit"

          style={styles.button}
        >
          Register
        </button>

        {/* LOGIN LINK */}
        <p
          style={{
            marginTop:
              "15px",
          }}
        >
          Already have an account?{" "}

          <Link
            to="/login"

            style={styles.link}
          >
            Login
          </Link>
        </p>

      </form>

    </div>
  );
};

// =========================
// STYLES
// =========================
const styles = {

  container: {

    height: "100vh",

    backgroundImage:
      "url('https://images.unsplash.com/photo-1498050108023-c5249f4df085')",

    backgroundSize:
      "cover",

    backgroundPosition:
      "center",

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

    padding:
      "40px",

    borderRadius:
      "15px",

    color: "#fff",

    width: "320px",

    textAlign:
      "center",

    boxShadow:
      "0 10px 25px rgba(0,0,0,0.3)",
  },

  input: {

    width: "100%",

    padding: "12px",

    margin: "10px 0",

    borderRadius:
      "8px",

    border: "none",

    outline: "none",

    boxSizing:
      "border-box",
  },

  button: {

    width: "100%",

    padding: "12px",

    background:
      "linear-gradient(135deg, #667eea, #764ba2)",

    color: "#fff",

    border: "none",

    borderRadius:
      "8px",

    cursor: "pointer",

    fontWeight:
      "bold",

    fontSize: "15px",
  },

  link: {

    color: "#a5b4fc",

    textDecoration:
      "none",

    fontWeight:
      "bold",
  },
};

export default Register;