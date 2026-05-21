import {
  useEffect,
  useState
} from "react";

import axios from "axios";

import AdminNavbar from "../components/AdminNavbar";

function AdminPickupRequests() {

  const [orders, setOrders] =
    useState([]);

  const [
    successMessage,
    setSuccessMessage
  ] = useState("");

  const adminInfo = JSON.parse(
    localStorage.getItem("adminInfo")
  );

  useEffect(() => {

    fetchPickupRequests();

  }, []);

  // =========================
  // FETCH PICKUP REQUESTS
  // =========================
  const fetchPickupRequests =
    async () => {

      try {

        const config = {

          headers: {

            Authorization:
              `Bearer ${adminInfo.token}`,
          },
        };

        const { data } =
          await axios.get(

            "https://rentease-d1zx.onrender.com/api/orders",

            config
          );

        const pickupOrders =
          data.filter(

            (order) =>

              order.pickupStatus ===
                "Requested" ||

              order.pickupStatus ===
                "Pickup Scheduled" ||

              order.pickupStatus ===
                "Picked Up"
          );

        setOrders(pickupOrders);

      } catch (error) {

        console.log(error);
      }
    };

  // =========================
  // SCHEDULE PICKUP
  // =========================
  const schedulePickup =
    async (order) => {

      try {

        const config = {

          headers: {

            Authorization:
              `Bearer ${adminInfo.token}`,
          },
        };

        await axios.put(

          `https://rentease-d1zx.onrender.com/api/orders/${order._id}/pickup-status`,

          {
            pickupStatus:
              "Pickup Scheduled",

            pickupDate:
              order.pickupDate,

            pickupSlot:
              order.pickupSlot,
          },

          config
        );

        setSuccessMessage(
          "🚚 Pickup Scheduled Successfully"
        );

        setTimeout(() => {

          setSuccessMessage("");

        }, 3000);

        fetchPickupRequests();

      } catch (error) {

        console.log(error);
      }
    };

  // =========================
  // MARK AS PICKED UP
  // =========================
  const markPickedUp =
    async (id) => {

      try {

        const config = {

          headers: {

            Authorization:
              `Bearer ${adminInfo.token}`,
          },
        };

        await axios.put(

          `https://rentease-d1zx.onrender.com/api/orders/${id}/pickup-status`,

          {
            pickupStatus:
              "Picked Up",
          },

          config
        );

        setSuccessMessage(
          "✅ Product Picked Up Successfully"
        );

        setTimeout(() => {

          setSuccessMessage("");

        }, 3000);

        fetchPickupRequests();

      } catch (error) {

        console.log(error);
      }
    };

  // =========================
  // UPDATE LOCAL STATE
  // =========================
  const updateOrderField =
    (id, field, value) => {

      setOrders((prev) =>

        prev.map((order) =>

          order._id === id
            ? {
                ...order,
                [field]: value,
              }
            : order
        )
      );
    };

  // =========================
  // STATUS BADGE
  // =========================
  const getStatusStyle =
    (status) => {

      if (
        status === "Requested"
      ) {

        return {

          background:
            "#fef3c7",

          color:
            "#d97706",
        };
      }

      if (
        status ===
        "Pickup Scheduled"
      ) {

        return {

          background:
            "#dbeafe",

          color:
            "#2563eb",
        };
      }

      return {

        background:
          "#dcfce7",

        color:
          "#16a34a",
      };
    };

  return (

    <>

      <AdminNavbar />

      {/* SUCCESS TOAST */}
      {
        successMessage && (

          <div
            style={{
              position: "fixed",
              top: "100px",
              right: "30px",
              background: "#16a34a",
              color: "white",
              padding: "16px 24px",
              borderRadius: "12px",
              fontWeight: "bold",
              boxShadow:
                "0 8px 25px rgba(0,0,0,0.2)",
              zIndex: 9999,
              fontSize: "16px",
            }}
          >
            {successMessage}
          </div>
        )
      }

      <div style={styles.page}>

        <h1 style={styles.heading}>
          📦 Pickup Requests
        </h1>

        {
          orders.length === 0 ? (

            <h2 style={styles.empty}>
              No Pickup Requests
            </h2>

          ) : (

            orders.map((order) => (

              <div
                key={order._id}
                style={styles.card}
              >

                <h2 style={styles.orderId}>
                  Order ID:
                  {" "}
                  {order._id}
                </h2>

                <div style={styles.grid}>

                  <div>

                    <p>
                      <strong>
                        Customer:
                      </strong>{" "}
                      {
                        order.user?.name
                      }
                    </p>

                    <p>
                      <strong>
                        Email:
                      </strong>{" "}
                      {
                        order.user?.email
                      }
                    </p>

                    <p>
                      <strong>
                        Address:
                      </strong>{" "}
                      {order.address}
                    </p>

                  </div>

                  <div>

                    <p>
                      <strong>
                        Product:
                      </strong>{" "}
                      {
                        order.items[0]
                          ?.name
                      }
                    </p>

                    <p>
                      <strong>
                        Rental Duration:
                      </strong>{" "}
                      {
                        order.rentalDuration
                      }{" "}
                      Month(s)
                    </p>

                    <p>
                      <strong>
                        Total:
                      </strong>{" "}
                      ₹
                      {
                        order.totalAmount
                      }
                    </p>

                  </div>

                </div>

                {/* STATUS */}
                <div
                  style={{
                    ...styles.statusBox,

                    ...getStatusStyle(
                      order.pickupStatus
                    ),
                  }}
                >

                  {
                    order.pickupStatus
                  }

                </div>

                {/* DATE */}
                <div
                  style={styles.inputGroup}
                >

                  <label>
                    Pickup Date
                  </label>

                  <input

                    type="date"

                    value={
                      order.pickupDate ||
                      ""
                    }

                    onChange={(e) =>
                      updateOrderField(

                        order._id,

                        "pickupDate",

                        e.target.value
                      )
                    }

                    style={styles.input}
                  />

                </div>

                {/* SLOT */}
                <div
                  style={styles.inputGroup}
                >

                  <label>
                    Pickup Slot
                  </label>

                  <select

                    value={
                      order.pickupSlot ||
                      ""
                    }

                    onChange={(e) =>
                      updateOrderField(

                        order._id,

                        "pickupSlot",

                        e.target.value
                      )
                    }

                    style={styles.input}
                  >

                    <option value="">
                      Select Slot
                    </option>

                    <option>
                      Morning
                    </option>

                    <option>
                      Afternoon
                    </option>

                    <option>
                      Evening
                    </option>

                  </select>

                </div>

                {/* BUTTONS */}
                <div style={styles.buttonRow}>

                  {
                    order.pickupStatus !==
                      "Pickup Scheduled" &&

                    order.pickupStatus !==
                      "Picked Up" && (

                      <button

                        style={
                          styles.scheduleBtn
                        }

                        onClick={() =>
                          schedulePickup(
                            order
                          )
                        }
                      >

                        Schedule Pickup

                      </button>
                    )
                  }

                  {
                    order.pickupStatus !==
                      "Picked Up" && (

                      <button

                        style={
                          styles.pickupBtn
                        }

                        onClick={() =>
                          markPickedUp(
                            order._id
                          )
                        }
                      >

                        Mark Picked Up

                      </button>
                    )
                  }

                </div>

              </div>
            ))
          )
        }

      </div>

    </>
  );
}

