import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {

  // =========================
  // GET ADMIN INFO
  // =========================
  const adminInfoString =
    localStorage.getItem(
      "adminInfo"
    );

  // =========================
  // NO ADMIN INFO
  // =========================
  if (!adminInfoString) {

    return (
      <Navigate
        to="/admin-login"
        replace
      />
    );
  }

  // =========================
  // PARSE ADMIN INFO
  // =========================
  const adminInfo =
    JSON.parse(adminInfoString);

  // =========================
  // CHECK ROLE
  // =========================
  if (
    adminInfo.role !==
    "admin"
  ) {

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  // =========================
  // ALLOW ACCESS
  // =========================
  return children;
}

export default AdminRoute;