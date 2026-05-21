import { useEffect, useState } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import jsPDF from "jspdf";

import { toast } from "react-toastify";

function AdminOrders() {

  const navigate = useNavigate();

  const [orders, setOrders] =
    useState([]);

  const adminInfo = JSON.parse(
    localStorage.getItem(
      "adminInfo"
    )
  );

  // =========================
  // FETCH ORDERS
  // =========================
  useEffect(() => {

    fetchOrders();

  }, []);

  const fetchOrders =
    async () => {

      try {

        const config = {

          headers: {

            Authorization:
              `Bearer ${adminInfo.token}`,
          },
        };

        const res =
          await axios.get(

            "http://localhost:5000/api/orders",

            config
          );

        setOrders(
          res.data
        );

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed to fetch orders"
        );
      }
    };

  // =========================
  // STATUS COLORS
  // =========================
  const getStatusColor =
    (status) => {

      if (
        status === "Placed"
      )
        return "#f59e0b";

      if (
        status === "Delivered"
      )
        return "#10b981";

      if (
        status === "Cancelled"
      )
        return "#ef4444";

      return "#3b82f6";
    };

  // =========================
  // PAYMENT COLORS
  // =========================
  const getPaymentColor =
    (status) => {

      if (
        status === "Paid"
      )
        return "#10b981";

      if (
        status === "Failed"
      )
        return "#ef4444";

      return "#f59e0b";
    };

  // =========================
  // PROFESSIONAL INVOICE
  // =========================
  const downloadInvoice =
    (order) => {

      const doc =
        new jsPDF();

      // HEADER
      doc.setFillColor(
        30,
        60,
        114
      );

      doc.rect(
        0,
        0,
        210,
        40,
        "F"
      );

      // COMPANY NAME
      doc.setTextColor(
        255,
        255,
        255
      );

      doc.setFontSize(28);

      doc.text(
        "RentEase",
        20,
        20
      );

      // SUBTITLE
      doc.setFontSize(12);

      doc.text(
        "Rental Platform Invoice",
        20,
        30
      );

      // INVOICE TITLE
      doc.setFontSize(24);

      doc.text(
        "INVOICE",
        145,
        18
      );

      // INVOICE DETAILS
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

      // RESET TEXT COLOR
      doc.setTextColor(
        0,
        0,
        0
      );

      // CUSTOMER DETAILS
      doc.setFillColor(
        240,
        240,
        240
      );

      doc.rect(
        15,
        55,
        180,
        40,
        "F"
      );

      doc.setFontSize(16);

      doc.text(
        "Customer Details",
        20,
        68
      );

      doc.setFontSize(12);

      doc.text(
        `Customer: ${order.user?.name}`,
        20,
        78
      );

      doc.text(
        `Email: ${order.user?.email}`,
        20,
        86
      );

      doc.text(
        `Address: ${order.address}`,
        20,
        94
      );

      // ORDER DETAILS
      doc.setFillColor(
        245,
        245,
        255
      );

      doc.rect(
        15,
        108,
        180,
        55,
        "F"
      );

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
        `Pickup Status: ${order.pickupStatus}`,
        110,
        148
      );

      // PRODUCTS TABLE HEADER
      doc.setFillColor(
        30,
        60,
        114
      );

      doc.rect(
        15,
        175,
        180,
        10,
        "F"
      );

      doc.setTextColor(
        255,
        255,
        255
      );

      doc.setFontSize(12);

      doc.text(
        "Product",
        20,
        182
      );

      doc.text(
        "Qty",
        105,
        182
      );

      doc.text(
        "Rent",
        130,
        182
      );

      doc.text(
        "Subtotal",
        165,
        182
      );

      // PRODUCTS
      doc.setTextColor(
        0,
        0,
        0
      );

      let y = 198;

      order.items.forEach(
        (item) => {

          const subtotal =

            (item.product
              ?.pricePerMonth ||

              item.pricePerMonth ||

              0) *

            item.quantity;

          doc.text(
            item.product?.name ||
            item.name,
            20,
            y
          );

          doc.text(
            String(
              item.quantity
            ),
            107,
            y
          );

          doc.text(
            `₹${item.product
              ?.pricePerMonth ||

              item.pricePerMonth ||

              0}`,
            128,
            y
          );

          doc.text(
            `₹${subtotal}`,
            163,
            y
          );

          y += 12;
        }
      );

      // PAYMENT SUMMARY
      y += 10;

      doc.setFillColor(
        30,
        60,
        114
      );

      doc.rect(
        95,
        y,
        100,
        40,
        "F"
      );

      doc.setTextColor(
        255,
        255,
        255
      );

      doc.setFontSize(12);

      doc.text(
        `Monthly Rent : ₹${order.totalAmount - order.deposit}`,
        102,
        y + 10
      );

      doc.text(
        `Deposit : ₹${order.deposit}`,
        102,
        y + 22
      );

      doc.setFontSize(16);

      doc.text(
        `Grand Total : ₹${order.totalAmount}`,
        102,
        y + 35
      );

      // FOOTER
      doc.setTextColor(
        120
      );

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

      // SAVE PDF
      doc.save(
        `RentEase_Invoice_${order._id}.pdf`
      );
    };

  return (

    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>

        <h1 style={styles.heading}>
          Admin Orders Dashboard 📦
        </h1>

        <p style={styles.subHeading}>
          Manage customer orders,
          delivery and pickups
        </p>

      </div>

      {/* EMPTY */}
      {orders.length === 0 ? (

        <div style={styles.emptyCard}>

          <h2>
            No Orders Found
          </h2>

        </div>

      ) : (

        orders.map(
          (order) => (

            <div
              key={order._id}
              style={styles.card}
            >

              {/* TOP */}
              <div
                style={styles.topRow}
              >

                <div>

                  <h2
                    style={styles.orderId}
                  >
                    Order #
                    {order._id.slice(
                      -6
                    )}
                  </h2>

                  <p
                    style={
                      styles.customer
                    }
                  >
                    👤{" "}
                    {
                      order.user
                        ?.name
                    }
                  </p>

                  <p
                    style={
                      styles.email
                    }
                  >
                    ✉️{" "}
                    {
                      order.user
                        ?.email
                    }
                  </p>

                </div>

                {/* BADGES */}
                <div
                  style={{
                    display:
                      "flex",

                    gap: "12px",

                    flexWrap:
                      "wrap",
                  }}
                >

                  <div
                    style={{
                      ...styles.statusBadge,

                      background:
                        getStatusColor(
                          order.status
                        ),
                    }}
                  >
                    {
                      order.status ||
                      "Placed"
                    }
                  </div>

                  <div
                    style={{
                      ...styles.statusBadge,

                      background:
                        getPaymentColor(
                          order.paymentStatus
                        ),
                    }}
                  >
                    💳{" "}
                    {
                      order.paymentStatus ||
                      "Pending"
                    }
                  </div>

                </div>

              </div>

              {/* PRODUCTS */}
              <div
                style={
                  styles.productsBox
                }
              >

                <h3>
                  🛒 Ordered Products
                </h3>

                {order.items?.map(
                  (
                    item,
                    index
                  ) => (

                    <div
                      key={index}
                      style={
                        styles.productItem
                      }
                    >

                      <span>
                        {
                          item.name
                        }
                      </span>

                      <span>
                        Qty:{" "}
                        {
                          item.quantity
                        }
                      </span>

                    </div>
                  )
                )}

              </div>

              {/* INFO GRID */}
              <div
                style={styles.grid}
              >

                <div
                  style={
                    styles.infoBox
                  }
                >

                  <h3>
                    📍 Address
                  </h3>

                  <p>
                    {
                      order.address
                    }
                  </p>

                </div>

                <div
                  style={
                    styles.infoBox
                  }
                >

                  <h3>
                    💰 Payment Summary
                  </h3>

                  <p>
                    Monthly Rent:
                    {" "}
                    ₹
                    {
                      order.totalAmount -
                      order.deposit
                    }
                  </p>

                  <p>
                    Deposit:
                    {" "}
                    ₹
                    {
                      order.deposit
                    }
                  </p>

                  <p
                    style={{
                      marginTop: "10px",
                      fontWeight: "bold",
                      color: "#1e3a8a",
                    }}
                  >
                    Grand Total:
                    {" "}
                    ₹
                    {
                      order.totalAmount
                    }
                  </p>

                </div>

                <div
                  style={
                    styles.infoBox
                  }
                >

                  <h3>
                    📅 Delivery Date
                  </h3>

                  <p>

                    {new Date(
                      order.deliveryDate
                    ).toLocaleDateString()}

                  </p>

                </div>

                <div
                  style={
                    styles.infoBox
                  }
                >

                  <h3>
                    ⏰ Delivery Slot
                  </h3>

                  <p>
                    {
                      order.deliverySlot
                    }
                  </p>

                </div>

                {/* PICKUP STATUS */}
                <div
                  style={{
                    ...styles.infoBox,

                    background:

                      order.pickupStatus ===
                      "Requested"

                        ? "#fff7ed"

                        : "#f8fafc",

                    border:

                      order.pickupStatus ===
                      "Requested"

                        ? "2px solid #f97316"

                        : "none",
                  }}
                >

                  <h3>
                    📦 Pickup Status
                  </h3>

                  <p
                    style={{
                      fontWeight: "bold",

                      color:

                        order.pickupStatus ===
                        "Requested"

                          ? "#ea580c"

                          : "#334155",
                    }}
                  >

                    {order.pickupStatus ===
                    "Requested"

                      ? "🟡 Pickup Requested"

                      : order.pickupStatus ===
                        "Picked Up"

                      ? "🟢 Picked Up"

                      : "⚪ Not Scheduled"}

                  </p>

                </div>

              </div>

              {/* BUTTONS */}
              <div
                style={
                  styles.buttonRow
                }
              >

                <button

                  onClick={() => {

                    navigate(
                      `/admin/manage-orders/${order._id}`
                    );
                  }}

                  style={
                    styles.manageBtn
                  }
                >
                  Manage Order
                </button>

                <button

                  onClick={() =>
                    downloadInvoice(
                      order
                    )
                  }

                  style={
                    styles.invoiceBtn
                  }
                >
                  Download Invoice
                </button>

              </div>

            </div>
          )
        )
      )}

    </div>
  );
}

