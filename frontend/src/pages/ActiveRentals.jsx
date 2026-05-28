import {
  useEffect,
  useState
} from "react";

import axios from "axios";

import AdminNavbar from "../components/AdminNavbar";

function ActiveRentals() {

  const [rentals, setRentals] =
    useState([]);

  const [filteredRentals, setFilteredRentals] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  // ACTIVE FILTER
  const [activeFilter, setActiveFilter] =
    useState("all");

  // NOTIFICATION COUNTS
  const [stats, setStats] =
    useState({

      active: 0,

      expiringSoon: 0,

      expired: 0,
    });

  const adminInfo = JSON.parse(

    localStorage.getItem(
      "adminInfo"
    )
  );

  // =========================
  // FETCH RENTALS
  // =========================
  useEffect(() => {

    fetchRentals();

  }, []);

  // =========================
  // SEARCH + FILTER
  // =========================
  useEffect(() => {

    let updatedRentals =
      [...rentals];

    // FILTERS
    if (
      activeFilter ===
      "active"
    ) {

      updatedRentals =
        updatedRentals.filter(

          (item) =>

            !item.expired &&

            item.daysLeft > 2
        );
    }

    if (
      activeFilter ===
      "expiring"
    ) {

      updatedRentals =
        updatedRentals.filter(

          (item) =>

            item.daysLeft <= 2 &&

            item.daysLeft > 0
        );
    }

    if (
      activeFilter ===
      "expired"
    ) {

      updatedRentals =
        updatedRentals.filter(

          (item) =>
            item.expired
        );
    }

    // SEARCH
    updatedRentals =
      updatedRentals.filter(

        (item) =>

          item.customer
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||

          item.product
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    setFilteredRentals(
      updatedRentals
    );

  }, [
    search,
    rentals,
    activeFilter
  ]);

  // =========================
  // FETCH DATA
  // =========================
  const fetchRentals = async () => {

    try {

      if (!adminInfo?.token) {

        setLoading(false);

        return;
      }

      const config = {

        headers: {

          Authorization:
            `Bearer ${adminInfo.token}`,
        },
      };

      const res = await axios.get(

        "http://localhost:5000/api/orders",

        config
      );

      const allOrders =
        res.data || [];

      const activeRentals =
        [];

      let activeCount = 0;

      let expiringSoonCount = 0;

      let expiredCount = 0;

      allOrders.forEach(

        (order) => {

          if (!order.items)
            return;

          order.items.forEach(

            (item) => {

              const startDate =
                new Date(
                  order.deliveryDate
                );

              const endDate =
                new Date(
                  startDate
                );

              endDate.setMonth(

                endDate.getMonth() +

                (order.rentalDuration || 1)
              );

              const today =
                new Date();

              const diffTime =
                endDate - today;

              const daysLeft =
                Math.ceil(

                  diffTime /

                  (1000 * 60 * 60 * 24)
                );

              // COUNTS
              if (daysLeft <= 0) {

                expiredCount++;

              } else if (
                daysLeft <= 2
              ) {

                expiringSoonCount++;

              } else {

                activeCount++;
              }

              activeRentals.push({

                customer:

                  order.user?.name ||

                  order.customerName ||

                  "Unknown",

                phone:

                  order.user?.phone ||

                  order.customerPhone ||

                  "No Phone",

                product:
                  item.name ||

                  "Unknown Product",

                deliveryDate:

                  order.deliveryDate

                    ? new Date(
                        order.deliveryDate
                      ).toLocaleDateString()

                    : "N/A",

                duration:
                  order.rentalDuration || 1,

                daysLeft,

                expired:
                  daysLeft <= 0,
              });
            }
          );
        }
      );

      setStats({

        active: activeCount,

        expiringSoon:
          expiringSoonCount,

        expired:
          expiredCount,
      });

      setRentals(
        activeRentals
      );

      setFilteredRentals(
        activeRentals
      );

      setLoading(false);

    } catch (error) {

      console.log(
        "ACTIVE RENTALS ERROR:",
        error
      );

      setLoading(false);
    }
  };

  // =========================
  // RENEW RENTAL
  // =========================
  const renewRental = (
    rental
  ) => {

    alert(

      `Renewal initiated for ${rental.product}`

    );
  };

  return (

    <>

      <AdminNavbar />

      <div style={styles.page}>

        <h1 style={styles.heading}>
          🔥 Active Rentals Management
        </h1>

        {/* NOTIFICATION CARDS */}
        <div style={styles.cardGrid}>

          {/* ACTIVE */}
          <div

            style={{
              ...styles.activeCard,
            }}

            onClick={() =>
              setActiveFilter(
                "active"
              )
            }
          >

            <h2>
              🟢 Active Rentals
            </h2>

            <h1>
              {stats.active}
            </h1>

          </div>

          {/* EXPIRING */}
          <div

            style={{
              ...styles.warningCard,
            }}

            onClick={() =>
              setActiveFilter(
                "expiring"
              )
            }
          >

            <h2>
              ⚠️ Expiring Soon
            </h2>

            <h1>
              {
                stats.expiringSoon
              }
            </h1>

          </div>

          {/* EXPIRED */}
          <div

            style={{
              ...styles.expiredCard,
            }}

            onClick={() =>
              setActiveFilter(
                "expired"
              )
            }
          >

            <h2>
              🔴 Expired Rentals
            </h2>

            <h1>
              {stats.expired}
            </h1>

          </div>

        </div>

        {/* RESET FILTER */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
          }}
        >

          <button

            onClick={() =>
              setActiveFilter(
                "all"
              )
            }

            style={styles.resetBtn}
          >
            Show All Rentals
          </button>

        </div>

        {/* SEARCH */}
        <div style={styles.searchContainer}>

          <input

            type="text"

            placeholder="Search customer or product..."

            value={search}

            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }

            style={styles.searchInput}
          />

        </div>

        {/* LOADING */}
        {loading && (

          <h2 style={styles.message}>
            Loading Rentals...
          </h2>
        )}

        {/* EMPTY */}
        {!loading &&
          filteredRentals.length === 0 && (

          <h2 style={styles.message}>
            No Rentals Found
          </h2>
        )}

        {/* TABLE */}
        {!loading &&
          filteredRentals.length > 0 && (

          <div
            style={
              styles.tableContainer
            }
          >

            <div
              style={
                styles.tableHead
              }
            >

              <span>Customer</span>

              <span>Phone</span>

              <span>Product</span>

              <span>Delivery</span>

              <span>Duration</span>

              <span>Status</span>

              <span>Action</span>

            </div>

            {filteredRentals.map(

              (item, index) => (

                <div
                  key={index}

                  style={
                    styles.tableRow
                  }
                >

                  <span>
                    {item.customer}
                  </span>

                  <span>
                    {item.phone}
                  </span>

                  <span>
                    {item.product}
                  </span>

                  <span>
                    {
                      item.deliveryDate
                    }
                  </span>

                  <span>
                    {
                      item.duration
                    } Months
                  </span>

                  <span>

                    {item.expired ? (

                      <div
                        style={
                          styles.expiredBadge
                        }
                      >
                        Expired
                      </div>

                    ) : item.daysLeft <= 2 ? (

                      <div
                        style={
                          styles.warningBadge
                        }
                      >
                        {item.daysLeft} Days Left
                      </div>

                    ) : (

                      <div
                        style={
                          styles.activeBadge
                        }
                      >
                        {item.daysLeft} Days Left
                      </div>
                    )}

                  </span>

                  <span>

                    <button

                      onClick={() =>
                        renewRental(item)
                      }

                      style={
                        styles.renewBtn
                      }
                    >
                      Renew
                    </button>

                  </span>

                </div>
              )
            )}

          </div>
        )}

      </div>

    </>
  );
}

