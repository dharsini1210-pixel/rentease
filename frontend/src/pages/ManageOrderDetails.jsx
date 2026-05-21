import {
  useEffect,
  useState
} from "react";

import axios from "axios";

import { useParams } from "react-router-dom";

import AdminNavbar from "../components/AdminNavbar";

function ManageOrderDetails() {

  const { id } = useParams();

  // =========================
  // STATES
  // =========================
  const [orderStatus, setOrderStatus] =
    useState("Placed");

  const [
    deliveryStatus,
    setDeliveryStatus
  ] = useState("Scheduled");

  const adminInfo = JSON.parse(
    localStorage.getItem("adminInfo")
  );

  // =========================
  // FETCH ORDER DETAILS
  // =========================
  useEffect(() => {

    fetchOrder();

  }, []);

  const fetchOrder = async () => {

    try {

      const config = {

        headers: {

          Authorization:
            `Bearer ${adminInfo.token}`,
        },
      };

      const res = await axios.get(

        "https://rentease-d1zx.onrender.com/api/orders",

        config
      );

      const order = res.data.find(
        (o) => o._id === id
      );

      if (order) {

        setOrderStatus(
          order.status ||
          "Placed"
        );

        setDeliveryStatus(
          order.deliveryStatus ||
          "Scheduled"
        );
      }

    } catch (error) {

      console.log(error);
    }
  };

  // =========================
  // SAVE CHANGES
  // =========================
  const saveChanges = async () => {

    try {

      const config = {

        headers: {

          Authorization:
            `Bearer ${adminInfo.token}`,
        },
      };

      // UPDATE ORDER STATUS
      await axios.put(

        `https://rentease-d1zx.onrender.com/api/orders/${id}/status`,

        {
          status: orderStatus,
        },

        config
      );

      // UPDATE DELIVERY STATUS
      await axios.put(

        `https://rentease-d1zx.onrender.com/api/orders/${id}/delivery-status`,

        {
          deliveryStatus,
        },

        config
      );

      alert(
        "Order Updated Successfully ✅"
      );

    } catch (error) {

      console.log(error);

      alert(
        "Failed to update order"
      );
    }
  };

  return (

    <>

      {/* ADMIN NAVBAR */}
      <AdminNavbar />

      <div style={styles.page}>

        <div style={styles.card}>

          {/* TITLE */}
          <h1 style={styles.heading}>
            Manage Order ⚙️
          </h1>

          {/* ORDER ID */}
          <p style={styles.orderId}>
            Order ID: {id}
          </p>

          {/* ORDER STATUS */}
          <div style={styles.section}>

            <h3 style={styles.label}>
              Order Status
            </h3>

            <select

              value={orderStatus}

              onChange={(e) =>
                setOrderStatus(
                  e.target.value
                )
              }

              style={styles.select}
            >

              <option>Placed</option>

              <option>Confirmed</option>

              <option>Shipped</option>

              <option>Delivered</option>

              <option>Completed</option>

              <option>Cancelled</option>

            </select>

          </div>

          {/* DELIVERY STATUS */}
          <div style={styles.section}>

            <h3 style={styles.label}>
              Delivery Status
            </h3>

            <select

              value={deliveryStatus}

              onChange={(e) =>
                setDeliveryStatus(
                  e.target.value
                )
              }

              style={styles.select}
            >

              <option>Scheduled</option>

              <option>
                Out for Delivery
              </option>

              <option>Delivered</option>

            </select>

          </div>

          {/* SAVE BUTTON */}
          <button

            onClick={saveChanges}

            style={styles.button}
          >

            Save Changes

          </button>

        </div>

      </div>

    </>
  );
}

const styles = {

  page: {

    minHeight: "100vh",

    background:
      "linear-gradient(to right,#eef2ff,#f8fafc)",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    padding: "40px",
  },

  card: {

    background: "white",

    width: "650px",

    padding: "40px",

    borderRadius: "24px",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
  },

  heading: {

    textAlign: "center",

    color: "#1e3a8a",

    fontSize: "40px",

    marginBottom: "10px",
  },

  orderId: {

    textAlign: "center",

    color: "#64748b",

    marginBottom: "35px",

    fontSize: "18px",
  },

  section: {

    marginBottom: "25px",
  },

  label: {

    marginBottom: "10px",

    color: "#1e293b",

    fontSize: "20px",
  },

  select: {

    width: "100%",

    padding: "16px",

    borderRadius: "12px",

    border: "1px solid #cbd5e1",

    fontSize: "16px",

    marginTop: "10px",

    outline: "none",
  },

  button: {

    width: "100%",

    padding: "18px",

    border: "none",

    borderRadius: "14px",

    background:
      "linear-gradient(135deg,#2563eb,#1d4ed8)",

    color: "white",

    fontWeight: "bold",

    fontSize: "18px",

    cursor: "pointer",

    marginTop: "20px",
  },
};

export default ManageOrderDetails;