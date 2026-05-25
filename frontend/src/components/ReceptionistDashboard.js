import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import './ReceptionistDashboard.css';

const ROOM_STATUSES = [
  { value: "available", label: "Available" },
  { value: "unavailable", label: "Unavailable" },
  { value: "maintenance", label: "Maintenance" },
];

function bookingStatusLabel(status) {
  if (status === "confirmata") return "Confirmed";
  if (status === "asteptare") return "Pending";
  if (status === "anulata") return "Cancelled";
  if (status === "finalizata") return "Completed";
  return status || "—";
}

export default function ReceptionistDashboard({ profile }) {
  const [receptionBookings, setReceptionBookings] = useState([]);
  const [receptionRooms, setReceptionRooms] = useState([]);
  const [receptionLoading, setReceptionLoading] = useState(false);
  const [bookingActionId, setBookingActionId] = useState(null);
  const [roomSavingId, setRoomSavingId] = useState(null);

  const loadReceptionDesk = useCallback(async () => {
    const propId = profile?.assigned_property?.id;
    if (!propId) return;
    setReceptionLoading(true);
    try {
      const [bRes, rRes] = await Promise.all([
        api.get("bookings/reception/"),
        api.get(`listings/properties/${propId}/rooms/`),
      ]);
      setReceptionBookings(Array.isArray(bRes.data) ? bRes.data : []);
      setReceptionRooms(Array.isArray(rRes.data) ? rRes.data : []);
    } catch (e) {
      console.error(e);
      setReceptionBookings([]);
      setReceptionRooms([]);
    } finally {
      setReceptionLoading(false);
    }
  }, [profile?.assigned_property?.id]);

  useEffect(() => {
    if (profile?.assigned_property?.id) {
      loadReceptionDesk();
    }
  }, [profile, loadReceptionDesk]);

  // Handlers (confirm, check-in, check-out) rămân la fel...
  const handleBookingConfirm = async (bid) => {
    setBookingActionId(bid);
    try {
      await api.post(`bookings/${bid}/confirm/`);
      await loadReceptionDesk();
    } catch (e) {
      alert(e?.response?.data?.detail || "Could not confirm.");
    } finally {
      setBookingActionId(null);
    }
  };

  const handleBookingReject = async (bid) => {
    setBookingActionId(bid);
    try {
      await api.post(`bookings/${bid}/reject/`);
      await loadReceptionDesk();
    } catch (e) {
      alert(e?.response?.data?.detail || "Could not reject booking.");
    } finally {
      setBookingActionId(null);
    }
  };

  const setRoomAvailability = async (roomId, status) => {
    setRoomSavingId(roomId);
    try {
      await api.patch(`listings/rooms/${roomId}/`, { availability_status: status });
      await loadReceptionDesk();
    } catch (e) {
      alert(e?.response?.data?.detail || "Could not update room.");
    } finally {
      setRoomSavingId(null);
    }
  };

  if (!profile?.assigned_property) {
    return (
      <section className="reception-wrapper">
        <h2>Front desk</h2>
        <p>You are not assigned to a property yet.</p>
      </section>
    );
  }

  return (
    <section className="reception-wrapper">
      <h2 style={s.h2}>Front desk</h2>
      <p style={s.intro}>
        <strong>{profile.assigned_property.name}</strong> — {profile.assigned_property.city}, {profile.assigned_property.country}
      </p>

      {receptionLoading ? (
        <p>Loading…</p>
      ) : (
        <>
          <h3 style={s.h3}>Bookings</h3>
          <div className="scroll-container">
            <table className="styled-table">
              <thead>
                <tr>
                  <th style={s.th}>Guest</th>
                  <th style={s.th}>Room</th>
                  <th style={s.th}>Dates</th>
                  <th style={s.th}>Status</th>
                  <th style={s.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {receptionBookings.map((b) => (
                  <tr key={b.id}>
                    <td style={s.td}>{b.guest_username}</td>
                    <td style={s.td}>{b.room_label}</td>
                    <td style={s.td}>{b.check_in_date} → {b.check_out_date}</td>
                    <td style={s.td}>{bookingStatusLabel(b.booking_status)}</td>
                    <td style={s.td}>
                      {b.booking_status === "asteptare" && (
                        <>
                          <button
                            className="btn-confirm-pastel"
                            disabled={bookingActionId !== null}
                            onClick={() => handleBookingConfirm(b.id)}
                          >
                            Confirm
                          </button>
                          <button
                            className="btn-reject-pastel"
                            disabled={bookingActionId !== null}
                            onClick={() => handleBookingReject(b.id)}
                            style={{ marginLeft: "8px" }}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 style={{ ...s.h3, marginTop: "30px" }}>Rooms</h3>
          <div className="scroll-container">
            <table className="styled-table">
              <thead>
                <tr>
                  <th style={s.th}>Room</th>
                  <th style={s.th}>Capacity</th>
                  <th style={s.th}>Price</th>
                  <th style={s.th}>Status</th>
                  <th style={s.th}>Set status</th>
                </tr>
              </thead>
              <tbody>
                {receptionRooms.map((room) => (
                  <tr key={room.id}>
                    <td style={s.td}>{room.room_type}</td>
                    <td style={s.td}>{room.capacity}</td>
                    <td style={s.td}>{room.price_per_night}</td>
                    <td style={s.td}>{room.availability_status}</td>
                    <td style={s.td}>
                      <select
                        style={s.select}
                        value={room.availability_status}
                        onChange={(e) => setRoomAvailability(room.id, e.target.value)}
                      >
                        {ROOM_STATUSES.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

// Stilurile s păstrate pentru compatibilitate, dar curățate unde e cazul
const s = {
  h2: { fontSize: "24px", marginBottom: "16px", borderBottom: "2px solid #6b46c1", paddingBottom: "10px" },
  h3: { fontSize: "18px", fontWeight: "700", marginBottom: "10px" },
  intro: { fontSize: "16px", marginBottom: "20px", color: "#4b5563" },
  th: { textAlign: "left", padding: "12px", borderBottom: "2px solid #e5e7eb", color: "#374151" },
  td: { padding: "12px", borderBottom: "1px solid #f3f4f6" },
  select: { padding: "6px", borderRadius: "8px", border: "1px solid #d1d5db" }
};