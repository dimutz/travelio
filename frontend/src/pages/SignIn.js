import { Link } from "react-router-dom";

export default function SignIn() {
  return (
    <div className="signin-page">
      <div className="signin-card">
        <h1 className="signin-title">Welcome to Travelio</h1>
        <p className="signin-subtitle">Sign in to search properties, save time, and manage your stays.</p>

        <div className="signin-actions">
          <Link to="/login" className="signin-btn signin-btn-primary">
            Login
          </Link>
          <Link to="/register" className="signin-btn signin-btn-secondary">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
