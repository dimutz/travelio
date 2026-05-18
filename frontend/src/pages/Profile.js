import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./Profile.css"; // --- IMPORTĂM NOUL CSS ---

function bookingStatusLabel(status) {
  if (status === "confirmata") return "Confirmed";
  if (status === "asteptare") return "Pending";
  if (status === "anulata") return "Cancelled";
  if (status === "finalizata") return "Completed";
  return status || "—";
}

function guestBookingDisplay(booking) {
  if (booking.checked_out_at || booking.status === "finalizata") {
    return "Completed";
  }
  if (booking.checked_in_at) {
    return "Checked in";
  }
  return bookingStatusLabel(booking.status);
}

function canGuestCancel(booking) {
  if (booking.checked_in_at) return false;
  if (booking.status === "anulata" || booking.status === "finalizata") return false;
  return true;
}

function statusBadgeStyle(booking) {
  if (booking.status === "anulata") {
    return { backgroundColor: "#fee2e2", color: "#991b1b" };
  }
  if (booking.checked_out_at || booking.status === "finalizata") {
    return { backgroundColor: "#dcfce7", color: "#166534" };
  }
  if (booking.checked_in_at) {
    return { backgroundColor: "#dbeafe", color: "#1e40af" };
  }
  if (booking.status === "confirmata") {
    return { backgroundColor: "#dcfce7", color: "#166534" };
  }
  return { backgroundColor: "#fef9c3", color: "#854d0e" };
}

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const meRes = await api.get("auth/me/");
        if (cancelled) return;
        setProfile(meRes.data);

        const role = meRes.data?.role;
        if (role === "client") {
          const bookingsRes = await api.get("bookings/my-bookings/");
          if (cancelled) return;
          setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
        } else {
          setBookings([]);
        }
      } catch (e) {
        console.error("Profile load error:", e);
        if (!cancelled) {
          setProfile(null);
          setBookings([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const username = profile?.username || localStorage.getItem("username") || "User";
  const showBookings = profile?.role === "client";

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;
    setCancelId(bookingId);
    try {
      const res = await api.post(`bookings/${bookingId}/cancel/`);
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, ...res.data } : b)));
    } catch (e) {
      alert(e?.response?.data?.detail || "Could not cancel this booking.");
    } finally {
      setCancelId(null);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-wrapper">

        {/* --- HEADER --- */}
        <div className="profile-header">
          <Link to="/home" className="profile-back-link">
            ← Back to home
          </Link>
          <div className="profile-user-circle">{username[0]?.toUpperCase() || "?"}</div>
          <h1 className="profile-title">Hello, {username}!</h1>
          <p className="profile-subtitle">
            {showBookings ? "Your account and bookings" : "Your account"}
          </p>
        </div>

        {/* --- GRID CONTINUT --- */}
        <div className={`profile-grid ${!showBookings ? "profile-grid-single" : ""}`}>

          {showBookings ? (
            <div className="profile-glass-card">
              <h2 className="profile-section-title">My bookings</h2>
              {loading ? (
                <p>Loading…</p>
              ) : bookings.length === 0 ? (
                <div className="profile-empty">
                  <p>You have no bookings yet.</p>
                  <Link to="/home" className="btn-primary" style={{ marginTop: "15px" }}>
                    Search stays
                  </Link>
                </div>
              ) : (
                <div className="profile-booking-list">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="profile-booking-card">
                      <div style={{ flex: "1 1 220px" }}>
                        <h3 className="profile-property-title">{booking.property_name}</h3>
                        <p className="profile-detail">
                          <strong>Dates:</strong> {booking.start_date} → {booking.end_date}
                        </p>
                        <p className="profile-detail">
                          <strong>Total:</strong> {booking.total_price}
                        </p>
                        {(booking.checked_in_at || booking.checked_out_at) && (
                          <p className="profile-detail-muted">
                            {booking.checked_in_at ? (
                              <>
                                <strong>Checked in:</strong>{" "}
                                {new Date(booking.checked_in_at).toLocaleString()}
                              </>
                            ) : null}
                            {booking.checked_in_at && booking.checked_out_at ? " · " : null}
                            {booking.checked_out_at ? (
                              <>
                                <strong>Checked out:</strong>{" "}
                                {new Date(booking.checked_out_at).toLocaleString()}
                              </>
                            ) : null}
                          </p>
                        )}
                        {canGuestCancel(booking) && (
                          <button
                            type="button"
                            className="btn-cancel"
                            disabled={cancelId !== null}
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            {cancelId === booking.id ? "Cancelling…" : "Cancel booking"}
                          </button>
                        )}
                      </div>

                      {/* Păstrăm funcția de culoare inline pentru statusurile dinamice */}
                      <div
                        className="profile-status-badge"
                        style={statusBadgeStyle(booking)}
                      >
                        {guestBookingDisplay(booking)}
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {/* --- SIDEBAR CONT --- */}
          <div className="profile-glass-card">
            <h2 className="profile-section-title">Account</h2>
            {loading && !showBookings ? (
              <p>Loading…</p>
            ) : (
              <div>
                <p className="profile-detail">
                  <strong>Username:</strong> {username}
                </p>
                {profile?.email && (
                  <p className="profile-detail">
                    <strong>Email:</strong> {profile.email}
                  </p>
                )}
                {profile?.role && (
                  <p className="profile-detail">
                    <strong>Role:</strong> <span style={{ textTransform: "capitalize" }}>{profile.role}</span>
                  </p>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;