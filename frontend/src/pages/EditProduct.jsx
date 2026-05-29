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

function EditProduct() {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [name, setName] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [
    pricePerMonth,
    setPricePerMonth,
  ] = useState("");

  const [deposit, setDeposit] =
    useState("");

  const [image, setImage] =
    useState("");

  const [stock, setStock] =
    useState(1);

  const [
    available,
    setAvailable
  ] = useState(true);

  // =========================
  // GET ADMIN INFO
  // =========================
  const adminInfo = JSON.parse(
    localStorage.getItem("adminInfo")
  );

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

            `https://rentease-baackend.onrender.com/api/products/${id}`
          );

        const product =
          res.data;

        setName(
          product.name
        );

        setCategory(
          product.category
        );

        setPricePerMonth(
          product.pricePerMonth
        );

        setDeposit(
          product.deposit
        );

        setImage(
          product.image
        );

        setStock(
          product.stock || 1
        );

        setAvailable(
          product.available
        );

      } catch (error) {

        console.log(error);

        toast.error(
          "❌ Failed to load product"
        );
      }
    };

  // =========================
  // UPDATE PRODUCT
  // =========================
  const updateProduct =
    async (e) => {

      e.preventDefault();

      try {

        const config = {

          headers: {

            Authorization:
              `Bearer ${adminInfo.token}`,
          },
        };

        await axios.put(

          `https://rentease-baackend.onrender.com/api/products/${id}`,

          {
            name,
            category,
            pricePerMonth,
            deposit,
            image,
            stock,
            available,
          },

          config
        );

        toast.success(
          "✅ Product Updated Successfully"
        );

        setTimeout(() => {

          navigate(
            "/admin/manage-products"
          );

        }, 1500);

      } catch (error) {

        console.log(error);

        toast.error(
          "❌ Product Update Failed"
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
        onSubmit={
          updateProduct
        }

        style={{
          background:
            "rgba(255,255,255,0.15)",

          padding: "40px",

          borderRadius:
            "20px",

          width: "500px",

          color: "white",

          backdropFilter:
            "blur(10px)",
        }}
      >

        <h1
          style={{
            textAlign:
              "center",

            marginBottom:
              "30px",

            fontSize: "40px",
          }}
        >
          Edit Product ✏️
        </h1>

        {/* IMAGE PREVIEW */}
        <img
          src={image}
          alt="product"

          style={{
            width: "100%",

            height: "240px",

            objectFit: "cover",

            borderRadius: "16px",

            marginBottom: "25px",
          }}
        />

        {/* PRODUCT NAME */}
        <label style={styles.label}>
          Product Name
        </label>

        <input
          type="text"

          value={name}

          onChange={(e) =>
            setName(
              e.target.value
            )
          }

          style={styles.input}
        />

        {/* CATEGORY */}
        <label style={styles.label}>
          Category
        </label>

        <select
          value={category}

          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }

          style={styles.input}
        >

          <option value="">
            Select Category
          </option>

          <option value="Furniture">
            Furniture
          </option>

          <option value="Electronics">
            Electronics
          </option>

          <option value="Appliances">
            Appliances
          </option>

        </select>

        {/* PRICE */}
        <label style={styles.label}>
          Monthly Rent Amount
        </label>

        <input
          type="number"

          value={pricePerMonth}

          onChange={(e) =>
            setPricePerMonth(
              e.target.value
            )
          }

          style={styles.input}
        />

        {/* DEPOSIT */}
        <label style={styles.label}>
          Deposit Amount
        </label>

        <input
          type="number"

          value={deposit}

          onChange={(e) =>
            setDeposit(
              e.target.value
            )
          }

          style={styles.input}
        />

        {/* STOCK */}
        <label style={styles.label}>
          Product Stock
        </label>

        <input
          type="number"

          value={stock}

          onChange={(e) =>
            setStock(
              e.target.value
            )
          }

          style={styles.input}
        />

        {/* AVAILABILITY */}
        <label style={styles.label}>
          Availability
        </label>

        <select
          value={available}

          onChange={(e) =>
            setAvailable(
              e.target.value ===
              "true"
            )
          }

          style={styles.input}
        >

          <option value="true">
            Available
          </option>

          <option value="false">
            Out Of Stock
          </option>

        </select>

        {/* IMAGE URL */}
        <label style={styles.label}>
          Product Image URL
        </label>

        <input
          type="text"

          value={image}

          onChange={(e) =>
            setImage(
              e.target.value
            )
          }

          style={styles.input}
        />

        {/* BUTTON */}
        <button
          type="submit"

          style={styles.button}
        >
          Update Product
        </button>

      </form>

    </div>
  );
}

const styles = {

  label: {

    display: "block",

    marginBottom: "8px",

    fontWeight: "bold",

    color: "white",
  },

  input: {

    width: "100%",

    padding: "14px",

    marginBottom:
      "22px",

    borderRadius:
      "10px",

    border: "none",

    outline: "none",

    fontSize: "15px",
  },

  button: {

    width: "100%",

    padding: "16px",

    border: "none",

    borderRadius:
      "12px",

    background:
      "linear-gradient(135deg,#10b981,#059669)",

    color: "white",

    fontWeight:
      "bold",

    cursor:
      "pointer",

    fontSize: "18px",
  },
};

export default EditProduct;