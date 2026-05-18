import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function BookingPayment() {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state;

    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [expMonth, setExpMonth] = useState("");
    const [expYear, setExpYear] = useState("");

    if (!data) return <p style={{ padding: "40px", textAlign: "center" }}>Error: Missing data. Return to the home page.</p>;

    const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => (currentYear + i).toString());

    const handleConfirmFinalBooking = async () => {
        setLoading(true);
        try {
            await api.post("bookings/create/", {
                property: data.propertyId,
                check_in: data.checkIn,
                check_out: data.checkOut,
                number_of_guests: data.guests,
                number_of_days: data.days,
            });

            navigate("/booking-success", { state: data });
        } catch (err) {
            console.error(err);
            alert("A apărut o eroare la procesarea rezervării.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "40px 20px", maxWidth: "600px", margin: "0 auto", fontFamily: "sans-serif" }}>
            <h2 style={{ marginBottom: "5px", color: "#1f2937" }}>Payment and Confirmation</h2>
            <p style={{ color: "#6b7280", marginBottom: "30px" }}>
                Finalize the reservation for <strong>{data.propertyName}</strong>
            </p>

            {/* --- SELECTAREA METODEI DE PLATĂ --- */}
            <div style={{ display: "flex", gap: "15px", marginBottom: "30px" }}>
                <div
                    onClick={() => setPaymentMethod("card")}
                    style={{
                        flex: 1,
                        padding: "20px",
                        border: paymentMethod === "card" ? "2px solid #2563eb" : "1px solid #e5e7eb",
                        background: paymentMethod === "card" ? "#eff6ff" : "white",
                        borderRadius: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s"
                    }}
                >
                    <h4 style={{ margin: "0 0 5px 0", color: paymentMethod === "card" ? "#1d4ed8" : "#374151" }}>💳 Card payment</h4>
                    <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>Pay the full amount now.</p>
                </div>

                <div
                    onClick={() => setPaymentMethod("property")}
                    style={{
                        flex: 1,
                        padding: "20px",
                        border: paymentMethod === "property" ? "2px solid #2563eb" : "1px solid #e5e7eb",
                        background: paymentMethod === "property" ? "#eff6ff" : "white",
                        borderRadius: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s"
                    }}
                >
                    <h4 style={{ margin: "0 0 5px 0", color: paymentMethod === "property" ? "#1d4ed8" : "#374151" }}>🏨 Pay at property</h4>
                    <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>Requires a deposit on the card to secure the booking.</p>
                </div>
            </div>

            {/* --- DETALII CARD --- */}
            <div style={{ background: "#f9fafb", padding: "25px", borderRadius: "16px", marginBottom: "25px", border: "1px solid #e5e7eb" }}>
                <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", color: "#1f2937" }}>
                    {paymentMethod === "card" ? "Enter card details" : "Card details for deposit holding"}
                </h3>

                <label style={styles.label}>Name on card</label>
                <input type="text" placeholder="Ex: Popescu Ion" style={styles.input} />

                <label style={styles.label}>Card number</label>
                <input type="text" placeholder="0000 0000 0000 0000" maxLength="19" style={styles.input} />

                <div style={{ display: "flex", gap: "15px" }}>

                    <div style={{ flex: 1 }}>
                        <label style={styles.label}>Expiry date</label>
                        {}
                        <div style={styles.combinedInputBox}>
                            <select
                                style={styles.invisibleSelect}
                                value={expMonth}
                                onChange={(e) => setExpMonth(e.target.value)}
                            >
                                <option value="" disabled>MM</option>
                                {months.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>

                            <span style={styles.slash}>/</span>

                            <select
                                style={styles.invisibleSelect}
                                value={expYear}
                                onChange={(e) => setExpYear(e.target.value)}
                            >
                                <option value="" disabled>YY</option>
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>

                    <div style={{ width: "100px" }}>
                        <label style={styles.label}>CVC/CVV</label>
                        <input type="text" placeholder="123" maxLength="3" style={styles.input} />
                    </div>

                </div>
            </div>

            {/* --- BUTON CONFIRMARE --- */}
            <button
                onClick={handleConfirmFinalBooking}
                disabled={loading}
                style={{
                    width: "100%",
                    padding: "16px",
                    background: "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    fontWeight: "bold",
                    fontSize: "16px",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "background 0.2s"
                }}
            >
                {loading
                    ? "Se procesează..."
                    : paymentMethod === "card"
                        ? "Confirm and Pay in full"
                        : "Confirm and Pay in advance"
                }
            </button>
            <p style={{ textAlign: "center", fontSize: "12px", color: "#9ca3af", marginTop: "15px" }}>
                🔒 Secured payment. Your data is protected.
            </p>
        </div>
    );
}

const styles = {
    label: {
        display: "block",
        marginBottom: "8px",
        fontSize: "13px",
        fontWeight: "600",
        color: "#4b5563"
    },
    input: {
        width: "100%",
        padding: "12px",
        marginBottom: "15px",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        fontSize: "15px",
        outline: "none",
        boxSizing: "border-box",
        background: "white"
    },
    /* Caseta principală care imită un singur input MM/YY */
    combinedInputBox: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        height: "45px", /* Aceeași înălțime cu inputurile normale */
        padding: "0 10px",
        marginBottom: "15px",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        background: "white",
        boxSizing: "border-box"
    },
    /* Select-urile devin transparente și fără contur */
    invisibleSelect: {
        flex: 1,
        border: "none",
        outline: "none",
        background: "transparent",
        fontSize: "15px",
        color: "#4b5563",
        cursor: "pointer",
        textAlign: "center",
        /* Ascundem săgeata implicită din browser pentru un look mai "curat" (opțional) */
        appearance: "none",
        WebkitAppearance: "none",
        MozAppearance: "none",
    },
    slash: {
        fontSize: "18px",
        color: "#9ca3af",
        margin: "0 5px",
        pointerEvents: "none"
    }
};