import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import useOwnerProperty from "../hooks/useOwnerProperty";
import OwnerPageShell from "../components/OwnerPageShell";

const ROOM_STATUSES = [
  { value: "available", label: "Available" },
  { value: "unavailable", label: "Unavailable" },
  { value: "maintenance", label: "Maintenance" },
];

const emptyRoomForm = {
  room_type: "",
  capacity: 1,
  price_per_night: "",
  availability_status: "available",
  description: "",
};

function RoomFormFields({ form, onChange }) {
  const set = (patch) => onChange((f) => ({ ...f, ...patch }));
  return (
    <>
      <div style={styles.formGrid}>
        <input
          style={styles.input}
          placeholder="Room type"
          value={form.room_type}
          onChange={(e) => set({ room_type: e.target.value })}
        />
        <input
          style={styles.input}
          type="number"
          min={1}
          placeholder="Capacity"
          value={form.capacity}
          onChange={(e) => set({ capacity: parseInt(e.target.value, 10) || 1 })}
        />
        <input
          style={styles.input}
          type="number"
          step="0.01"
          placeholder="Price per night"
          value={form.price_per_night}
          onChange={(e) => set({ price_per_night: e.target.value })}
        />
        <select
          style={styles.input}
          value={form.availability_status}
          onChange={(e) => set({ availability_status: e.target.value })}
        >
          {ROOM_STATUSES.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <textarea
        style={{ ...styles.input, minHeight: "72px", marginTop: "10px" }}
        placeholder="Description (optional)"
        value={form.description}
        onChange={(e) => set({ description: e.target.value })}
      />
    </>
  );
}

export default function OwnerPropertyRooms() {
  const { property, loading, reload, propertyId } = useOwnerProperty();
  const [newRoom, setNewRoom] = useState(emptyRoomForm);
  const [roomSavingId, setRoomSavingId] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);
  const [editRoomForm, setEditRoomForm] = useState(emptyRoomForm);

  if (loading) {
    return (
      <OwnerPageShell>
        <p style={styles.muted}>Loading…</p>
      </OwnerPageShell>
    );
  }

  if (!property) return null;

  const handleAddRoom = async () => {
    if (!newRoom.room_type.trim() || !newRoom.price_per_night) {
      alert("Please enter room type and price per night.");
      return;
    }
    const price = parseFloat(newRoom.price_per_night);
    if (Number.isNaN(price) || price <= 0) {
      alert("Please enter a valid price.");
      return;
    }
    setRoomSavingId("new");
    try {
      await api.post(`listings/properties/${propertyId}/rooms/`, {
        room_type: newRoom.room_type.trim(),
        capacity: parseInt(newRoom.capacity, 10) || 1,
        price_per_night: price.toFixed(2),
        availability_status: newRoom.availability_status,
        description: newRoom.description?.trim() || "",
      });
      setNewRoom(emptyRoomForm);
      await reload();
    } catch (e) {
      console.error(e?.response?.data);
      alert("Could not add room.");
    } finally {
      setRoomSavingId(null);
    }
  };

  const startEditRoom = (room) => {
    setEditingRoom(room.id);
    setEditRoomForm({
      room_type: room.room_type,
      capacity: room.capacity,
      price_per_night: String(room.price_per_night),
      availability_status: room.availability_status,
      description: room.description || "",
    });
  };

  const cancelEditRoom = () => {
    setEditingRoom(null);
    setEditRoomForm(emptyRoomForm);
  };

  const saveEditRoom = async () => {
    if (!editingRoom) return;
    const price = parseFloat(editRoomForm.price_per_night);
    if (Number.isNaN(price) || price <= 0) {
      alert("Please enter a valid price.");
      return;
    }
    setRoomSavingId(editingRoom);
    try {
      await api.patch(`listings/rooms/${editingRoom}/`, {
        room_type: editRoomForm.room_type.trim(),
        capacity: parseInt(editRoomForm.capacity, 10) || 1,
        price_per_night: price.toFixed(2),
        availability_status: editRoomForm.availability_status,
        description: editRoomForm.description?.trim() || "",
      });
      cancelEditRoom();
      await reload();
    } catch {
      alert("Could not update room.");
    } finally {
      setRoomSavingId(null);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Delete this room?")) return;
    setRoomSavingId(roomId);
    try {
      await api.delete(`listings/rooms/${roomId}/`);
      if (editingRoom === roomId) cancelEditRoom();
      await reload();
    } catch {
      alert("Could not delete room.");
    } finally {
      setRoomSavingId(null);
    }
  };

  return (
    <OwnerPageShell>
      <Link to="/home" style={styles.backLink}>
        ← Back to your properties
      </Link>

      <header style={styles.header}>
        <h1 style={styles.title}>Rooms</h1>
        <p style={styles.subtitle}>
          {property.name} · {property.city}, {property.country}
        </p>
        <p style={styles.addr}>{property.address}</p>
      </header>

      {editingRoom ? (
        <section style={styles.panel}>
          <h2 style={styles.sectionTitle}>Edit room</h2>
          <RoomFormFields form={editRoomForm} onChange={setEditRoomForm} />
          <div style={styles.rowActions}>
            <button type="button" style={styles.secondaryBtn} onClick={cancelEditRoom}>
              Cancel
            </button>
            <button
              type="button"
              style={styles.primaryBtn}
              onClick={saveEditRoom}
              disabled={roomSavingId === editingRoom}
            >
              Save
            </button>
          </div>
        </section>
      ) : null}

      <section style={styles.panel}>
        <h2 style={styles.sectionTitle}>Existing rooms</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Room</th>
              <th style={styles.th}>Guests</th>
              <th style={styles.th}>Price / night</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(property.rooms || []).length === 0 ? (
              <tr>
                <td colSpan={5} style={styles.tdEmpty}>
                  No rooms yet. Add one below.
                </td>
              </tr>
            ) : (
              (property.rooms || []).map((room) => (
                <tr key={room.id}>
                  <td style={styles.td}>{room.room_type}</td>
                  <td style={styles.td}>{room.capacity}</td>
                  <td style={styles.td}>{room.price_per_night}</td>
                  <td style={styles.td}>{room.availability_status}</td>
                  <td style={styles.td}>
                    <button
                      type="button"
                      style={styles.linkBtn}
                      onClick={() => startEditRoom(room)}
                      disabled={roomSavingId !== null}
                    >
                      Edit
                    </button>
                    {" · "}
                    <button
                      type="button"
                      style={styles.dangerBtn}
                      onClick={() => handleDeleteRoom(room.id)}
                      disabled={roomSavingId !== null}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <section style={styles.panel}>
        <h2 style={styles.sectionTitle}>Add a room</h2>
        <RoomFormFields form={newRoom} onChange={setNewRoom} />
        <button
          type="button"
          style={{ ...styles.primaryBtn, marginTop: "12px" }}
          onClick={handleAddRoom}
          disabled={roomSavingId === "new"}
        >
          Add room
        </button>
      </section>
    </OwnerPageShell>
  );
}

const styles = {
  backLink: {
    display: "inline-block",
    marginBottom: "20px",
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "14px",
  },
  header: { marginBottom: "24px" },
  title: { fontSize: "28px", margin: "0 0 8px 0" },
  subtitle: { fontSize: "16px", color: "#4b5563", margin: "0 0 4px 0" },
  addr: { fontSize: "14px", color: "#6b7280", margin: 0 },
  panel: {
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "16px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  },
  sectionTitle: { fontSize: "17px", margin: "0 0 14px 0" },
  muted: { color: "#6b7280" },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: "10px",
  },
  input: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box",
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "14px" },
  th: {
    textAlign: "left",
    padding: "8px",
    borderBottom: "2px solid #e5e7eb",
    color: "#374151",
  },
  td: { padding: "8px", borderBottom: "1px solid #f3f4f6", verticalAlign: "middle" },
  tdEmpty: { padding: "16px", color: "#9ca3af", textAlign: "center" },
  linkBtn: {
    background: "none",
    border: "none",
    color: "#2563eb",
    cursor: "pointer",
    padding: 0,
    fontWeight: "600",
  },
  dangerBtn: {
    background: "none",
    border: "none",
    color: "#b91c1c",
    cursor: "pointer",
    padding: 0,
    fontWeight: "600",
  },
  rowActions: { display: "flex", gap: "10px", marginTop: "12px" },
  primaryBtn: {
    background: "#2563eb",
    color: "white",
    padding: "10px 18px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
  secondaryBtn: {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    background: "white",
    cursor: "pointer",
    fontWeight: "600",
  },
};
