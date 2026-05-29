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
              `Bearer ${adminInfo?.token}`,
          },
        };

        const res =
          await axios.get(

            "https://rentease-baackend.onrender.com/api/orders",

            config
          );

        setOrders(
          Array.isArray(res.data)
            ? res.data
            : []
        );

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed to fetch orders"
        );
      }
    };

  // =========================
  // RENTAL END DATE
  // =========================
  const getRentalEndDate =
    (
      deliveryDate,
      rentalDuration
    ) => {

      if (!deliveryDate)
        return new Date();

      const start =
        new Date(
          deliveryDate
        );

      const end =
        new Date(start);

      end.setMonth(

        end.getMonth() +

        Number(
          rentalDuration || 1
        )
      );

      return end;
    };

  // =========================
  // DAYS LEFT
  // =========================
  const getDaysLeft =
    (
      deliveryDate,
      rentalDuration
    ) => {

      const today =
        new Date();

      const endDate =
        getRentalEndDate(

          deliveryDate,

          rentalDuration
        );

      const diff =
        endDate - today;

      return Math.ceil(

        diff /

        (1000 * 60 * 60 * 24)
      );
    };

  // =========================
  // RENTAL STATUS
  // =========================
  const getRentalStatus =
    (daysLeft) => {

      if (daysLeft < 0) {

        return {

          text:
            "Expired",

          color:
            "#ef4444",
        };
      }

      if (daysLeft <= 2) {

        return {

          text:
            "Expiring Soon",

          color:
            "#f97316",
        };
      }

      return {

        text:
          "Active",

        color:
          "#10b981",
      };
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

      if (
        status === "Expired"
      )
        return "#dc2626";

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
  // DOWNLOAD INVOICE
  // =========================
  const downloadInvoice =
    (order) => {

      try {

        const doc =
          new jsPDF();

        const primary =
          [30, 58, 138];

        const light =
          [245, 247, 250];

        // =========================
        // HEADER
        // =========================
        doc.setFillColor(
          ...primary
        );

        doc.rect(
          0,
          0,
          210,
          42,
          "F"
        );

        doc.setTextColor(
          255,
          255,
          255
        );

        doc.setFontSize(30);

        doc.text(
          "RentEase",
          20,
          20
        );

        doc.setFontSize(13);

        doc.text(
          "Rental Operations Invoice",
          20,
          30
        );

        doc.setFontSize(26);

        doc.text(
          "INVOICE",
          145,
          18
        );

        doc.setFontSize(11);

        doc.text(
          `Invoice ID: ${
            order.invoiceNumber
              ? order.invoiceNumber
              : order._id
                  ?.slice(-6)
                  ?.toUpperCase() ||
                "N/A"
          }`,
          130,
          30
        );

        doc.text(
          `Generated: ${new Date()
            .toLocaleDateString()}`,
          130,
          37
        );

        // =========================
        // CUSTOMER DETAILS
        // =========================
        doc.setTextColor(
          0,
          0,
          0
        );

        doc.setFillColor(
          ...light
        );

        doc.roundedRect(
          15,
          55,
          180,
          48,
          4,
          4,
          "F"
        );

        doc.setFontSize(18);

        doc.text(
          "Customer Details",
          20,
          70
        );

        doc.setFontSize(12);

        doc.text(
          `Customer: ${
            order.user?.name ||
            "N/A"
          }`,
          20,
          82
        );

        doc.text(
          `Email: ${
            order.user?.email ||
            "N/A"
          }`,
          20,
          90
        );

        doc.text(
          `Phone: ${
            order.customerPhone ||
            "N/A"
          }`,
          20,
          98
        );

        doc.text(
          `Address: ${
            order.address ||
            "N/A"
          }`,
          105,
          82
        );

        // =========================
        // PRODUCT TABLE
        // =========================
        let startY = 120;

        doc.setFillColor(
          ...primary
        );

        doc.rect(
          15,
          startY,
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
          startY + 7
        );

        doc.text(
          "Qty",
          95,
          startY + 7
        );

        doc.text(
          "Monthly Rent",
          120,
          startY + 7
        );

        doc.text(
          "Total",
          170,
          startY + 7
        );

        startY += 16;

        doc.setTextColor(
          0,
          0,
          0
        );

        (order.items || [])
          .forEach(
            (item) => {

              const total =

                (
                  item.pricePerMonth || 0
                ) *

                (
                  item.quantity || 1
                );

              doc.text(
                item.name || "N/A",
                20,
                startY
              );

              doc.text(
                String(
                  item.quantity || 1
                ),
                95,
                startY
              );

              doc.text(
                `₹${
                  item.pricePerMonth || 0
                }`,
                120,
                startY
              );

              doc.text(
                `₹${total}`,
                170,
                startY
              );

              startY += 12;
            }
          );

        // =========================
        // RENTAL DETAILS
        // =========================
        startY += 10;

        doc.setFillColor(
          ...light
        );

        doc.roundedRect(
          15,
          startY,
          180,
          65,
          4,
          4,
          "F"
        );

        doc.setFontSize(16);

        doc.text(
          "Rental Details",
          20,
          startY + 12
        );

        doc.setFontSize(12);

        doc.text(
          `Rental Duration: ${
            order.rentalDuration || 1
          } Month(s)`,
          20,
          startY + 24
        );

        doc.text(
          `Delivery Date: ${
            order.deliveryDate
              ? new Date(
                  order.deliveryDate
                ).toLocaleDateString()
              : "N/A"
          }`,
          20,
          startY + 34
        );

        doc.text(
          `Delivery Slot: ${
            order.deliverySlot ||
            "N/A"
          }`,
          20,
          startY + 44
        );

        doc.text(
          `Order Status: ${
            order.status ||
            "N/A"
          }`,
          20,
          startY + 54
        );

        doc.text(
          `Payment Status: ${
            order.paymentStatus ||
            "Pending"
          }`,
          110,
          startY + 24
        );

        doc.text(
          `Payment Method: ${
            order.paymentMethod ||
            "ONLINE"
          }`,
          110,
          startY + 34
        );

        doc.text(
          `Pickup Status: ${
            order.pickupStatus ||
            "Not Scheduled"
          }`,
          110,
          startY + 44
        );

        doc.text(
          `Delivery Status: ${
            order.deliveryStatus ||
            "Scheduled"
          }`,
          110,
          startY + 54
        );

        // =========================
        // TOTAL BOX
        // =========================
        startY += 85;

        doc.setFillColor(
          ...primary
        );

        doc.roundedRect(
          115,
          startY,
          80,
          36,
          4,
          4,
          "F"
        );

        doc.setTextColor(
          255,
          255,
          255
        );

        doc.setFontSize(16);

        doc.text(
          "TOTAL AMOUNT",
          125,
          startY + 14
        );

        doc.setFontSize(24);

        doc.text(
          `₹${
            order.totalAmount || 0
          }`,
          130,
          startY + 29
        );

        // =========================
        // FOOTER
        // =========================
        doc.setTextColor(
          120
        );

        doc.setFontSize(10);

        doc.text(
          "This invoice is system generated by RentEase Admin Portal",
          42,
          285
        );

        // =========================
        // SAVE
        // =========================
        doc.save(
          `RentEase_Admin_Invoice_${order._id}.pdf`
        );

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed to generate invoice"
        );
      }
    };

  return (

    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>

        <h1 style={styles.heading}>
          Rental Operations Dashboard 🚀
        </h1>

        <p style={styles.subHeading}>
          Manage active rentals,
          deliveries and renewals
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
          (order) => {

            const daysLeft =

              getDaysLeft(

                order.deliveryDate,

                order.rentalDuration
              );

            const rentalStatus =

              getRentalStatus(
                daysLeft
              );

            return (

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
                      {
                        order._id
                          ?.slice(-6)
                      }
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

                    <p
                      style={
                        styles.phone
                      }
                    >
                      📞{" "}
                      {
                        order.customerPhone
                      }
                    </p>

                  </div>

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

                  {(order.items || [])
                    .map(
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

                  {/* ADDRESS */}
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

                  {/* RENTAL STATUS */}
                  <div
                    style={{
                      ...styles.infoBox,

                      background:
                        rentalStatus.text ===
                        "Expiring Soon"

                          ? "#fff7ed"

                          : "#f0fdf4",

                      border:
                        `2px solid ${rentalStatus.color}`,
                    }}
                  >

                    <h3>
                      📦 Active Rental
                    </h3>

                    <p>
                      <strong>
                        Rental Ends:
                      </strong>
                      {" "}
                      {getRentalEndDate(
                        order.deliveryDate,
                        order.rentalDuration
                      ).toLocaleDateString()}
                    </p>

                    <p>
                      <strong>
                        Days Left:
                      </strong>
                      {" "}
                      {daysLeft} Days
                    </p>

                    <p
                      style={{
                        fontWeight:
                          "bold",

                        color:
                          rentalStatus.color,
                      }}
                    >

                      {
                        rentalStatus.text
                      }

                    </p>

                  </div>

                  {/* DELIVERY */}
                  <div
                    style={
                      styles.infoBox
                    }
                  >

                    <h3>
                      🚚 Delivery
                    </h3>

                    <p>

                      {order.deliveryDate
                        ? new Date(
                            order.deliveryDate
                          ).toLocaleDateString()
                        : "N/A"}

                    </p>

                    <p>
                      {
                        order.deliverySlot
                      }
                    </p>

                  </div>

                  {/* PICKUP */}
                  <div
                    style={{
                      ...styles.infoBox,

                      background:

                        order.pickupStatus ===
                        "Requested"

                          ? "#fff7ed"

                          : "#f8fafc",
                    }}
                  >

                    <h3>
                      📦 Pickup Status
                    </h3>

                    <p
                      style={{
                        fontWeight:
                          "bold",
                      }}
                    >

                      {
                        order.pickupStatus
                      }

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
            );
          }
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

  phone: {

    color:
      "#0f172a",

    marginTop:
      "8px",

    fontWeight:
      "bold",
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