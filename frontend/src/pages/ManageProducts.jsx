import { useEffect, useState } from "react";
import axios from "axios";

function ManageProducts() {

  const [products, setProducts] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("");

  // =========================
  // GET ADMIN INFO
  // =========================
  const adminInfo = JSON.parse(
    localStorage.getItem("adminInfo")
  );

  // =========================
  // FETCH PRODUCTS
  // =========================
  useEffect(() => {

    fetchProducts();

  }, []);

  const fetchProducts =
    async () => {

      try {

        const res =
          await axios.get(
            "https://rentease-baackend.onrender.com/api/products"
          );

        setProducts(
          res.data
        );

      } catch (error) {

        console.log(error);

        alert(
          "Failed to fetch products"
        );
      }
    };

  // =========================
  // DELETE PRODUCT
  // =========================
  const deleteProduct =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this product?"
        );

      if (!confirmDelete)
        return;

      try {

        const config = {

          headers: {

            Authorization:
              `Bearer ${adminInfo.token}`,
          },
        };

        await axios.delete(

          `https://rentease-baackend.onrender.com/api/products/${id}`,

          config
        );

        alert(
          "Product Deleted Successfully"
        );

        fetchProducts();

      } catch (error) {

        console.log(error);

        alert(
          "Delete failed"
        );
      }
    };

  // =========================
  // FILTER PRODUCTS
  // =========================
  const filteredProducts =
    products.filter((product) => {

      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesCategory =

        category === ""

          ? true

          : product.category ===
            category;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  return (

    <div
      style={{
        minHeight: "100vh",

        background:
          "linear-gradient(135deg, #1e3c72, #2a5298)",

        padding: "50px",

        color: "white",
      }}
    >

      {/* HEADING */}
      <h1
        style={{
          textAlign: "center",

          marginBottom: "40px",

          fontSize: "42px",

          fontWeight: "bold",
        }}
      >
        Manage Products 🛒
      </h1>

      {/* SEARCH + FILTER */}
      <div
        style={{
          display: "flex",

          justifyContent:
            "center",

          gap: "15px",

          marginBottom: "40px",

          flexWrap: "wrap",
        }}
      >

        {/* SEARCH */}
        <input
          type="text"

          placeholder="Search products..."

          value={search}

          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }

          style={{
            padding: "12px",

            width: "250px",

            borderRadius: "10px",

            border: "none",

            outline: "none",
          }}
        />

        {/* CATEGORY */}
        <select
          value={category}

          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }

          style={{
            padding: "12px",

            borderRadius: "10px",

            border: "none",

            outline: "none",
          }}
        >

          <option value="">
            All Categories
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

      </div>

      {/* EMPTY MESSAGE */}
      {filteredProducts.length === 0 && (

        <h2
          style={{
            textAlign: "center",
          }}
        >
          No products found
        </h2>
      )}

      {/* PRODUCT GRID */}
      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit, minmax(320px, 1fr))",

          gap: "35px",
        }}
      >

        {filteredProducts.map((product) => (

          <div
            key={product._id}

            style={{
              background:
                "rgba(255,255,255,0.15)",

              borderRadius: "18px",

              overflow: "hidden",

              backdropFilter:
                "blur(8px)",

              boxShadow:
                "0 10px 25px rgba(0,0,0,0.3)",
            }}
          >

            {/* IMAGE */}
            <img
              src={product.image}
              alt={product.name}

              style={{
                width: "100%",

                height: "240px",

                objectFit: "cover",
              }}
            />

            {/* DETAILS */}
            <div
              style={{
                padding: "20px",
              }}
            >

              <h2>
                {product.name}
              </h2>

              <p>
                <strong>
                  Category:
                </strong>
                {" "}
                {product.category}
              </p>

              <p>
                <strong>
                  Rent:
                </strong>
                {" "}
                ₹
                {product.pricePerMonth}
                {" "}
                / month
              </p>

              <p>
                <strong>
                  Deposit:
                </strong>
                {" "}
                ₹
                {product.deposit}
              </p>

              {/* BUTTONS */}
              <div
                style={{
                  display: "flex",

                  gap: "12px",

                  marginTop: "20px",
                }}
              >

                {/* EDIT */}
                <a
                  href={`/admin/edit-product/${product._id}`}
                  style={{
                    flex: 1,
                  }}
                >

                  <button
                    style={{
                      width: "100%",

                      background:
                        "#4CAF50",

                      color: "white",

                      border: "none",

                      padding: "12px",

                      borderRadius: "10px",

                      cursor: "pointer",

                      fontWeight: "bold",
                    }}
                  >
                    Edit
                  </button>

                </a>

                {/* DELETE */}
                <button

                  onClick={() =>
                    deleteProduct(product._id)
                  }

                  style={{
                    flex: 1,

                    background:
                      "#ff4d4d",

                    color: "white",

                    border: "none",

                    padding: "12px",

                    borderRadius: "10px",

                    cursor: "pointer",

                    fontWeight: "bold",
                  }}
                >
                  Delete
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default ManageProducts;