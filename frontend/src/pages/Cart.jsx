import {
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

function Cart() {

  const navigate =
    useNavigate();

  // =========================
  // CART STATE
  // =========================
  const [cart, setCart] =
    useState([]);

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

            "https://rentease-d1zx.onrender.com/api/cart",

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setCart(
          res.data
        );

      } catch (error) {

        console.log(error);
      }
    };

  // =========================
  // UPDATE QUANTITY
  // =========================
  const updateQuantity =
    async (
      productId,
      quantity
    ) => {

      if (quantity < 1)
        return;

      try {

        await axios.post(

          "https://rentease-d1zx.onrender.com/api/cart",

          {
            productId,
            quantity,
          },

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        fetchCart();

        window.dispatchEvent(
          new Event("storage")
        );

      } catch (error) {

        console.log(error);
      }
    };

  // =========================
  // REMOVE ITEM
  // =========================
  const removeItem =
    async (cartId) => {

      try {

        await axios.delete(

          `https://rentease-d1zx.onrender.com/api/cart/${cartId}`,

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        fetchCart();

        window.dispatchEvent(
          new Event("storage")
        );

      } catch (error) {

        console.log(error);
      }
    };

  // =========================
  // CLEAR CART
  // =========================
  const clearCart =
    async () => {

      try {

        for (
          const item of cart
        ) {

          await axios.delete(

            `https://rentease-d1zx.onrender.com/api/cart/${item._id}`,

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );
        }

        fetchCart();

        window.dispatchEvent(
          new Event("storage")
        );

      } catch (error) {

        console.log(error);
      }
    };

  // =========================
  // TOTALS
  // =========================
  const rentTotal =
    cart.reduce(

      (sum, item) =>

        sum +

        item.product
          .pricePerMonth *

          item.quantity,

      0
    );

  const depositTotal =
    cart.reduce(

      (sum, item) =>

        sum +

        item.product
          .deposit *

          item.quantity,

      0
    );

  const grandTotal =
    rentTotal +
    depositTotal;

  return (

    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>

        <h1 style={styles.heading}>
          Your Cart 🛒
        </h1>

        <p style={styles.subHeading}>
          Review your selected
          rentals
        </p>

      </div>

      {/* EMPTY */}
      {cart.length === 0 ? (

        <div style={styles.emptyCard}>

          <h2>
            Your cart is empty
          </h2>

          <button
            onClick={() =>
              navigate(
                "/products"
              )
            }

            style={
              styles.shopButton
            }
          >
            Browse Products
          </button>

        </div>

      ) : (

        <div style={styles.container}>

          {/* LEFT SECTION */}
          <div style={styles.left}>

            {cart.map((item) => (

              <div
                key={item._id}
                style={styles.card}
              >

                {/* IMAGE */}
                <img

                  src={
                    item.product.image
                  }

                  alt={
                    item.product.name
                  }

                  style={styles.image}
                />

                {/* DETAILS */}
                <div
                  style={styles.content}
                >

                  <h2
                    style={styles.name}
                  >
                    {
                      item.product.name
                    }
                  </h2>

                  <p>
                    Category:
                    {" "}
                    {
                      item.product
                        .category
                    }
                  </p>

                  <p
                    style={
                      styles.price
                    }
                  >
                    ₹
                    {
                      item.product
                        .pricePerMonth
                    }
                    /month
                  </p>

                  <p>
                    Deposit:
                    {" "}
                    ₹
                    {
                      item.product
                        .deposit
                    }
                  </p>

                  {/* QUANTITY */}
                  <div
                    style={
                      styles.qtyContainer
                    }
                  >

                    <button
                      onClick={() =>

                        updateQuantity(

                          item.product._id,

                          item.quantity -
                            1
                        )
                      }

                      style={
                        styles.qtyButton
                      }
                    >
                      -
                    </button>

                    <span
                      style={
                        styles.qtyText
                      }
                    >
                      {
                        item.quantity
                      }
                    </span>

                    <button
                      onClick={() =>

                        updateQuantity(

                          item.product._id,

                          item.quantity +
                            1
                        )
                      }

                      style={
                        styles.qtyButton
                      }
                    >
                      +
                    </button>

                  </div>

                  {/* REMOVE */}
                  <button
                    onClick={() =>
                      removeItem(
                        item._id
                      )
                    }

                    style={
                      styles.removeBtn
                    }
                  >
                    Remove Item
                  </button>

                </div>

              </div>
            ))}

          </div>

          {/* SUMMARY */}
          <div style={styles.summary}>

            <h2
              style={
                styles.summaryTitle
              }
            >
              Order Summary
            </h2>

            <div
              style={
                styles.summaryRow
              }
            >

              <span>
                Monthly Rent
              </span>

              <strong>
                ₹{rentTotal}
              </strong>

            </div>

            <div
              style={
                styles.summaryRow
              }
            >

              <span>
                Deposit
              </span>

              <strong>
                ₹{depositTotal}
              </strong>

            </div>

            <hr
              style={{
                margin:
                  "20px 0",
              }}
            />

            <div
              style={
                styles.summaryRow
              }
            >

              <span
                style={{
                  fontSize:
                    "22px",
                }}
              >
                Total
              </span>

              <strong
                style={{
                  fontSize:
                    "22px",
                }}
              >
                ₹
                {
                  grandTotal
                }
              </strong>

            </div>

            {/* BUTTONS */}
            <button
              onClick={
                clearCart
              }

              style={
                styles.clearBtn
              }
            >
              Clear Cart
            </button>

            <button
              onClick={() =>
                navigate(
                  "/checkout"
                )
              }

              style={
                styles.checkoutBtn
              }
            >
              Proceed to Checkout
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

const styles = {

  page: {

    minHeight:
      "100vh",

    background:
      "linear-gradient(135deg,#667eea,#764ba2,#6dd5ed)",

    padding:
      "30px",
  },

  header: {

    textAlign:
      "center",

    marginBottom:
      "40px",

    color:
      "white",
  },

  heading: {

    fontSize:
      "clamp(36px,6vw,56px)",

    marginBottom:
      "10px",
  },

  subHeading: {

    fontSize:
      "18px",
  },

  emptyCard: {

    textAlign:
      "center",

    marginTop:
      "100px",

    color:
      "white",
  },

  container: {

    display:
      "flex",

    gap:
      "30px",

    flexWrap:
      "wrap",

    alignItems:
      "flex-start",
  },

  left: {

    flex:
      "2",

    minWidth:
      "300px",
  },

  card: {

    background:
      "rgba(255,255,255,0.95)",

    color:
      "black",

    display:
      "flex",

    flexWrap:
      "wrap",

    gap:
      "20px",

    padding:
      "20px",

    borderRadius:
      "22px",

    marginBottom:
      "25px",

    boxShadow:
      "0 10px 25px rgba(0,0,0,0.2)",
  },

  image: {

    width:
      "100%",

    maxWidth:
      "220px",

    height:
      "180px",

    objectFit:
      "cover",

    borderRadius:
      "16px",
  },

  content: {

    flex:
      1,

    minWidth:
      "220px",
  },

  name: {

    marginBottom:
      "10px",

    color:
      "#1e293b",
  },

  price: {

    color:
      "#2563eb",

    fontSize:
      "24px",

    fontWeight:
      "bold",

    margin:
      "10px 0",
  },

  qtyContainer: {

    display:
      "flex",

    alignItems:
      "center",

    gap:
      "15px",

    marginTop:
      "18px",
  },

  qtyButton: {

    width:
      "42px",

    height:
      "42px",

    borderRadius:
      "50%",

    border:
      "none",

    background:
      "#667eea",

    color:
      "white",

    fontWeight:
      "bold",

    cursor:
      "pointer",

    fontSize:
      "20px",
  },

  qtyText: {

    fontWeight:
      "bold",

    fontSize:
      "20px",
  },

  removeBtn: {

    marginTop:
      "22px",

    background:
      "#ef4444",

    color:
      "white",

    border:
      "none",

    padding:
      "12px 18px",

    borderRadius:
      "12px",

    cursor:
      "pointer",

    fontWeight:
      "bold",
  },

  summary: {

    flex:
      "1",

    minWidth:
      "280px",

    background:
      "rgba(255,255,255,0.95)",

    color:
      "black",

    padding:
      "30px",

    borderRadius:
      "22px",

    boxShadow:
      "0 10px 25px rgba(0,0,0,0.2)",
  },

  summaryTitle: {

    marginBottom:
      "25px",

    color:
      "#1e293b",
  },

  summaryRow: {

    display:
      "flex",

    justifyContent:
      "space-between",

    marginBottom:
      "16px",

    fontSize:
      "18px",
  },

  clearBtn: {

    width:
      "100%",

    marginTop:
      "25px",

    padding:
      "15px",

    border:
      "none",

    borderRadius:
      "14px",

    cursor:
      "pointer",

    fontWeight:
      "bold",

    background:
      "#ef4444",

    color:
      "white",

    fontSize:
      "16px",
  },

  checkoutBtn: {

    width:
      "100%",

    marginTop:
      "15px",

    padding:
      "15px",

    border:
      "none",

    borderRadius:
      "14px",

    cursor:
      "pointer",

    fontWeight:
      "bold",

    background:
      "linear-gradient(135deg,#2563eb,#1d4ed8)",

    color:
      "white",

    fontSize:
      "16px",
  },

  shopButton: {

    marginTop:
      "25px",

    padding:
      "14px 24px",

    border:
      "none",

    borderRadius:
      "12px",

    background:
      "#2563eb",

    color:
      "white",

    cursor:
      "pointer",

    fontWeight:
      "bold",
  },
};

export default Cart;