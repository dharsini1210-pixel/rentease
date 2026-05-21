import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  toast,
} from "react-toastify";

function ProductDetails() {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [product, setProduct] =
    useState(null);

  const [quantity, setQuantity] =
    useState(1);

  // =========================
  // FETCH PRODUCT
  // =========================
  useEffect(() => {

    fetchProduct();

  }, []);

  const fetchProduct =
    async () => {

      try {

        const res =
          await axios.get(

            `https://rentease-d1zx.onrender.com/api/products/${id}`
          );

        setProduct(
          res.data
        );

      } catch (error) {

        console.log(error);

        toast.error(
          "❌ Failed to load product"
        );
      }
    };

  // =========================
  // ADD TO CART
  // =========================
  const addToCart =
    async () => {

      try {

        const userInfo =
          JSON.parse(
            localStorage.getItem(
              "userInfo"
            )
          );

        const token =
          userInfo?.token;

        // LOGIN CHECK
        if (!token) {

          navigate("/login");

          return;
        }

        // OUT OF STOCK CHECK
        if (
          product.stock <= 0 ||
          !product.available
        ) {

          toast.error(
            "❌ Product Out Of Stock"
          );

          return;
        }

        await axios.post(

          "https://rentease-d1zx.onrender.com/api/cart",

          {
            productId:
              product._id,

            quantity,
          },

          {
            headers: {

              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        toast.success(
          "✅ Added To Cart"
        );

      } catch (error) {

        console.log(error);

        toast.error(
          "❌ Failed to add to cart"
        );
      }
    };

  // =========================
  // LOADING
  // =========================
  if (!product) {

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

    <div
      style={{
        minHeight:
          "100vh",

        background:
          "linear-gradient(135deg, #667eea, #764ba2, #6dd5ed)",

        padding:
          "50px",
      }}
    >

      <div
        style={{
          display:
            "flex",

          flexWrap:
            "wrap",

          gap: "40px",

          background:
            "white",

          padding:
            "35px",

          borderRadius:
            "20px",

          boxShadow:
            "0 10px 25px rgba(0,0,0,0.2)",
        }}
      >

        {/* IMAGE */}
        <div
          style={{
            flex: 1,
          }}
        >

          <img
            src={product.image}

            alt={product.name}

            style={{
              width:
                "100%",

              maxWidth:
                "500px",

              height:
                "400px",

              objectFit:
                "cover",

              borderRadius:
                "18px",
            }}
          />

        </div>

        {/* DETAILS */}
        <div
          style={{
            flex: 1,

            minWidth:
              "300px",
          }}
        >

          {/* CATEGORY */}
          <span
            style={{
              background:
                "#667eea",

              color:
                "white",

              padding:
                "8px 16px",

              borderRadius:
                "20px",

              fontSize:
                "14px",

              fontWeight:
                "bold",
            }}
          >
            {product.category}
          </span>

          {/* NAME */}
          <h1
            style={{
              marginTop:
                "20px",

              fontSize:
                "42px",

              color:
                "#1e3c72",
            }}
          >
            {product.name}
          </h1>

          {/* STOCK STATUS */}
          <div
            style={{
              marginTop:
                "15px",
            }}
          >

            {
              product.available &&
              product.stock > 0 ? (

                <span
                  style={{
                    background:
                      "#10b981",

                    color:
                      "white",

                    padding:
                      "8px 16px",

                    borderRadius:
                      "20px",

                    fontWeight:
                      "bold",
                  }}
                >
                  ✅ In Stock
                </span>

              ) : (

                <span
                  style={{
                    background:
                      "#ef4444",

                    color:
                      "white",

                    padding:
                      "8px 16px",

                    borderRadius:
                      "20px",

                    fontWeight:
                      "bold",
                  }}
                >
                  ❌ Out Of Stock
                </span>
              )
            }

          </div>

          {/* STOCK COUNT */}
          <h3
            style={{
              marginTop:
                "20px",

              color:
                "#444",
            }}
          >
            Available Units:
            {" "}
            {product.stock}
          </h3>

          {/* PRICE */}
          <h2
            style={{
              marginTop:
                "20px",

              color:
                "#4CAF50",

              fontSize:
                "32px",
            }}
          >
            ₹
            {product.pricePerMonth}
            {" "}
            / month
          </h2>

          {/* DEPOSIT */}
          <h3
            style={{
              marginTop:
                "10px",

              color:
                "#444",
            }}
          >
            Security Deposit:
            {" "}
            ₹
            {product.deposit}
          </h3>

          {/* DESCRIPTION */}
          <div
            style={{
              marginTop:
                "30px",
            }}
          >

            <h3>
              Product Description
            </h3>

            <p
              style={{
                lineHeight:
                  "1.8",

                color:
                  "#555",
              }}
            >
              {
                product.description
              }
            </p>

          </div>

          {/* QUANTITY */}
          <div
            style={{
              marginTop:
                "30px",

              display:
                "flex",

              alignItems:
                "center",

              gap: "15px",
            }}
          >

            <button
              onClick={() =>
                quantity > 1 &&
                setQuantity(
                  quantity - 1
                )
              }

              style={
                styles.qtyButton
              }
            >
              -
            </button>

            <span
              style={{
                fontSize:
                  "22px",

                fontWeight:
                  "bold",
              }}
            >
              {quantity}
            </span>

            <button
              onClick={() =>
                quantity <
                  product.stock &&
                setQuantity(
                  quantity + 1
                )
              }

              style={
                styles.qtyButton
              }
            >
              +
            </button>

          </div>

          {/* BUTTON */}
          <button

            onClick={
              addToCart
            }

            disabled={
              !product.available ||
              product.stock <= 0
            }

            style={{
              marginTop:
                "35px",

              background:
                product.available &&
                product.stock > 0

                  ? "linear-gradient(135deg, #667eea, #764ba2)"

                  : "#9ca3af",

              color:
                "white",

              border:
                "none",

              padding:
                "16px 35px",

              borderRadius:
                "12px",

              cursor:
                product.available &&
                product.stock > 0

                  ? "pointer"

                  : "not-allowed",

              fontWeight:
                "bold",

              fontSize:
                "17px",

              boxShadow:
                "0 5px 15px rgba(0,0,0,0.2)",
            }}
          >

            {
              product.available &&
              product.stock > 0

                ? "Add To Cart"

                : "Out Of Stock"
            }

          </button>

        </div>

      </div>

    </div>
  );
}

// =========================
// STYLES
// =========================
const styles = {

  qtyButton: {

    width: "40px",

    height: "40px",

    borderRadius:
      "50%",

    border: "none",

    background:
      "#667eea",

    color: "white",

    fontSize: "22px",

    cursor: "pointer",

    fontWeight: "bold",
  },
};

export default ProductDetails;