const styles = {

  page: {

    minHeight:
      "100vh",

    background:
      "linear-gradient(to right,#eef2ff,#f8fafc)",

    padding:
      "40px",
  },

  header: {

    textAlign:
      "center",

    marginBottom:
      "50px",
  },

  heading: {

    fontSize:
      "50px",

    color:
      "#1e293b",

    marginBottom:
      "10px",
  },

  subHeading: {

    color:
      "#64748b",

    fontSize:
      "20px",
  },

  emptyCard: {

    background:
      "white",

    padding:
      "50px",

    borderRadius:
      "20px",

    textAlign:
      "center",
  },

  card: {

    background:
      "white",

    borderRadius:
      "24px",

    padding:
      "35px",

    marginBottom:
      "40px",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
  },

  topRow: {

    display:
      "flex",

    justifyContent:
      "space-between",

    alignItems:
      "center",

    marginBottom:
      "30px",

    flexWrap:
      "wrap",
  },

  orderId: {

    color:
      "#1e3a8a",

    fontSize:
      "32px",

    marginBottom:
      "10px",
  },

  customer: {

    fontSize:
      "18px",

    marginBottom:
      "6px",
  },

  email: {

    color:
      "#64748b",
  },

  statusBadge: {

    color:
      "white",

    padding:
      "12px 22px",

    borderRadius:
      "50px",

    fontWeight:
      "bold",

    fontSize:
      "15px",
  },

  productsBox: {

    background:
      "#f8fafc",

    padding:
      "22px",

    borderRadius:
      "18px",

    marginBottom:
      "25px",
  },

  productItem: {

    display:
      "flex",

    justifyContent:
      "space-between",

    padding:
      "10px 0",

    borderBottom:
      "1px solid #e2e8f0",
  },

  grid: {

    display:
      "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(240px,1fr))",

    gap:
      "20px",

    marginBottom:
      "35px",
  },

  infoBox: {

    background:
      "#f8fafc",

    padding:
      "22px",

    borderRadius:
      "18px",

    boxShadow:
      "0 4px 10px rgba(0,0,0,0.05)",
  },

  buttonRow: {

    display:
      "flex",

    gap:
      "20px",

    justifyContent:
      "center",

    flexWrap:
      "wrap",
  },

  manageBtn: {

    padding:
      "16px 40px",

    border:
      "none",

    borderRadius:
      "14px",

    background:
      "linear-gradient(135deg,#2563eb,#1d4ed8)",

    color:
      "white",

    fontWeight:
      "bold",

    cursor:
      "pointer",

    fontSize:
      "18px",
  },

  invoiceBtn: {

    padding:
      "16px 40px",

    border:
      "none",

    borderRadius:
      "14px",

    background:
      "linear-gradient(135deg,#10b981,#059669)",

    color:
      "white",

    fontWeight:
      "bold",

    cursor:
      "pointer",

    fontSize:
      "18px",
  },
};

export default AdminOrders;