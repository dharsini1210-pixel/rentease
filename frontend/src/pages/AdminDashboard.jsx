import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";

import AdminNavbar from "../components/AdminNavbar";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

// =========================
// API URL
// =========================
const API_URL =
  "https://rentease-baackend.onrender.com";

function AdminDashboard() {

  const navigate =
    useNavigate();

  const adminInfo =
    JSON.parse(
      localStorage.getItem(
        "adminInfo"
      )
    );

  // =========================
  // STATES
  // =========================
  const [stats, setStats] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  const [
    monthlyStatement,
    setMonthlyStatement
  ] = useState({});

  const [
    dailyCustomers,
    setDailyCustomers
  ] = useState([]);

  const [
    topProducts,
    setTopProducts
  ] = useState([]);

  const [
    regularCustomers,
    setRegularCustomers
  ] = useState([]);

  const [
    customerKeyword,
    setCustomerKeyword
  ] = useState("");

  const [
    searchedOrders,
    setSearchedOrders
  ] = useState([]);

  // =========================
  // CHART DATA
  // =========================
  const revenueChartData =
    Object.entries(
      monthlyStatement
    ).map(([month, data]) => ({
      month,
      revenue: data.revenue,
    }));

  const productChartData =
    topProducts.map((p) => ({
      name: p[0],
      rentals: p[1],
    }));

  const COLORS = [
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#dc2626",
    "#9333ea",
  ];

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {

    if (!adminInfo) {

      navigate(
        "/admin-login"
      );

      return;
    }

    fetchDashboard();

    fetchMonthlyStatement();

    fetchDailyCustomers();

    fetchTopProducts();

    fetchRegularCustomers();

  }, []);

  // =========================
  // FETCH DASHBOARD
  // =========================
  const fetchDashboard =
    async () => {

      try {

        const config = {

          headers: {

            Authorization:
              `Bearer ${adminInfo.token}`,
          },
        };

        const res =
          await axios.get(

            `${API_URL}/api/admin/dashboard-stats`,

            config
          );

        setStats(res.data);

        setLoading(false);

      } catch (error) {

        console.log(error);

        setLoading(false);
      }
    };

  // =========================
  // MONTHLY STATEMENT
  // =========================
  const fetchMonthlyStatement =
    async () => {

      try {

        const config = {

          headers: {

            Authorization:
              `Bearer ${adminInfo.token}`,
          },
        };

        const res =
          await axios.get(

            `${API_URL}/api/orders/admin/monthly-statement`,

            config
          );

        setMonthlyStatement(
          res.data
        );

      } catch (error) {

        console.log(error);
      }
    };

  // =========================
  // DAILY CUSTOMERS
  // =========================
  const fetchDailyCustomers =
    async () => {

      try {

        const config = {

          headers: {

            Authorization:
              `Bearer ${adminInfo.token}`,
          },
        };

        const res =
          await axios.get(

            `${API_URL}/api/orders/admin/daily-customers`,

            config
          );

        setDailyCustomers(
          res.data
        );

      } catch (error) {

        console.log(error);
      }
    };

  // =========================
  // TOP PRODUCTS
  // =========================
  const fetchTopProducts =
    async () => {

      try {

        const config = {

          headers: {

            Authorization:
              `Bearer ${adminInfo.token}`,
          },
        };

        const res =
          await axios.get(

            `${API_URL}/api/orders/admin/top-products`,

            config
          );

        setTopProducts(
          res.data
        );

      } catch (error) {

        console.log(error);
      }
    };

  // =========================
  // REGULAR CUSTOMERS
  // =========================
  const fetchRegularCustomers =
    async () => {

      try {

        const config = {

          headers: {

            Authorization:
              `Bearer ${adminInfo.token}`,
          },
        };

        const res =
          await axios.get(

            `${API_URL}/api/orders/admin/regular-customers`,

            config
          );

        setRegularCustomers(
          res.data
        );

      } catch (error) {

        console.log(error);
      }
    };

  // =========================
  // SEARCH CUSTOMER
  // =========================
  const searchCustomer =
    async () => {

      try {

        const config = {

          headers: {

            Authorization:
              `Bearer ${adminInfo.token}`,
          },
        };

        const res =
          await axios.get(

            `${API_URL}/api/orders/admin/customer-search?keyword=${customerKeyword}`,

            config
          );

        setSearchedOrders(
          res.data
        );

      } catch (error) {

        console.log(error);
      }
    };

  // =========================
  // LOADING
  // =========================
  if (loading) {

    return (

      <>
        <AdminNavbar />

        <div style={styles.loading}>
          Loading...
        </div>
      </>
    );
  }

  return (

    <>

      <AdminNavbar />

      <div style={styles.page}>

        {/* HEADER */}
        <div style={styles.header}>

          <h1 style={styles.heading}>
            RentEase Business Dashboard 🚀
          </h1>

          <p style={styles.subHeading}>
            Enterprise Rental Analytics Platform
          </p>

        </div>

        {/* MAIN STATS */}
        <div style={styles.grid}>

          <DashboardCard
            title="Total Users"
            value={stats.totalUsers}
          />

          <DashboardCard
            title="Total Products"
            value={stats.totalProducts}
          />

          <DashboardCard
            title="Total Orders"
            value={stats.totalOrders}
          />

          <DashboardCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue}`}
          />

          <DashboardCard
            title="Pending Deliveries"
            value={stats.pendingDeliveries}
          />

          <DashboardCard
            title="Maintenance Requests"
            value={stats.maintenanceRequests}
          />

        </div>

        {/* SEARCH */}
        <div style={styles.analyticsCard}>

          <h2>
            🔍 Search Customer Orders
          </h2>

          <div style={styles.searchRow}>

            <input
              type="text"
              placeholder="Enter customer name"
              value={customerKeyword}
              onChange={(e) =>
                setCustomerKeyword(
                  e.target.value
                )
              }
              style={styles.searchInput}
            />

            <button
              onClick={searchCustomer}
              style={styles.searchBtn}
            >
              Search
            </button>

          </div>

          <div style={styles.analyticsGrid}>

            {searchedOrders.length === 0 ? (

              <div style={styles.noData}>
                No Customer Orders Found
              </div>

            ) : (

              searchedOrders

                .sort(
                  (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
                )

                .map((order) => {

                  const deliveryDate =
                    new Date(
                      order.deliveryDate
                    );

                  const expiryDate =
                    new Date(
                      deliveryDate
                    );

                  expiryDate.setMonth(
                    expiryDate.getMonth() +
                      Number(
                        order.rentalDuration || 1
                      )
                  );

                  return (

                    <div
                      key={order._id}
                      style={styles.analyticsBox}
                    >

                      <h2>
                        👤 {
                          order.customerName ||
                          order.user?.name
                        }
                      </h2>

                      <p>
                        📅 Order Date:
                        {" "}
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString()}
                      </p>

                      <p>
                        🚚 Delivery:
                        {" "}
                        {deliveryDate.toLocaleDateString()}
                      </p>

                      <p>
                        ⏳ Expiry:
                        {" "}
                        {expiryDate.toLocaleDateString()}
                      </p>

                      <p>
                        🗓 Duration:
                        {" "}
                        {
                          order.rentalDuration
                        } Month(s)
                      </p>

                      <p>
                        💳 Payment:
                        {" "}
                        {
                          order.paymentStatus
                        }
                      </p>

                      <p>
                        📦 Status:
                        {" "}
                        {order.status}
                      </p>

                      <p>
                        💰 Amount:
                        ₹{
                          order.totalAmount
                        }
                      </p>

                    </div>
                  );
                })
            )}

          </div>

        </div>

        {/* ANALYTICS */}
        <div style={styles.analyticsGrid}>

          {/* REGULAR CUSTOMERS */}
          <div style={styles.analyticsBox}>

            <h2>
              ⭐ Regular Customers
            </h2>

            <h1>
              {
                regularCustomers.length
              }
            </h1>

            {regularCustomers.map(
              (
                customer,
                index
              ) => (

                <div
                  key={index}
                  style={styles.detailCard}
                >

                  <strong>
                    {customer.name}
                  </strong>

                  <p>
                    Orders:
                    {" "}
                    {
                      customer.orders
                    }
                  </p>

                  <p>
                    ₹
                    {
                      customer.totalSpent
                    }
                  </p>

                </div>
              )
            )}

          </div>

          {/* TOP PRODUCTS */}
          <div style={styles.analyticsBox}>

            <h2>
              🔥 Top Products
            </h2>

            <h1>
              {
                topProducts.length
              }
            </h1>

            {topProducts.map(
              (
                product,
                index
              ) => (

                <div
                  key={index}
                  style={styles.detailCard}
                >

                  <strong>
                    {product[0]}
                  </strong>

                  <p>
                    Rentals:
                    {" "}
                    {product[1]}
                  </p>

                </div>
              )
            )}

          </div>

          {/* TODAY CUSTOMERS */}
          <div style={styles.analyticsBox}>

            <h2>
              📅 Today's Customers
            </h2>

            <h1>
              {
                dailyCustomers.length
              }
            </h1>

            {dailyCustomers.map(
              (
                customer,
                index
              ) => (

                <div
                  key={index}
                  style={styles.detailCard}
                >

                  <strong>
                    {
                      customer.customerName ||
                      customer.user?.name
                    }
                  </strong>

                  <p>
                    ₹
                    {
                      customer.totalAmount
                    }
                  </p>

                </div>
              )
            )}

          </div>

          {/* MONTHLY REVENUE */}
          <div style={styles.analyticsBox}>

            <h2>
              📈 Monthly Revenue
            </h2>

            <h1>
              {
                Object.keys(
                  monthlyStatement
                ).length
              }
            </h1>

            {Object.entries(
              monthlyStatement
            ).map(
              (
                [month, data],
                index
              ) => (

                <div
                  key={index}
                  style={styles.detailCard}
                >

                  <strong>
                    {month}
                  </strong>

                  <p>
                    Revenue:
                    ₹
                    {
                      data.revenue
                    }
                  </p>

                  <p>
                    Orders:
                    {
                      data.orders
                    }
                  </p>

                </div>
              )
            )}

          </div>

        </div>

        {/* CHARTS */}
        <div style={styles.chartGrid}>

          {/* BAR CHART */}
          <div style={styles.chartCard}>

            <h2>
              📈 Monthly Revenue Chart
            </h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <BarChart
                data={
                  revenueChartData
                }
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="month"
                />

                <YAxis />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="revenue"
                  fill="#2563eb"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

          {/* PIE CHART */}
          <div style={styles.chartCard}>

            <h2>
              🥧 Top Product Rentals
            </h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <PieChart>

                <Pie
                  data={
                    productChartData
                  }
                  dataKey="rentals"
                  nameKey="name"
                  outerRadius={100}
                  label
                >

                  {productChartData.map(
                    (
                      entry,
                      index
                    ) => (

                      <Cell
                        key={index}
                        fill={
                          COLORS[
                            index %
                              COLORS.length
                          ]
                        }
                      />

                    )
                  )}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

    </>
  );
}

function DashboardCard({
  title,
  value,
}) {

  return (

    <div style={styles.card}>

      <h2>{title}</h2>

      <p style={styles.number}>
        {value}
      </p>

    </div>
  );
}

const styles = {

  page: {

    minHeight: "100vh",

    background:
      "linear-gradient(to right,#eef2ff,#f8fafc)",

    padding: "40px",
  },

  loading: {

    textAlign: "center",

    marginTop: "120px",

    fontSize: "40px",
  },

  header: {

    textAlign: "center",

    marginBottom: "40px",
  },

  heading: {

    fontSize: "52px",

    color: "#1e293b",
  },

  subHeading: {

    color: "#64748b",

    fontSize: "20px",
  },

  grid: {

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(260px,1fr))",

    gap: "25px",

    marginBottom: "40px",
  },

  card: {

    background: "white",

    padding: "35px",

    borderRadius: "24px",

    textAlign: "center",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
  },

  number: {

    fontSize: "42px",

    fontWeight: "bold",

    color: "#2563eb",

    marginTop: "15px",
  },

  analyticsCard: {

    background: "white",

    padding: "30px",

    borderRadius: "24px",

    marginBottom: "35px",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
  },

  searchRow: {

    display: "flex",

    gap: "15px",

    marginTop: "20px",

    marginBottom: "20px",
  },

  searchInput: {

    padding: "14px",

    borderRadius: "12px",

    border:
      "1px solid #cbd5e1",

    width: "300px",
  },

  searchBtn: {

    padding:
      "14px 25px",

    border: "none",

    borderRadius: "12px",

    background:
      "#2563eb",

    color: "white",

    cursor: "pointer",

    fontWeight: "bold",
  },

  analyticsGrid: {

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(320px,1fr))",

    gap: "25px",
  },

  analyticsBox: {

    background: "white",

    borderRadius: "24px",

    padding: "25px",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",

    maxHeight: "450px",

    overflowY: "auto",
  },

  detailCard: {

    background:
      "#f8fafc",

    padding: "15px",

    borderRadius: "12px",

    marginTop: "15px",

    border:
      "1px solid #e2e8f0",

    lineHeight: "1.8",
  },

  chartGrid: {

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(500px,1fr))",

    gap: "30px",

    marginTop: "40px",
  },

  chartCard: {

    background: "white",

    padding: "25px",

    borderRadius: "24px",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
  },

  noData: {

    background: "#f8fafc",

    padding: "40px",

    borderRadius: "18px",

    textAlign: "center",

    fontWeight: "bold",

    color: "#64748b",
  },
};

export default AdminDashboard;