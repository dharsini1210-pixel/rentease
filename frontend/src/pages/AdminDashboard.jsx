import {
  useEffect,
  useState
} from "react";

import axios from "axios";

import AdminNavbar from "../components/AdminNavbar";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function AdminDashboard() {

  const [stats, setStats] = useState({

    totalUsers: 0,

    totalProducts: 0,

    totalOrders: 0,

    totalRevenue: 0,

    pendingDeliveries: 0,

    maintenanceRequests: 0,

    pickupRequests: 0,
  });

  const adminInfo = JSON.parse(
    localStorage.getItem("adminInfo")
  );

  // =========================
  // FETCH DASHBOARD STATS
  // =========================
  useEffect(() => {

    fetchStats();

  }, []);

  const fetchStats = async () => {

    try {

      const config = {

        headers: {

          Authorization:
            `Bearer ${adminInfo.token}`,
        },
      };

      // =========================
      // DASHBOARD STATS
      // =========================
      const res = await axios.get(

        "http://localhost:5000/api/admin/dashboard-stats",

        config
      );

      // =========================
      // GET ORDERS
      // =========================
      const orderRes = await axios.get(

        "http://localhost:5000/api/orders",

        config
      );

      // =========================
      // PICKUP COUNT
      // =========================
      const pickupRequests =
        orderRes.data.filter(

          (order) =>

            order.pickupStatus ===
              "Requested" ||

            order.pickupStatus ===
              "Pickup Scheduled"

        ).length;

      setStats({

        ...res.data,

        pickupRequests,
      });

    } catch (error) {

      console.log(error);
    }
  };

  // =========================
  // BAR CHART DATA
  // =========================
  const barData = [

    {
      name: "Users",
      value: stats.totalUsers,
    },

    {
      name: "Products",
      value: stats.totalProducts,
    },

    {
      name: "Orders",
      value: stats.totalOrders,
    },

    {
      name: "Maintenance",
      value:
        stats.maintenanceRequests,
    },

    {
      name: "Pickup",
      value:
        stats.pickupRequests,
    },
  ];

  // =========================
  // PIE CHART DATA
  // =========================
  const pieData = [

    {
      name: "Revenue",
      value: stats.totalRevenue,
    },

    {
      name: "Pending Deliveries",
      value:
        stats.pendingDeliveries,
    },
  ];

  const COLORS = [
    "#2563eb",
    "#10b981",
  ];

  return (

    <>

      {/* NAVBAR */}
      <AdminNavbar />

      <div style={styles.page}>

        {/* HEADER */}
        <div style={styles.header}>

          <h1 style={styles.heading}>
            Admin Analytics Dashboard 📊
          </h1>

          <p style={styles.subHeading}>
            Monitor platform performance
          </p>

        </div>

        {/* STATS GRID */}
        <div style={styles.grid}>

          <div style={styles.card}>
            <h2>Total Users</h2>

            <p style={styles.number}>
              {stats.totalUsers}
            </p>
          </div>

          <div style={styles.card}>
            <h2>Total Products</h2>

            <p style={styles.number}>
              {stats.totalProducts}
            </p>
          </div>

          <div style={styles.card}>
            <h2>Total Orders</h2>

            <p style={styles.number}>
              {stats.totalOrders}
            </p>
          </div>

          <div style={styles.card}>
            <h2>Total Revenue</h2>

            <p style={styles.number}>
              ₹{stats.totalRevenue}
            </p>
          </div>

          <div style={styles.card}>
            <h2>Pending Deliveries</h2>

            <p style={styles.number}>
              {stats.pendingDeliveries}
            </p>
          </div>

          <div style={styles.card}>
            <h2>Maintenance Requests</h2>

            <p style={styles.number}>
              {
                stats.maintenanceRequests
              }
            </p>
          </div>

          {/* PICKUP REQUEST CARD */}
          <div
            style={{
              ...styles.card,

              background:
                "linear-gradient(135deg,#fff7ed,#ffedd5)",

              border:
                "2px solid #f97316",
            }}
          >

            <h2>
              📦 Pickup Requests
            </h2>

            <p
              style={{
                ...styles.number,

                color: "#ea580c",
              }}
            >
              {
                stats.pickupRequests
              }
            </p>

          </div>

        </div>

        {/* CHARTS */}
        <div style={styles.chartGrid}>

          {/* BAR CHART */}
          <div style={styles.chartCard}>

            <h2 style={styles.chartTitle}>
              Platform Overview
            </h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <BarChart data={barData}>

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="value"
                  fill="#2563eb"
                  radius={[8, 8, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

          {/* PIE CHART */}
          <div style={styles.chartCard}>

            <h2 style={styles.chartTitle}>
              Revenue & Deliveries
            </h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <PieChart>

                <Pie

                  data={pieData}

                  cx="50%"

                  cy="50%"

                  outerRadius={100}

                  dataKey="value"

                  label
                >

                  {pieData.map(
                    (entry, index) => (

                      <Cell
                        key={index}
                        fill={
                          COLORS[index]
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

const styles = {

  page: {

    minHeight: "100vh",

    background:
      "linear-gradient(to right,#eef2ff,#f8fafc)",

    padding: "40px",
  },

  header: {

    textAlign: "center",

    marginBottom: "50px",
  },

  heading: {

    fontSize: "52px",

    color: "#1e293b",

    marginBottom: "10px",
  },

  subHeading: {

    color: "#64748b",

    fontSize: "20px",
  },

  grid: {

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(260px,1fr))",

    gap: "30px",

    marginBottom: "50px",
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

    marginTop: "20px",
  },

  chartGrid: {

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(400px,1fr))",

    gap: "30px",
  },

  chartCard: {

    background: "white",

    padding: "30px",

    borderRadius: "24px",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
  },

  chartTitle: {

    textAlign: "center",

    marginBottom: "20px",

    color: "#1e293b",
  },
};

export default AdminDashboard;