// =========================
// STYLES
// =========================
const styles = {

  page: {

    minHeight: "100vh",

    background:
      "#f8fafc",

    padding: "40px",
  },

  heading: {

    textAlign: "center",

    marginBottom: "30px",

    color: "#1e293b",

    fontSize: "42px",
  },

  cardGrid: {

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(280px,1fr))",

    gap: "25px",

    marginBottom: "35px",
  },

  activeCard: {

    background:
      "linear-gradient(135deg,#dcfce7,#bbf7d0)",

    padding: "30px",

    borderRadius: "24px",

    textAlign: "center",

    boxShadow:
      "0 10px 20px rgba(0,0,0,0.08)",

    transition: "0.3s",

    cursor: "pointer",
  },

  warningCard: {

    background:
      "linear-gradient(135deg,#fef3c7,#fde68a)",

    padding: "30px",

    borderRadius: "24px",

    textAlign: "center",

    boxShadow:
      "0 10px 20px rgba(0,0,0,0.08)",

    transition: "0.3s",

    cursor: "pointer",
  },

  expiredCard: {

    background:
      "linear-gradient(135deg,#fee2e2,#fecaca)",

    padding: "30px",

    borderRadius: "24px",

    textAlign: "center",

    boxShadow:
      "0 10px 20px rgba(0,0,0,0.08)",

    transition: "0.3s",

    cursor: "pointer",
  },

  resetBtn: {

    background:
      "linear-gradient(135deg,#2563eb,#1d4ed8)",

    color: "white",

    border: "none",

    padding: "12px 24px",

    borderRadius: "10px",

    cursor: "pointer",

    fontWeight: "bold",
  },

  searchContainer: {

    display: "flex",

    justifyContent: "center",

    marginBottom: "30px",
  },

  searchInput: {

    width: "420px",

    padding: "14px 20px",

    borderRadius: "12px",

    border: "1px solid #cbd5e1",

    outline: "none",

    fontSize: "16px",
  },

  message: {

    textAlign: "center",

    marginTop: "60px",

    color: "#475569",
  },

  tableContainer: {

    background: "white",

    borderRadius: "24px",

    padding: "30px",

    overflowX: "auto",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
  },

  tableHead: {

    display: "grid",

    gridTemplateColumns:
      "1.3fr 1fr 1.3fr 1fr 1fr 1fr 1fr",

    fontWeight: "bold",

    paddingBottom: "20px",

    borderBottom:
      "2px solid #e2e8f0",

    minWidth: "1200px",
  },

  tableRow: {

    display: "grid",

    gridTemplateColumns:
      "1.3fr 1fr 1.3fr 1fr 1fr 1fr 1fr",

    padding: "20px 0",

    borderBottom:
      "1px solid #e2e8f0",

    alignItems: "center",

    minWidth: "1200px",
  },

  activeBadge: {

    background: "#dcfce7",

    color: "#166534",

    padding: "8px 12px",

    borderRadius: "999px",

    width: "fit-content",

    fontWeight: "bold",
  },

  warningBadge: {

    background: "#fef3c7",

    color: "#92400e",

    padding: "8px 12px",

    borderRadius: "999px",

    width: "fit-content",

    fontWeight: "bold",
  },

  expiredBadge: {

    background: "#fee2e2",

    color: "#991b1b",

    padding: "8px 12px",

    borderRadius: "999px",

    width: "fit-content",

    fontWeight: "bold",
  },

  renewBtn: {

    background:
      "linear-gradient(135deg,#2563eb,#1d4ed8)",

    color: "white",

    border: "none",

    padding: "10px 18px",

    borderRadius: "10px",

    cursor: "pointer",

    fontWeight: "bold",
  },
};

export default ActiveRentals;