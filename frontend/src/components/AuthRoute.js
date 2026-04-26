import { Navigate } from "react-router-dom";

export default function AuthRoute({ children }) {
  const accessToken = localStorage.getItem("access");

  if (accessToken) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
