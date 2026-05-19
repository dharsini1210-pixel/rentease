import {
  useEffect,
  useState
} from "react";

import axios from "axios";

import {
  Link
} from "react-router-dom";

function Products() {

  const [
    products,
    setProducts
  ] = useState([]);

  const [
    filteredProducts,
    setFilteredProducts
  ] = useState([]);

  const [
    search,
    setSearch
  ] = useState("");

  const [
    category,
    setCategory
  ] = useState("All");

  const [
    sort,
    setSort
  ] = useState("");

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

            "http://localhost:5000/api/products"
          );

        setProducts(
          res.data
        );

        setFilteredProducts(
          res.data
        );

      } catch (error) {

        console.log(error);
      }
    };

  // =========================
  // FILTER PRODUCTS
  // =========================
  useEffect(() => {

    let updated =
      [...products];

    // SEARCH
    if (search) {

      updated =
        updated.filter(
          (item) =>

            item.name
              .toLowerCase()
              .includes(
                search.toLowerCase()
              )
        );
    }

    // CATEGORY
    if (
      category !== "All"
    ) {

      updated =
        updated.filter(
          (item) =>

            item.category ===
            category
        );
    }

    // SORT
    if (
      sort ===
      "low-high"
    ) {

      updated.sort(
        (a, b) =>

          a.pricePerMonth -
          b.pricePerMonth
      );
    }

    if (
      sort ===
      "high-low"
    ) {

      updated.sort(
        (a, b) =>

          b.pricePerMonth -
          a.pricePerMonth
      );
    }

    setFilteredProducts(
      updated
    );

  }, [
    search,
    category,
    sort,
    products
  ]);

  return (

    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>

        <h1 style={styles.heading}>
          Explore Rentals 🛋️
        </h1>

        <p style={styles.subHeading}>
          Premium furniture &
          appliance rentals
        </p>

      </div>

      {/* FILTER BAR */}
      <div style={styles.filterBar}>

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

          style={styles.search}
        />

        {/* CATEGORY */}
        <select

          value={category}

          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }

          style={styles.select}
        >

          <option>
            All
          </option>

          <option>
            Furniture
          </option>

          <option>
            Appliances
          </option>

        </select>

        {/* SORT */}
        <select

          value={sort}

          onChange={(e) =>
            setSort(
              e.target.value
            )
          }

          style={styles.select}
        >

          <option value="">
            Sort By
          </option>

          <option value="low-high">
            Price Low to High
          </option>

          <option value="high-low">
            Price High to Low
          </option>

        </select>

      </div>

      {/* PRODUCTS GRID */}
      <div style={styles.grid}>

        {filteredProducts.map(
          (product) => (

            <div
              key={product._id}
              style={styles.card}
            >

              {/* IMAGE */}
              <div
                style={
                  styles.imageContainer
                }
              >

                <img

                  src={
                    product.image
                  }

                  alt={
                    product.name
                  }

                  style={
                    styles.image
                  }
                />

                {/* STOCK BADGE */}
                <div
                  style={{
                    ...styles.stockBadge,

                    background:
                      product.stock >
                      0

                        ? "#10b981"

                        : "#ef4444",
                  }}
                >

                  {
                    product.stock >
                    0

                      ? `In Stock (${product.stock})`

                      : "Out of Stock"
                  }

                </div>

              </div>

              {/* CONTENT */}
              <div
                style={
                  styles.content
                }
              >

                <h2
                  style={
                    styles.name
                  }
                >
                  {
                    product.name
                  }
                </h2>

                <p
                  style={
                    styles.category
                  }
                >
                  {
                    product.category
                  }
                </p>

                <p
                  style={
                    styles.price
                  }
                >
                  ₹
                  {
                    product.pricePerMonth
                  }
                  /month
                </p>

                <p
                  style={
                    styles.deposit
                  }
                >
                  Deposit:
                  {" "}
                  ₹
                  {
                    product.deposit
                  }
                </p>

                {/* BUTTON */}
                <Link
                  to={`/product/${product._id}`}
                >

                  <button
                    style={
                      styles.button
                    }
                  >
                    View Details
                  </button>

                </Link>

              </div>

            </div>
          )
        )}

      </div>

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
      "30px",
  },

  header: {

    textAlign:
      "center",

    marginBottom:
      "40px",
  },

  heading: {

    fontSize:
      "clamp(36px,6vw,58px)",

    color:
      "#1e293b",

    marginBottom:
      "10px",
  },

  subHeading: {

    color:
      "#64748b",

    fontSize:
      "18px",
  },

  filterBar: {

    display:
      "flex",

    gap:
      "16px",

    marginBottom:
      "40px",

    flexWrap:
      "wrap",

    justifyContent:
      "center",
  },

  search: {

    padding:
      "14px",

    width:
      "100%",

    maxWidth:
      "320px",

    borderRadius:
      "12px",

    border:
      "1px solid #cbd5e1",

    fontSize:
      "16px",

    outline:
      "none",
  },

  select: {

    padding:
      "14px",

    borderRadius:
      "12px",

    border:
      "1px solid #cbd5e1",

    fontSize:
      "16px",

    outline:
      "none",
  },

  grid: {

    display:
      "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(280px,1fr))",

    gap:
      "30px",
  },

  card: {

    background:
      "white",

    borderRadius:
      "24px",

    overflow:
      "hidden",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",

    transition:
      "0.3s",

    cursor:
      "pointer",
  },

  imageContainer: {

    position:
      "relative",
  },

  image: {

    width:
      "100%",

    height:
      "250px",

    objectFit:
      "cover",
  },

  stockBadge: {

    position:
      "absolute",

    top:
      "15px",

    right:
      "15px",

    color:
      "white",

    padding:
      "8px 14px",

    borderRadius:
      "50px",

    fontSize:
      "13px",

    fontWeight:
      "bold",
  },

  content: {

    padding:
      "24px",
  },

  name: {

    color:
      "#1e293b",

    marginBottom:
      "10px",

    fontSize:
      "24px",
  },

  category: {

    color:
      "#64748b",

    marginBottom:
      "10px",
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

  deposit: {

    color:
      "#475569",

    marginBottom:
      "15px",
  },

  button: {

    width:
      "100%",

    padding:
      "14px",

    border:
      "none",

    borderRadius:
      "12px",

    background:
      "linear-gradient(135deg,#2563eb,#1d4ed8)",

    color:
      "white",

    fontWeight:
      "bold",

    cursor:
      "pointer",

    fontSize:
      "16px",
  },
};

export default Products;