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

        {/* NEW PICKUP REQUESTS TAB */}
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

    background: "#071739",

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
  },

  logo: {

    margin: 0,

    fontSize: "36px",

    fontWeight: "bold",

    letterSpacing: "1px",
  },

  menu: {

    display: "flex",

    gap: "35px",

    alignItems: "center",

    flexWrap: "wrap",
  },

  link: {

    color: "white",

    textDecoration: "none",

    fontWeight: "600",

    fontSize: "18px",

    transition: "0.3s",
  },
};

export default AdminNavbar;