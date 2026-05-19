import { useNavigate } from "react-router-dom";

import bg from "../assets/new.jpg";

function Home() {

  const navigate =
    useNavigate();

  return (

    <div style={styles.page}>

      {/* HERO SECTION */}
      <div
        style={{
          ...styles.hero,

          backgroundImage:
            `url(${bg})`,
        }}
      >

        {/* OVERLAY */}
        <div
          style={styles.overlay}
        ></div>

        {/* CONTENT */}
        <div
          style={styles.content}
        >

          <h1 style={styles.heading}>
            Welcome to RentEase
          </h1>

          <p style={styles.subHeading}>

            Experience hassle-free
            living with premium
            furniture and appliance
            rentals at affordable
            monthly prices.

          </p>

          {/* BUTTONS */}
          <div
            style={styles.buttonRow}
          >

            <button

              onClick={() =>
                navigate(
                  "/products"
                )
              }

              style={
                styles.primaryBtn
              }
            >
              Explore Rentals
            </button>

            <button

              onClick={() =>
                navigate(
                  "/login"
                )
              }

              style={
                styles.secondaryBtn
              }
            >
              Get Started
            </button>

          </div>

        </div>

      </div>

      {/* FEATURES */}
      <div style={styles.featuresSection}>

        <h2 style={styles.featureHeading}>
          Why Choose RentEase?
        </h2>

        <div style={styles.featuresGrid}>

          {/* FEATURE 1 */}
          <div style={styles.featureCard}>

            <div style={styles.icon}>
              🛋️
            </div>

            <h3>
              Premium Rentals
            </h3>

            <p>
              High-quality furniture
              and appliances for
              modern living.
            </p>

          </div>

          {/* FEATURE 2 */}
          <div style={styles.featureCard}>

            <div style={styles.icon}>
              💰
            </div>

            <h3>
              Affordable Pricing
            </h3>

            <p>
              Flexible monthly rental
              plans with low upfront
              costs.
            </p>

          </div>

          {/* FEATURE 3 */}
          <div style={styles.featureCard}>

            <div style={styles.icon}>
              🚚
            </div>

            <h3>
              Fast Delivery
            </h3>

            <p>
              Quick doorstep delivery
              and hassle-free pickup
              services.
            </p>

          </div>

          {/* FEATURE 4 */}
          <div style={styles.featureCard}>

            <div style={styles.icon}>
              🔧
            </div>

            <h3>
              Maintenance Support
            </h3>

            <p>
              Dedicated maintenance
              support throughout your
              rental period.
            </p>

          </div>

        </div>

      </div>

      {/* CTA SECTION */}
      <div style={styles.ctaSection}>

        <h2 style={styles.ctaHeading}>
          Ready to Upgrade Your
          Lifestyle?
        </h2>

        <p style={styles.ctaText}>
          Browse our premium rental
          collection today.
        </p>

        <button

          onClick={() =>
            navigate(
              "/products"
            )
          }

          style={styles.ctaBtn}
        >
          Start Renting
        </button>

      </div>

    </div>
  );
}

const styles = {

  page: {

    background:
      "#f8fafc",
  },

  hero: {

    minHeight:
      "100vh",

    backgroundSize:
      "cover",

    backgroundPosition:
      "center",

    position:
      "relative",

    display:
      "flex",

    justifyContent:
      "center",

    alignItems:
      "center",

    padding:
      "20px",
  },

  overlay: {

    position:
      "absolute",

    top: 0,

    left: 0,

    width: "100%",

    height: "100%",

    background:
      "rgba(0,0,0,0.45)",
  },

  content: {

    position:
      "relative",

    zIndex: 1,

    textAlign:
      "center",

    color:
      "white",

    maxWidth:
      "900px",
  },

  heading: {

    fontSize:
      "clamp(42px,8vw,82px)",

    fontWeight:
      "bold",

    marginBottom:
      "25px",

    textShadow:
      "2px 2px 15px rgba(0,0,0,0.5)",
  },

  subHeading: {

    fontSize:
      "clamp(18px,3vw,24px)",

    lineHeight:
      "1.8",

    marginBottom:
      "40px",

    textShadow:
      "1px 1px 10px rgba(0,0,0,0.4)",
  },

  buttonRow: {

    display:
      "flex",

    justifyContent:
      "center",

    gap:
      "20px",

    flexWrap:
      "wrap",
  },

  primaryBtn: {

    padding:
      "16px 34px",

    border:
      "none",

    borderRadius:
      "14px",

    background:
      "linear-gradient(135deg,#2563eb,#1d4ed8)",

    color:
      "white",

    fontWeight:
      "bold",

    cursor:
      "pointer",

    fontSize:
      "17px",

    boxShadow:
      "0 8px 20px rgba(0,0,0,0.3)",
  },

  secondaryBtn: {

    padding:
      "16px 34px",

    border:
      "2px solid white",

    borderRadius:
      "14px",

    background:
      "transparent",

    color:
      "white",

    fontWeight:
      "bold",

    cursor:
      "pointer",

    fontSize:
      "17px",
  },

  featuresSection: {

    padding:
      "80px 30px",
  },

  featureHeading: {

    textAlign:
      "center",

    fontSize:
      "clamp(34px,5vw,52px)",

    marginBottom:
      "50px",

    color:
      "#1e293b",
  },

  featuresGrid: {

    display:
      "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(250px,1fr))",

    gap:
      "30px",
  },

  featureCard: {

    background:
      "white",

    padding:
      "35px",

    borderRadius:
      "24px",

    textAlign:
      "center",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
  },

  icon: {

    fontSize:
      "55px",

    marginBottom:
      "20px",
  },

  ctaSection: {

    background:
      "linear-gradient(135deg,#2563eb,#1d4ed8)",

    color:
      "white",

    textAlign:
      "center",

    padding:
      "80px 30px",
  },

  ctaHeading: {

    fontSize:
      "clamp(36px,6vw,58px)",

    marginBottom:
      "20px",
  },

  ctaText: {

    fontSize:
      "20px",

    marginBottom:
      "35px",
  },

  ctaBtn: {

    padding:
      "18px 38px",

    border:
      "none",

    borderRadius:
      "14px",

    background:
      "white",

    color:
      "#2563eb",

    fontWeight:
      "bold",

    cursor:
      "pointer",

    fontSize:
      "18px",
  },
};

export default Home;