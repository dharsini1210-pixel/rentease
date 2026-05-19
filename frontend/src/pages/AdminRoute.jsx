import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {

  // =========================
  // GET ADMIN INFO
  // =========================
  const adminInfo =
    localStorage.getItem(
      "adminInfo"
    )

      ? JSON.parse(
          localStorage.getItem(
            "adminInfo"
          )
        )

      : null;

  // =========================
  // NOT LOGGED IN
  // =========================
  if (!adminInfo) {

    return (
      <Navigate
        to="/admin-login"
        replace
      />
    );
  }

  // =========================
  // NOT ADMIN
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