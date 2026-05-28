import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

function MyOrders() {

  const [orders, setOrders] =
    useState([]);

  const [
    showRenewModal,
    setShowRenewModal
  ] = useState(false);

  const [
    renewMonths,
    setRenewMonths
  ] = useState(1);

  const [
    renewOrderId,
    setRenewOrderId
  ] = useState(null);

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  const token = userInfo?.token;

  // =========================
  // FETCH ORDERS
  // =========================
  useEffect(() => {

    fetchOrders();

  }, []);

  const fetchOrders = async () => {

    try {

      const config = {

        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      };

      const res =
        await axios.get(

          "http://localhost:5000/api/orders/my-orders",

          config
        );

      setOrders(res.data);

    } catch (error) {

      console.log(error);

      alert(
        "Failed to fetch orders"
      );
    }
  };

  // =========================
  // DATE HELPERS
  // =========================

  const getEndDate = (order) => {

    const startDate =
      new Date(order.deliveryDate);

    const endDate =
      new Date(startDate);

    endDate.setMonth(

      endDate.getMonth() +

      order.rentalDuration
    );

    return endDate;
  };

  const getDaysLeft = (order) => {

    const endDate =
      getEndDate(order);

    const today =
      new Date();

    const diffTime =
      endDate - today;

    return Math.ceil(

      diffTime /

      (1000 * 60 * 60 * 24)
    );
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
  // OPEN RENEW MODAL
  // =========================
  const openRenewModal =
    (orderId) => {

      setRenewOrderId(
        orderId
      );

      setShowRenewModal(
        true
      );
    };

  // =========================
  // RENEW RENTAL
  // =========================
  const renewRental =
    async () => {

      try {

        const config = {

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        };

        await axios.put(

          `http://localhost:5000/api/orders/${renewOrderId}/renew`,

          {
            months:
              Number(
                renewMonths
              ),
          },

          config
        );

        alert(
          `Rental renewed for ${renewMonths} month(s)`
        );

        setShowRenewModal(
          false
        );

        fetchOrders();

      } catch (error) {

        console.log(error);

        alert(
          "Failed to renew rental"
        );
      }
    };

  // =========================
  // DOWNLOAD PROFESSIONAL INVOICE
  // =========================
  const downloadInvoice = (order) => {

    const doc =
      new jsPDF();

    const endDate =
      getEndDate(order);

    // HEADER
    doc.setFontSize(24);

    doc.setTextColor(
      30,
      60,
      114
    );

    doc.text(
      "RentEase Invoice",
      20,
      25
    );

    // LINE
    doc.setDrawColor(
      30,
      60,
      114
    );

    doc.line(
      20,
      30,
      190,
      30
    );

    // CUSTOMER DETAILS
    doc.setFontSize(14);

    doc.setTextColor(
      0,
      0,
      0
    );

    doc.text(
      `Customer Name: ${order.customerName}`,
      20,
      45
    );

    doc.text(
      `Email: ${order.customerEmail}`,
      20,
      55
    );

    doc.text(
      `Phone: ${order.customerPhone}`,
      20,
      65
    );

    // ORDER DETAILS
    doc.text(
      `Order ID: ${order._id}`,
      20,
      80
    );

    doc.text(
      `Payment Status: ${order.paymentStatus}`,
      20,
      90
    );

    doc.text(
      `Rental Duration: ${order.rentalDuration} Month(s)`,
      20,
      100
    );

    doc.text(
      `Delivery Date: ${new Date(order.deliveryDate).toLocaleDateString()}`,
      20,
      110
    );

    doc.text(
      `Expiry Date: ${endDate.toLocaleDateString()}`,
      20,
      120
    );

    // PRODUCTS
    let y = 140;

    doc.setFontSize(18);

    doc.text(
      "Products",
      20,
      y
    );

    y += 15;

    order.items.forEach(
      (item, index) => {

        doc.setFontSize(13);

        doc.text(

          `${index + 1}. ${item.name}`,

          25,

          y
        );

        y += 10;

        doc.text(

          `Quantity: ${item.quantity}`,

          35,

          y
        );

        y += 10;

        doc.text(

          `Monthly Rent: ₹${item.pricePerMonth}`,

          35,

          y
        );

        y += 15;
      }
    );

    // TOTAL
    doc.setFontSize(18);

    doc.setTextColor(
      22,
      163,
      74
    );

    doc.text(

      `Total Amount Paid: ₹${order.totalAmount}`,

      20,

      y + 10
    );

    // FOOTER
    doc.setFontSize(12);

    doc.setTextColor(
      100
    );

    doc.text(

      "Thank you for choosing RentEase 🚀",

      20,

      285
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
          fontSize: "55px",
          marginBottom: "40px",
          color: "white",
          fontWeight: "bold",
        }}
      >
        My Orders 📦
      </h1>

      {orders.length === 0 ? (

        <h2
          style={{
            textAlign: "center",
            color: "white",
          }}
        >
          No Orders Found
        </h2>

      ) : (

        <div
          style={{
            maxWidth: "1100px",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "30px",
          }}
        >

          {orders.map((order) => {

            const daysLeft =
              getDaysLeft(order);

            const endDate =
              getEndDate(order);

            return (

              <div
                key={order._id}
                style={{
                  background: "white",
                  borderRadius: "24px",
                  padding: "35px",
                  boxShadow:
                    "0 10px 30px rgba(0,0,0,0.2)",
                }}
              >

                {/* HEADER */}
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    flexWrap: "wrap",
                    marginBottom: "25px",
                  }}
                >

                  <div>

                    <h2
                      style={{
                        color: "#1e3c72",
                      }}
                    >
                      Order ID:
                    </h2>

                    <p>
                      {order._id}
                    </p>

                  </div>

                  <div>

                    <h2
                      style={{
                        color: "#1e3c72",
                      }}
                    >
                      Payment
                    </h2>

                    <p
                      style={{
                        color:
                          order.paymentStatus ===
                          "Paid"
                            ? "green"
                            : "red",

                        fontWeight:
                          "bold",
                      }}
                    >
                      {
                        order.paymentStatus
                      }
                    </p>

                  </div>

                </div>

                {/* RENTAL STATUS */}
                <div
                  style={{
                    background:

                      daysLeft <= 0

                        ? "#fee2e2"

                        : daysLeft <= 5

                        ? "#fef3c7"

                        : "#dcfce7",

                    padding: "20px",

                    borderRadius: "16px",

                    marginBottom: "25px",
                  }}
                >

                  <h2>

                    {daysLeft <= 0
                      ? "🔴 Rental Expired"
                      : daysLeft <= 5
                      ? "⚠️ Expiring Soon"
                      : "🟢 Active Rental"}

                  </h2>

                  <p>
                    Days Left:
                    {" "}
                    {daysLeft}
                  </p>

                  <p>
                    Expiry Date:
                    {" "}
                    {
                      endDate.toLocaleDateString()
                    }
                  </p>

                </div>

                {/* ORDER DETAILS */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit,minmax(220px,1fr))",
                    gap: "20px",
                    marginBottom: "30px",
                  }}
                >

                  <div style={styles.infoCard}>
                    <h3>
                      Customer
                    </h3>

                    <p>
                      {
                        order.customerName
                      }
                    </p>
                  </div>

                  <div style={styles.infoCard}>
                    <h3>
                      Phone
                    </h3>

                    <p>
                      {
                        order.customerPhone
                      }
                    </p>
                  </div>

                  <div style={styles.infoCard}>
                    <h3>
                      Delivery Date
                    </h3>

                    <p>
                      {
                        new Date(
                          order.deliveryDate
                        ).toLocaleDateString()
                      }
                    </p>
                  </div>

                  <div style={styles.infoCard}>
                    <h3>
                      Duration
                    </h3>

                    <p>
                      {
                        order.rentalDuration
                      }
                      {" "}
                      Month(s)
                    </p>
                  </div>

                </div>

                {/* PRODUCTS */}
                {order.items.map((item) => (

                  <div
                    key={item._id}
                    style={{
                      display: "flex",
                      gap: "20px",
                      marginBottom: "25px",
                      borderBottom:
                        "1px solid #ddd",
                      paddingBottom: "20px",
                    }}
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "150px",
                        height: "130px",
                        objectFit: "cover",
                        borderRadius: "14px",
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
                        Monthly Rent:
                        {" "}
                        ₹
                        {
                          item.pricePerMonth
                        }
                      </p>

                    </div>

                  </div>
                ))}

                {/* TOTAL */}
                <div
                  style={{
                    marginBottom: "25px",
                  }}
                >

                  <h2
                    style={{
                      color: "#16a34a",
                    }}
                  >
                    Total Paid:
                    {" "}
                    ₹
                    {order.totalAmount}
                  </h2>

                </div>

                {/* BUTTONS */}
                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    flexWrap: "wrap",
                  }}
                >

                  <button
                    onClick={() =>
                      downloadInvoice(order)
                    }
                    style={styles.invoiceBtn}
                  >
                    Download Invoice
                  </button>

                  <button
                    onClick={() =>
                      requestPickup(
                        order._id
                      )
                    }
                    style={styles.pickupBtn}
                  >
                    Return Product
                  </button>

                  <button
                    onClick={() =>
                      openRenewModal(
                        order._id
                      )
                    }
                    style={styles.renewBtn}
                  >
                    Renew Rental
                  </button>

                </div>

              </div>
            );
          })}

        </div>
      )}

      {/* RENEW MODAL */}
      {showRenewModal && (

        <div style={styles.modalOverlay}>

          <div style={styles.modal}>

            <h2>
              Renew Rental 🔄
            </h2>

            <select
              value={renewMonths}
              onChange={(e) =>
                setRenewMonths(
                  e.target.value
                )
              }
              style={styles.select}
            >

              <option value={1}>
                1 Month
              </option>

              <option value={3}>
                3 Months
              </option>

              <option value={6}>
                6 Months
              </option>

            </select>

            <div
              style={{
                display: "flex",
                gap: "15px",
                marginTop: "20px",
              }}
            >

              <button
                onClick={renewRental}
                style={styles.confirmBtn}
              >
                Confirm Renewal
              </button>

              <button
                onClick={() =>
                  setShowRenewModal(
                    false
                  )
                }
                style={styles.cancelBtn}
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

const styles = {

  infoCard: {

    background: "#f8fafc",

    padding: "18px",

    borderRadius: "14px",
  },

  invoiceBtn: {

    background: "#2563eb",

    color: "white",

    border: "none",

    padding: "14px 20px",

    borderRadius: "12px",

    cursor: "pointer",

    fontWeight: "bold",
  },

  pickupBtn: {

    background: "#dc2626",

    color: "white",

    border: "none",

    padding: "14px 20px",

    borderRadius: "12px",

    cursor: "pointer",

    fontWeight: "bold",
  },

  renewBtn: {

    background: "#16a34a",

    color: "white",

    border: "none",

    padding: "14px 20px",

    borderRadius: "12px",

    cursor: "pointer",

    fontWeight: "bold",
  },

  modalOverlay: {

    position: "fixed",

    top: 0,

    left: 0,

    width: "100%",

    height: "100%",

    background:
      "rgba(0,0,0,0.5)",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    zIndex: 1000,
  },

  modal: {

    background: "white",

    padding: "30px",

    borderRadius: "20px",

    width: "350px",

    textAlign: "center",
  },

  select: {

    width: "100%",

    padding: "12px",

    marginTop: "20px",

    borderRadius: "10px",
  },

  confirmBtn: {

    background: "#16a34a",

    color: "white",

    border: "none",

    padding: "12px 18px",

    borderRadius: "10px",

    cursor: "pointer",

    fontWeight: "bold",
  },

  cancelBtn: {

    background: "#dc2626",

    color: "white",

    border: "none",

    padding: "12px 18px",

    borderRadius: "10px",

    cursor: "pointer",

    fontWeight: "bold",
  },
};

export default MyOrders;