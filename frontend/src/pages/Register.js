import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "client",
  });
  const navigate = useNavigate();

  const register = async () => {
    await api.post("auth/register/", form);

    navigate("/login");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Create account</h2>
        <p className="auth-subtitle">Choose your role and start using Travelio.</p>

        <input
          className="auth-input"
          placeholder="Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input className="auth-input" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input
          className="auth-input"
          placeholder="Password"
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <label className="auth-label" htmlFor="role">
          Role
        </label>
        <select
          id="role"
          className="auth-input"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="client">Client</option>
          <option value="owner">Owner</option>
          <option value="receptionist">Receptionist</option>
        </select>

        <button type="button" className="auth-button" onClick={register}>
          Register
        </button>

        <p className="auth-footnote">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
