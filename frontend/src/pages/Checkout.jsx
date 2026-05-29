import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import {
  toast,
} from "react-toastify";

// =========================
// BACKEND URL
// =========================
const API_URL =
  "https://rentease-baackend.onrender.com";

function Checkout() {

  const navigate =
    useNavigate();

  // =========================
  // STATES
  // =========================
  const [cart, setCart] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [address, setAddress] =
    useState("");

  const [
    rentalDuration,
    setRentalDuration,
  ] = useState(1);

  const [
    deliveryDate,
    setDeliveryDate,
  ] = useState("");

  const [
    deliverySlot,
    setDeliverySlot,
  ] = useState("Morning");

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState("COD");

  // =========================
  // USER INFO
  // =========================
  const userInfo =
    JSON.parse(
      localStorage.getItem(
        "userInfo"
      )
    );

  const token =
    userInfo?.token;

  // =========================
  // FETCH CART
  // =========================
  useEffect(() => {

    fetchCart();

  }, []);

  const fetchCart =
    async () => {

      try {

        const res =
          await axios.get(

            `${API_URL}/api/cart`,

            {
              headers: {

                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        console.log(
          "CART DATA:",
          res.data
        );

        setCart(
          res.data || []
        );

        setLoading(false);

      } catch (error) {

        console.log(
          "FETCH CART ERROR:",
          error
        );

        setLoading(false);
      }
    };

  // =========================
  // TOTALS
  // =========================
  const rentTotal =
    cart.reduce(

      (sum, item) =>

        sum +

        (
          item?.product
            ?.pricePerMonth || 0
        ) *

        (item.quantity || 1),

      0
    );

  const depositTotal =
    cart.reduce(

      (sum, item) =>

        sum +

        (
          item?.product
            ?.deposit || 0
        ) *

        (item.quantity || 1),

      0
    );

  const total =
    rentTotal +
    depositTotal;

  // =========================
  // LOAD RAZORPAY
  // =========================
  const loadRazorpayScript =
    () => {

      return new Promise(
        (resolve) => {

          const script =
            document.createElement(
              "script"
            );

          script.src =
            "https://checkout.razorpay.com/v1/checkout.js";

          script.onload =
            () => resolve(true);

          script.onerror =
            () => resolve(false);

          document.body.appendChild(
            script
          );
        }
      );
    };

  // =========================
  // PLACE ORDER
  // =========================
  const placeOrder =
    async (
      paymentStatus
    ) => {

      try {

        await axios.post(

          `${API_URL}/api/orders`,

          {

            items:
              cart.map(
                (item) => ({

                  product:
                    item.product?._id,

                  name:
                    item.product?.name,

                  image:
                    item.product?.image,

                  pricePerMonth:
                    item.product
                      ?.pricePerMonth || 0,

                  quantity:
                    item.quantity || 1,
                })
              ),

            address,

            rentalDuration,

            deliveryDate,

            deliverySlot,

            totalAmount:
              total,

            paymentStatus,
          },

          {
            headers: {

              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        // =========================
        // CLEAR CART
        // =========================
        for (
          const item of cart
        ) {

          await axios.delete(

            `${API_URL}/api/cart/${item._id}`,

            {
              headers: {

                Authorization:
                  `Bearer ${token}`,
              },
            }
          );
        }

        toast.success(
          "🎉 Order Placed Successfully"
        );

        setTimeout(() => {

          navigate(
            "/my-orders"
          );

        }, 2000);

      } catch (error) {

        console.log(
          "PLACE ORDER ERROR:",
          error
        );

        toast.error(
          "Order Failed"
        );
      }
    };

  // =========================
  // HANDLE CHECKOUT
  // =========================
  const handleCheckout =
    async () => {

      if (
        !address ||
        !deliveryDate ||
        !rentalDuration
      ) {

        toast.error(
          "Please fill all fields"
        );

        return;
      }

      // =========================
      // VALIDATE TOTAL
      // =========================
      if (total <= 0) {

        toast.error(
          "Cart total is invalid"
        );

        return;
      }

      // =========================
      // COD
      // =========================
      if (
        paymentMethod ===
        "COD"
      ) {

        await placeOrder(
          "Pending"
        );

        return;
      }

      // =========================
      // RAZORPAY
      // =========================
      try {

        const loaded =
          await loadRazorpayScript();

        if (!loaded) {

          toast.error(
            "Razorpay failed to load"
          );

          return;
        }

        // =========================
        // CREATE PAYMENT ORDER
        // =========================
        const orderRes =
          await axios.post(

            `${API_URL}/api/payment/create-order`,

            {
              amount:
                total,
            }
          );

        const order =
          orderRes.data;

        console.log(
          "PAYMENT ORDER:",
          order
        );

        // =========================
        // RAZORPAY OPTIONS
        // =========================
        const options = {

          key:
            "rzp_test_SqUjAoT4Ur68Ff",

          amount:
            order.amount,

          currency:
            order.currency,

          name:
            "RentEase",

          description:
            "Rental Payment",

          order_id:
            order.id,

          // =========================
          // SUCCESS HANDLER
          // =========================
          handler:
            async function (
              response
            ) {

              console.log(
                "RAZORPAY RESPONSE:",
                response
              );

              try {

                const verifyRes =
                  await axios.post(

                    `${API_URL}/api/payment/verify`,

                    {

                      razorpay_order_id:
                        response.razorpay_order_id,

                      razorpay_payment_id:
                        response.razorpay_payment_id,

                      razorpay_signature:
                        response.razorpay_signature,
                    }
                  );

                console.log(
                  "VERIFY RESPONSE:",
                  verifyRes.data
                );

                if (
                  verifyRes.data.success
                ) {

                  toast.success(
                    "✅ Payment Verified"
                  );

                  await placeOrder(
                    "Paid"
                  );

                } else {

                  toast.error(
                    "Payment Verification Failed"
                  );
                }

              } catch (error) {

                console.log(
                  "VERIFY ERROR:",
                  error
                );

                toast.error(
                  "Verification Failed"
                );
              }
            },

          prefill: {

            name:
              userInfo?.name,

            email:
              userInfo?.email,
          },

          theme: {

            color:
              "#2563eb",
          },
        };

        const paymentObject =
          new window.Razorpay(
            options
          );

        paymentObject.open();

      } catch (error) {

        console.log(
          "PAYMENT ERROR:",
          error
        );

        toast.error(
          "Payment Failed"
        );
      }
    };

  // =========================
  // LOADING
  // =========================
  if (loading) {

    return (

      <h1
        style={{
          textAlign:
            "center",

          marginTop:
            "100px",
        }}
      >
        Loading...
      </h1>
    );
  }

  return (

    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>

        <h1 style={styles.heading}>
          Secure Checkout 💳
        </h1>

        <p style={styles.subHeading}>
          Complete your rental
          booking securely
        </p>

      </div>

      {/* CARD */}
      <div style={styles.card}>

        {/* ADDRESS */}
        <div style={styles.section}>

          <label style={styles.label}>
            Delivery Address
          </label>

          <textarea
            rows="4"

            value={address}

            onChange={(e) =>
              setAddress(
                e.target.value
              )
            }

            style={styles.input}
          />

        </div>

        {/* RENTAL */}
        <div style={styles.section}>

          <label style={styles.label}>
            Rental Duration (Months)
          </label>

          <input
            type="number"

            min="1"

            value={
              rentalDuration
            }

            onChange={(e) =>
              setRentalDuration(
                e.target.value
              )
            }

            style={styles.input}
          />

        </div>

        {/* DELIVERY DATE */}
        <div style={styles.section}>

          <label style={styles.label}>
            Delivery Date
          </label>

          <input
            type="date"

            value={
              deliveryDate
            }

            onChange={(e) =>
              setDeliveryDate(
                e.target.value
              )
            }

            style={styles.input}
          />

        </div>

        {/* SLOT */}
        <div style={styles.section}>

          <label style={styles.label}>
            Delivery Slot
          </label>

          <select

            value={deliverySlot}

            onChange={(e) =>
              setDeliverySlot(
                e.target.value
              )
            }

            style={styles.input}
          >

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

        {/* PAYMENT */}
        <div style={styles.section}>

          <label style={styles.label}>
            Payment Method
          </label>

          <select

            value={
              paymentMethod
            }

            onChange={(e) =>
              setPaymentMethod(
                e.target.value
              )
            }

            style={styles.input}
          >

            <option value="COD">
              Cash On Delivery
            </option>

            <option value="ONLINE">
              Razorpay
            </option>

          </select>

        </div>

        {/* SUMMARY */}
        <div style={styles.summary}>

          <h3>
            Monthly Rent:
            ₹{rentTotal}
          </h3>

          <h3>
            Deposit:
            ₹{depositTotal}
          </h3>

          <h2 style={styles.total}>
            Total: ₹{total}
          </h2>

        </div>

        {/* BUTTON */}
        <button
          onClick={
            handleCheckout
          }

          style={styles.button}
        >

          {
            paymentMethod ===
            "COD"

              ? "Place Order"

              : "Pay Now 💳"
          }

        </button>

      </div>

    </div>
  );
}

const styles = {

  page: {

    minHeight:
      "100vh",

    background:
      "linear-gradient(135deg,#667eea,#764ba2,#6dd5ed,#fbc2eb)",

    padding:
      "30px",
  },

  header: {

    textAlign:
      "center",

    marginBottom:
      "35px",
  },

  heading: {

    fontSize:
      "clamp(38px,6vw,60px)",

    color:
      "white",

    marginBottom:
      "10px",
  },

  subHeading: {

    color:
      "white",

    fontSize:
      "18px",
  },

  card: {

    maxWidth:
      "650px",

    margin:
      "auto",

    background:
      "rgba(255,255,255,0.95)",

    padding:
      "35px",

    borderRadius:
      "24px",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.2)",
  },

  section: {

    marginBottom:
      "24px",
  },

  label: {

    display:
      "block",

    marginBottom:
      "10px",

    fontWeight:
      "bold",

    color:
      "#1e293b",
  },

  input: {

    width:
      "100%",

    padding:
      "14px",

    borderRadius:
      "12px",

    border:
      "1px solid #cbd5e1",

    outline:
      "none",

    fontSize:
      "16px",

    boxSizing:
      "border-box",
  },

  summary: {

    background:
      "#f8fafc",

    padding:
      "25px",

    borderRadius:
      "18px",

    marginTop:
      "25px",

    textAlign:
      "center",
  },

  total: {

    color:
      "#2563eb",

    marginTop:
      "15px",

    fontSize:
      "30px",
  },

  button: {

    width:
      "100%",

    padding:
      "18px",

    marginTop:
      "28px",

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

    fontSize:
      "18px",

    cursor:
      "pointer",
  },
};

export default Checkout;