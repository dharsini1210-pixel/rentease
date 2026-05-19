import { Link } from "react-router-dom";

function AdminNavbar() {

  return (

    <div style={styles.navbar}>

      <h1 style={styles.logo}>
        RentEase Admin
      </h1>

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

    justifyContent: "space-between",

    alignItems: "center",

    padding: "20px 50px",

    boxSizing: "border-box",
  },

  logo: {

    margin: 0,

    fontSize: "36px",

    fontWeight: "bold",
  },

  menu: {

    display: "flex",

    gap: "30px",
  },

  link: {

    color: "white",

    textDecoration: "none",

    fontWeight: "600",

    fontSize: "18px",
  },
};

export default AdminNavbar;