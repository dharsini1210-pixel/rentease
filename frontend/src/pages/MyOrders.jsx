import { useEffect, useState } from "react";
import axios from "axios";

function MyOrders() {

  const [orders, setOrders] =
    useState([]);

  const [
    maintenanceRequests,
    setMaintenanceRequests
  ] = useState([]);

  // MODAL STATES
  const [showModal, setShowModal] =
    useState(false);

  const [issue, setIssue] =
    useState("");

  const [selectedOrder,
    setSelectedOrder] =
    useState(null);

  const [selectedProduct,
    setSelectedProduct] =
    useState(null);

  // USER INFO
  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  const token = userInfo?.token;

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {

    fetchOrders();

    fetchMaintenanceRequests();

  }, []);

  // =========================
  // FETCH ORDERS
  // =========================
  const fetchOrders = async () => {

    try {

      const config = {

        headers: {

          Authorization:
            `Bearer ${token}`,
        },
      };

      const res = await axios.get(

        "http://localhost:5000/api/orders/my-orders",

        config
      );

      setOrders(res.data);

    } catch (error) {

      console.log(error);

      alert("Failed to fetch orders");
    }
  };

  // =========================
  // FETCH MAINTENANCE
  // =========================
  const fetchMaintenanceRequests =
    async () => {

      try {

        const config = {

          headers: {

            Authorization:
              `Bearer ${token}`,
          },
        };

        const res =
          await axios.get(

            "http://localhost:5000/api/maintenance/my-requests",

            config
          );

        setMaintenanceRequests(
          res.data
        );

      } catch (error) {

        console.log(error);
      }
    };

  // =========================
  // GET MAINTENANCE STATUS
  // =========================
  const getMaintenanceStatus =
    (productId) => {

      const request =
        maintenanceRequests.find(

          (req) =>
            req.product._id ===
            productId
        );

      return request
        ? request.status
        : null;
    };

  // =========================
  // OPEN MODAL
  // =========================
  const openMaintenanceModal = (
    orderId,
    productId
  ) => {

    setSelectedOrder(orderId);

    setSelectedProduct(productId);

    setShowModal(true);
  };

  // =========================
  // SUBMIT MAINTENANCE
  // =========================
  const submitMaintenance =
    async () => {

      if (!issue) {

        return alert(
          "Please describe the issue"
        );
      }

      try {

        const config = {

          headers: {

            Authorization:
              `Bearer ${token}`,
          },
        };

        await axios.post(

          "http://localhost:5000/api/maintenance",

          {
            order:
              selectedOrder,

            product:
              selectedProduct,

            issue,
          },

          config
        );

        alert(
          "Maintenance request submitted"
        );

        setShowModal(false);

        setIssue("");

        fetchMaintenanceRequests();

      } catch (error) {

        console.log(error);

        alert(
          "Failed to submit request"
        );
      }
    };

  // =========================
  // REQUEST PICKUP
  // =========================
  const requestPickup =
    async (orderId) => {

      try {

        const config = {

          headers: {

            Authorization:
              `Bearer ${token}`,
          },
        };

        await axios.put(

          `http://localhost:5000/api/orders/${orderId}/request-pickup`,

          {},

          config
        );

        alert(
          "Pickup requested successfully"
        );

        fetchOrders();

      } catch (error) {

        console.log(error);

        alert(
          "Failed to request pickup"
        );
      }
    };

  return (

    <div
      style={{
        minHeight: "100vh",

        padding: "40px",

        background:
          "linear-gradient(135deg, #667eea, #764ba2, #6dd5ed)",
      }}
    >

      <h1
        style={{
          textAlign: "center",

          marginBottom: "40px",

          fontSize: "55px",

          color: "black",
        }}
      >
        My Orders 📦
      </h1>

      {orders.length === 0 ? (

        <h2
          style={{
            textAlign: "center",

            color: "black",
          }}
        >
          No Orders Found
        </h2>

      ) : (

        <div
          style={{
            display: "flex",

            flexDirection: "column",

            gap: "30px",

            maxWidth: "1000px",

            margin: "auto",
          }}
        >

          {orders.map((order) => (

            <div
              key={order._id}

              style={{
                background: "white",

                borderRadius: "20px",

                padding: "30px",

                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.2)",
              }}
            >

              {/* ITEMS */}
              {order.items.map((item) => {

                const maintenanceStatus =
                  getMaintenanceStatus(
                    item.product
                  );

                return (

                  <div
                    key={item._id}

                    style={{
                      display: "flex",

                      gap: "20px",

                      marginBottom: "20px",

                      borderBottom:
                        "1px solid #ddd",

                      paddingBottom:
                        "20px",
                    }}
                  >

                    <img
                      src={item.image}

                      alt={item.name}

                      style={{
                        width: "140px",

                        height: "120px",

                        objectFit: "cover",

                        borderRadius: "12px",
                      }}
                    />

                    <div>

                      <h2>
                        {item.name}
                      </h2>

                      <p>
                        Quantity:
                        {" "}
                        {item.quantity}
                      </p>

                      <p>
                        ₹
                        {
                          item.pricePerMonth
                        }
                        {" "}
                        / month
                      </p>

                      {/* MAINTENANCE STATUS */}
                      {maintenanceStatus && (

                        <p
                          style={{
                            marginTop:
                              "10px",

                            fontWeight:
                              "bold",

                            color:
                              "#ff9800",
                          }}
                        >
                          Maintenance:
                          {" "}
                          {
                            maintenanceStatus
                          }
                        </p>
                      )}

                      {/* REQUEST MAINTENANCE */}
                      {!maintenanceStatus && (

                        <button

                          onClick={() =>
                            openMaintenanceModal(
                              order._id,
                              item.product
                            )
                          }

                          style={{
                            marginTop:
                              "10px",

                            background:
                              "#ff9800",

                            color:
                              "white",

                            border:
                              "none",

                            padding:
                              "10px 16px",

                            borderRadius:
                              "8px",

                            cursor:
                              "pointer",

                            fontWeight:
                              "bold",
                          }}
                        >
                          Request Maintenance
                        </button>
                      )}

                    </div>

                  </div>
                );
              })}

              {/* ORDER DETAILS */}
              <h3>
                Address:
                {" "}
                {order.address}
              </h3>

              <h3>
                Rental Duration:
                {" "}
                {
                  order.rentalDuration
                }
                {" "}
                Months
              </h3>

              <h3>
                Delivery Date:
                {" "}
                {
                  new Date(
                    order.deliveryDate
                  ).toLocaleDateString()
                }
              </h3>

              <h3>
                Delivery Slot:
                {" "}
                {order.deliverySlot}
              </h3>

              <h3>
                Delivery Status:
                {" "}
                {
                  order.deliveryStatus
                }
              </h3>

              {/* PICKUP DETAILS */}
              <div
                style={{
                  marginTop: "15px",

                  padding: "15px",

                  background: "#f3f0ff",

                  borderRadius: "12px",
                }}
              >

                <h3
                  style={{
                    color: "#764ba2",

                    marginBottom: "10px",
                  }}
                >
                  Pickup Details 📦
                </h3>

                <p>
                  <strong>
                    Pickup Status:
                  </strong>
                  {" "}
                  {
                    order.pickupStatus
                  }
                </p>

                {/* PICKUP DATE */}
                {order.pickupDate && (

                  <p>
                    <strong>
                      Pickup Date:
                    </strong>
                    {" "}
                    {
                      new Date(
                        order.pickupDate
                      ).toLocaleDateString()
                    }
                  </p>
                )}

                {/* PICKUP SLOT */}
                {order.pickupSlot && (

                  <p>
                    <strong>
                      Pickup Slot:
                    </strong>
                    {" "}
                    {
                      order.pickupSlot
                    }
                  </p>
                )}

              </div>

              {/* REQUEST PICKUP */}
              {order.pickupStatus ===
                "Not Scheduled" && (

                <button

                  onClick={() =>
                    requestPickup(
                      order._id
                    )
                  }

                  style={{
                    marginTop: "15px",

                    background:
                      "#764ba2",

                    color: "white",

                    border: "none",

                    padding:
                      "12px 20px",

                    borderRadius:
                      "8px",

                    cursor:
                      "pointer",

                    fontWeight:
                      "bold",
                  }}
                >
                  Request Pickup
                </button>
              )}

              <h2
                style={{
                  color: "#1e3c72",

                  marginTop: "20px",
                }}
              >
                Total:
                {" "}
                ₹
                {order.totalAmount}
              </h2>

              <h3
                style={{
                  marginTop: "10px",

                  color: "green",
                }}
              >
                Status:
                {" "}
                {order.status}
              </h3>

            </div>
          ))}

        </div>
      )}

      {/* MODAL */}
      {showModal && (

        <div
          style={{
            position: "fixed",

            top: 0,

            left: 0,

            width: "100%",

            height: "100%",

            background:
              "rgba(0,0,0,0.5)",

            display: "flex",

            justifyContent:
              "center",

            alignItems:
              "center",

            zIndex: 999,
          }}
        >

          <div
            style={{
              background: "white",

              width: "400px",

              padding: "30px",

              borderRadius: "16px",
            }}
          >

            <h2
              style={{
                textAlign: "center",

                marginBottom: "20px",
              }}
            >
              Maintenance Request
            </h2>

            <textarea

              placeholder="Describe the issue..."

              value={issue}

              onChange={(e) =>
                setIssue(
                  e.target.value
                )
              }

              rows="5"

              style={{
                width: "100%",

                padding: "12px",

                borderRadius: "10px",

                border:
                  "1px solid #ccc",

                resize: "none",

                marginBottom: "20px",
              }}
            />

            <div
              style={{
                display: "flex",

                justifyContent:
                  "space-between",
              }}
            >

              <button

                onClick={() =>
                  setShowModal(false)
                }

                style={{
                  background: "#ccc",

                  border: "none",

                  padding:
                    "10px 20px",

                  borderRadius: "8px",

                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button

                onClick={
                  submitMaintenance
                }

                style={{
                  background:
                    "#ff9800",

                  color: "white",

                  border: "none",

                  padding:
                    "10px 20px",

                  borderRadius: "8px",

                  cursor: "pointer",

                  fontWeight: "bold",
                }}
              >
                Submit
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default MyOrders;