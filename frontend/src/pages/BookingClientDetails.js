import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function BookingClientDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const bookingData = location.state;

    const [clientName, setClientName] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [specialRequests, setSpecialRequests] = useState("");

    if (!bookingData) return <p>Error: Booking data is missing. Go back to property.</p>;

    const handleGoToPayment = () => {
        if (!clientName || !clientPhone) {
            alert("Please complete your name and phone number");
            return;
        }

        navigate("/checkout/payment", {
            state: {
                ...bookingData,
                clientName,
                clientPhone,
                specialRequests
            }
        });
    };

    return (
        <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
            <h2>Client details</h2>
            <p style={{ color: "#6b7280", marginBottom: "20px" }}>
                Reservation for <strong>{bookingData.propertyName}</strong> ({bookingData.days} nights)
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <input
                    type="text" placeholder="Full Name"
                    value={clientName} onChange={e => setClientName(e.target.value)}
                    style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db" }}
                />
                <input
                    type="tel" placeholder="Phone Number"
                    value={clientPhone} onChange={e => setClientPhone(e.target.value)}
                    style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db" }}
                />
                <textarea
                    placeholder="Special requests (optional)"
                    value={specialRequests} onChange={e => setSpecialRequests(e.target.value)}
                    style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", minHeight: "100px" }}
                />
                <button
                    onClick={handleGoToPayment}
                    style={{ padding: "14px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
                >
                    Proceed to Payment
                </button>
            </div>
        </div>
    );
}