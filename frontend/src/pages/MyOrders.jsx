import { useEffect, useState } from "react";

import axios from "axios";

import jsPDF from "jspdf";

function MyOrders() {

  const [orders, setOrders] =
    useState([]);

  const [
    maintenanceRequests,
    setMaintenanceRequests
  ] = useState([]);

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

          {
            pickupStatus:
              "Requested",
          },

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

  // =========================
  // DOWNLOAD INVOICE
  // =========================
  const downloadInvoice = (order) => {

    const doc = new jsPDF();

    // HEADER
    doc.setFillColor(30, 60, 114);

    doc.rect(0, 0, 210, 40, "F");

    doc.setTextColor(255, 255, 255);

    doc.setFontSize(28);

    doc.text(
      "RentEase",
      20,
      20
    );

    doc.setFontSize(12);

    doc.text(
      "Rental Platform Invoice",
      20,
      30
    );

    doc.setFontSize(24);

    doc.text(
      "INVOICE",
      145,
      18
    );

    doc.setFontSize(11);

    doc.text(
      `Invoice ID: ${order._id
        .slice(-6)
        .toUpperCase()}`,
      130,
      28
    );

    doc.text(
      `Date: ${new Date()
        .toLocaleDateString()}`,
      130,
      35
    );

    doc.setTextColor(0, 0, 0);

    // CUSTOMER DETAILS
    doc.setFillColor(240, 240, 240);

    doc.rect(15, 55, 180, 40, "F");

    doc.setFontSize(16);

    doc.text(
      "Customer Details",
      20,
      68
    );

    doc.setFontSize(12);

    doc.text(
      `Name: ${userInfo.name}`,
      20,
      78
    );

    doc.text(
      `Email: ${userInfo.email}`,
      20,
      86
    );

    doc.text(
      `Address: ${order.address}`,
      20,
      94
    );

    // ORDER DETAILS
    doc.setFillColor(245, 245, 255);

    doc.rect(15, 108, 180, 60, "F");

    doc.setFontSize(16);

    doc.text(
      "Order Details",
      20,
      120
    );

    doc.setFontSize(12);

    doc.text(
      `Rental Duration: ${order.rentalDuration} Months`,
      20,
      132
    );

    doc.text(
      `Delivery Date: ${new Date(
        order.deliveryDate
      ).toLocaleDateString()}`,
      20,
      140
    );

    doc.text(
      `Delivery Slot: ${order.deliverySlot}`,
      20,
      148
    );

    doc.text(
      `Pickup Status: ${order.pickupStatus || "Not Scheduled"}`,
      20,
      156
    );

    doc.text(
      `Order Status: ${order.status}`,
      110,
      132
    );

    doc.text(
      `Payment Status: ${order.paymentStatus}`,
      110,
      140
    );

    doc.text(
      `Delivery Status: ${order.deliveryStatus}`,
      110,
      148
    );

    // PRODUCTS TABLE HEADER
    doc.setFillColor(30, 60, 114);

    doc.rect(15, 180, 180, 10, "F");

    doc.setTextColor(255, 255, 255);

    doc.setFontSize(12);

    doc.text(
      "Product",
      20,
      187
    );

    doc.text(
      "Qty",
      105,
      187
    );

    doc.text(
      "Rent",
      130,
      187
    );

    doc.text(
      "Subtotal",
      165,
      187
    );

    // PRODUCTS
    doc.setTextColor(0, 0, 0);

    let y = 203;

    order.items.forEach((item) => {

      const subtotal =
        item.pricePerMonth *
        item.quantity;

      doc.text(
        item.name,
        20,
        y
      );

      doc.text(
        String(item.quantity),
        107,
        y
      );

      doc.text(
        `₹${item.pricePerMonth}`,
        128,
        y
      );

      doc.text(
        `₹${subtotal}`,
        163,
        y
      );

      y += 12;
    });

    // TOTAL
    y += 12;

    doc.setFillColor(30, 60, 114);

    doc.rect(110, y, 85, 20, "F");

    doc.setTextColor(255, 255, 255);

    doc.setFontSize(18);

    doc.text(
      `Total: ₹${order.totalAmount}`,
      120,
      y + 13
    );

    // FOOTER
    doc.setTextColor(120);

    doc.setFontSize(11);

    doc.text(
      "Thank you for choosing RentEase ❤️",
      20,
      280
    );

    doc.text(
      "For support contact: rentease22@gmail.com",
      20,
      287
    );

    doc.save(
      `RentEase_Invoice_${order._id}.pdf`
    );
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

              <h2
                style={{
                  color: "#1e3c72",
                  marginBottom: "20px",
                }}
              >
                Order ID:
                {" "}
                {order._id}
              </h2>

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
                    !order.pickupStatus

                      ? "Not Scheduled"

                      : order.pickupStatus
                  }
                </p>

                {order.pickupDate && (

                  <p>
                    <strong>
                      Pickup Date:
                    </strong>
                    {" "}
                    {order.pickupDate}
                  </p>
                )}

                {order.pickupSlot && (

                  <p>
                    <strong>
                      Pickup Slot:
                    </strong>
                    {" "}
                    {order.pickupSlot}
                  </p>
                )}

              </div>

              {/* REQUEST BUTTON */}
              {
                (
                  !order.pickupStatus ||

                  order.pickupStatus ===
                  "Not Scheduled"
                ) && (

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
                )
              }

              {/* REQUESTED */}
              {
                order.pickupStatus ===
                "Requested" && (

                  <div
                    style={{
                      marginTop: "15px",
                      padding: "12px",
                      background: "#fff7ed",
                      borderRadius: "10px",
                      color: "#ea580c",
                      fontWeight: "bold",
                    }}
                  >
                    Pickup Requested Successfully ✅
                  </div>
                )
              }

              {/* SCHEDULED */}
              {
                order.pickupStatus ===
                "Pickup Scheduled" && (

                  <div
                    style={{
                      marginTop: "15px",
                      padding: "12px",
                      background: "#ecfeff",
                      borderRadius: "10px",
                      color: "#0891b2",
                      fontWeight: "bold",
                    }}
                  >
                    Pickup Scheduled 🚚
                  </div>
                )
              }

              {/* PICKED UP */}
              {
                order.pickupStatus ===
                "Picked Up" && (

                  <div
                    style={{
                      marginTop: "15px",
                      padding: "12px",
                      background: "#ecfdf5",
                      borderRadius: "10px",
                      color: "#16a34a",
                      fontWeight: "bold",
                    }}
                  >
                    Product Picked Up ✅
                  </div>
                )
              }

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
                  color:
                    order.paymentStatus ===
                    "Paid"

                      ? "green"

                      : "orange",
                }}
              >
                Payment:
                {" "}

                {order.paymentStatus ===
                "Paid"

                  ? "Paid ✅"

                  : "Pending ⏳"}
              </h3>

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

              {/* DOWNLOAD INVOICE */}
              <button

                onClick={() =>
                  downloadInvoice(order)
                }

                style={{
                  marginTop: "20px",
                  background: "#00b894",
                  color: "white",
                  border: "none",
                  padding:
                    "12px 22px",
                  borderRadius:
                    "10px",
                  cursor:
                    "pointer",
                  fontWeight:
                    "bold",
                  fontSize:
                    "15px",
                }}
              >
                Download Invoice
              </button>

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