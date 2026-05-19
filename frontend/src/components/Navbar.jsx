import {
  Link,
  useNavigate,
} from "react-router-dom";

function Navbar() {

  const navigate =
    useNavigate();

  const userInfo =
    localStorage.getItem(
      "userInfo"
    )

      ? JSON.parse(
          localStorage.getItem(
            "userInfo"
          )
        )

      : null;

  // =========================
  // LOGOUT
  // =========================
  const logoutHandler =
    () => {

      localStorage.removeItem(
        "userInfo"
      );

      navigate("/login");
    };

  return (

    <div style={styles.nav}>

      {/* LOGO */}
      <div style={styles.logoContainer}>

        <h2 style={styles.logo}>
          RentEase
        </h2>

        <span style={styles.tagline}>
          Rental Platform
        </span>

      </div>

      {/* LINKS */}
      <div style={styles.links}>

        <Link
          to="/"
          style={styles.link}
        >
          Home
        </Link>

        <Link
          to="/products"
          style={styles.link}
        >
          Products
        </Link>

        <Link
          to="/cart"
          style={styles.link}
        >
          Cart
        </Link>

        <Link
          to="/my-orders"
          style={styles.link}
        >
          My Orders
        </Link>

        {/* USER */}
        {userInfo && (

          <span style={styles.userName}>
            👋 {userInfo.name}
          </span>

        )}

        {/* LOGIN / LOGOUT */}
        {!userInfo ? (

          <Link
            to="/login"
            style={styles.loginBtn}
          >
            User Login
          </Link>

        ) : (

          <button

            onClick={
              logoutHandler
            }

            style={
              styles.logoutBtn
            }
          >
            Logout
          </button>
        )}

      </div>

    </div>
  );
}

const styles = {

  nav: {

    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "center",

    flexWrap: "wrap",

    gap: "20px",

    padding: "18px 30px",

    background:
      "linear-gradient(135deg,#0f172a,#1e293b)",

    position: "sticky",

    top: 0,

    zIndex: 1000,

    boxShadow:
      "0 4px 15px rgba(0,0,0,0.2)",
  },

  logoContainer: {

    display: "flex",

    flexDirection: "column",
  },

  logo: {

    color: "white",

    fontSize: "32px",

    fontWeight: "bold",

    margin: 0,
  },

  tagline: {

    color: "#cbd5e1",

    fontSize: "13px",

    letterSpacing: "1px",
  },

  links: {

    display: "flex",

    flexWrap: "wrap",

    justifyContent: "center",

    alignItems: "center",

    gap: "16px",
  },

  link: {

    color: "white",

    textDecoration: "none",

    fontWeight: "600",

    fontSize: "16px",

    padding: "8px 12px",

    borderRadius: "8px",

    transition: "0.3s",
  },

  userName: {

    color: "#93c5fd",

    fontWeight: "bold",

    fontSize: "15px",
  },

  loginBtn: {

    background:
      "linear-gradient(135deg,#2563eb,#1d4ed8)",

    color: "white",

    padding: "10px 18px",

    borderRadius: "10px",

    textDecoration: "none",

    fontWeight: "bold",

    fontSize: "15px",
  },

  logoutBtn: {

    background:
      "linear-gradient(135deg,#dc2626,#b91c1c)",

    color: "white",

    border: "none",

    padding: "10px 18px",

    borderRadius: "10px",

    cursor: "pointer",

    fontWeight: "bold",

    fontSize: "15px",
  },
};

export default Navbar;