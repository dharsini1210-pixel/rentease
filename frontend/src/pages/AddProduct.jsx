import { useState } from "react";
import axios from "axios";

function AddProduct() {

  const [name, setName] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [pricePerMonth, setPricePerMonth] =
    useState("");

  const [deposit, setDeposit] =
    useState("");

  const [image, setImage] =
    useState("");

  // =========================
  // ADD PRODUCT
  // =========================
  const addProduct = async (e) => {

    e.preventDefault();

    try {

      // =========================
      // GET ADMIN TOKEN
      // =========================
      const token =
        JSON.parse(
          localStorage.getItem("adminInfo")
        )?.token;

      const res = await axios.post(

        "https://rentease-baackend.onrender.com/api/products",

        {
          name,
          category,
          pricePerMonth,
          deposit,
          image,
        },

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);

      alert(
        "Product Added Successfully"
      );

      // =========================
      // CLEAR FIELDS
      // =========================
      setName("");
      setCategory("");
      setPricePerMonth("");
      setDeposit("");
      setImage("");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to add product"
      );
    }
  };

  return (

    <div
      style={{
        minHeight: "100vh",

        background:
          "linear-gradient(135deg, #1e3c72, #2a5298)",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        padding: "40px",
      }}
    >

      <form
        onSubmit={addProduct}

        style={{
          background:
            "rgba(255,255,255,0.1)",

          padding: "40px",

          borderRadius: "16px",

          width: "400px",

          backdropFilter: "blur(10px)",

          boxShadow:
            "0 10px 25px rgba(0,0,0,0.3)",
        }}
      >

        <h1
          style={{
            color: "white",

            textAlign: "center",

            marginBottom: "30px",
          }}
        >
          Add Product
        </h1>

        {/* NAME */}
        <input
          type="text"

          placeholder="Product Name"

          value={name}

          onChange={(e) =>
            setName(e.target.value)
          }

          required

          style={styles.input}
        />

        {/* CATEGORY */}
        <input
          type="text"

          placeholder="Category"

          value={category}

          onChange={(e) =>
            setCategory(e.target.value)
          }

          required

          style={styles.input}
        />

        {/* PRICE */}
        <input
          type="number"

          placeholder="Price Per Month"

          value={pricePerMonth}

          onChange={(e) =>
            setPricePerMonth(
              e.target.value
            )
          }

          required

          style={styles.input}
        />

        {/* DEPOSIT */}
        <input
          type="number"

          placeholder="Deposit"

          value={deposit}

          onChange={(e) =>
            setDeposit(
              e.target.value
            )
          }

          required

          style={styles.input}
        />

        {/* IMAGE */}
        <input
          type="text"

          placeholder="Image URL"

          value={image}

          onChange={(e) =>
            setImage(e.target.value)
          }

          required

          style={styles.input}
        />

        {/* BUTTON */}
        <button
          type="submit"

          style={styles.button}
        >
          Add Product
        </button>

      </form>
    </div>
  );
}

// =========================
// STYLES
// =========================
const styles = {

  input: {

    width: "100%",

    padding: "12px",

    marginBottom: "20px",

    borderRadius: "8px",

    border: "none",

    outline: "none",
  },

  button: {

    width: "100%",

    padding: "12px",

    border: "none",

    borderRadius: "8px",

    background:
      "linear-gradient(135deg, #667eea, #764ba2)",

    color: "white",

    fontWeight: "bold",

    cursor: "pointer",

    fontSize: "16px",
  },
};

export default AddProduct;