const styles = {

  page: {

    minHeight: "100vh",

    background:
      "linear-gradient(to right,#eef2ff,#f8fafc)",

    padding: "40px",
  },

  heading: {

    textAlign: "center",

    marginBottom: "40px",

    fontSize: "52px",

    color: "#1e293b",
  },

  empty: {

    textAlign: "center",

    marginTop: "100px",

    color: "#64748b",
  },

  card: {

    background: "white",

    padding: "35px",

    marginBottom: "30px",

    borderRadius: "24px",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
  },

  orderId: {

    marginBottom: "25px",

    color: "#1e293b",
  },

  grid: {

    display: "grid",

    gridTemplateColumns:
      "1fr 1fr",

    gap: "20px",

    marginBottom: "25px",
  },

  statusBox: {

    display: "inline-block",

    padding:
      "10px 18px",

    borderRadius: "12px",

    fontWeight: "bold",

    marginBottom: "25px",
  },

  inputGroup: {

    marginBottom: "20px",

    display: "flex",

    flexDirection:
      "column",
  },

  input: {

    marginTop: "10px",

    padding: "14px",

    borderRadius: "10px",

    border:
      "1px solid #cbd5e1",

    fontSize: "16px",

    outline: "none",
  },

  buttonRow: {

    display: "flex",

    gap: "20px",

    marginTop: "25px",
  },

  scheduleBtn: {

    padding:
      "14px 28px",

    border: "none",

    borderRadius: "12px",

    background:
      "#f97316",

    color: "white",

    fontWeight: "bold",

    cursor: "pointer",

    fontSize: "16px",
  },

  pickupBtn: {

    padding:
      "14px 28px",

    border: "none",

    borderRadius: "12px",

    background:
      "#16a34a",

    color: "white",

    fontWeight: "bold",

    cursor: "pointer",

    fontSize: "16px",
  },
};

export default
  AdminPickupRequests;