import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

  const userInfo =
    localStorage.getItem("userInfo")

      ? JSON.parse(
          localStorage.getItem(
            "userInfo"
          )
        )

      : null;

  // USER NOT LOGGED IN

  if (!userInfo) {

    return (
      <Navigate to="/login" />
    );
  }

  return children;
}

export default ProtectedRoute;