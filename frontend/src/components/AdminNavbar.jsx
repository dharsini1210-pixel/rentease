import { Link } from "react-router-dom";

function AdminNavbar() {

  return (

    <div style={styles.navbar}>

      {/* LOGO */}
      <h1 style={styles.logo}>
        RentEase Admin
      </h1>

      {/* MENU */}
      <div style={styles.menu}>

        <Link
          to="/admin/dashboard"
          style={styles.link}
        >
          Dashboard
        </Link>

        <Link
          to="/admin/orders"
          style={styles.link}
        >
          Orders
        </Link>

        {/* ACTIVE RENTALS */}
        <Link
          to="/admin/active-rentals"
          style={{
            ...styles.link,

            color: "#38bdf8",
          }}
        >
          Active Rentals
        </Link>

        <Link
          to="/admin/manage-products"
          style={styles.link}
        >
          Products
        </Link>

        <Link
          to="/admin/maintenance"
          style={styles.link}
        >
          Maintenance
        </Link>

        {/* PICKUP REQUESTS */}
        <Link
          to="/admin/pickups"
          style={{
            ...styles.link,

            color: "#fbbf24",
          }}
        >
          Pickup Requests
        </Link>

      </div>

    </div>
  );
}

const styles = {

  navbar: {

    width: "100%",

    background:
      "linear-gradient(135deg,#071739,#0f172a)",

    color: "white",

    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "center",

    padding: "20px 50px",

    boxSizing: "border-box",

    position: "sticky",

    top: 0,

    zIndex: 1000,

    boxShadow:
      "0 4px 20px rgba(0,0,0,0.25)",
  },

  logo: {

    margin: 0,

    fontSize: "36px",

    fontWeight: "bold",

    letterSpacing: "1px",
  },

  menu: {

    display: "flex",

    gap: "30px",

    alignItems: "center",

    flexWrap: "wrap",
  },

  link: {

    color: "white",

    textDecoration: "none",

    fontWeight: "600",

    fontSize: "18px",

    transition: "0.3s",

    padding: "8px 12px",

    borderRadius: "8px",
  },
};

export default AdminNavbar;