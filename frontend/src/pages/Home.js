import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import OwnerDashboard from "../components/OwnerDashboard";
import ReceptionistDashboard from "../components/ReceptionistDashboard";
import './Home.css';

export default function Home() {
  const [me, setMe] = useState(null);
  const [meLoading, setMeLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      setMeLoading(true);
      try {
        const meRes = await api.get("auth/me/");
        if (!mounted) return;
        setMe(meRes.data);
      } catch {
        if (mounted) setMe(null);
      } finally {
        if (mounted) setMeLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const showDiscovery =
    me &&
    me.role !== "owner" &&
    me.role !== "receptionist";

  useEffect(() => {
    if (!showDiscovery) {
      setProperties([]);
      setLoading(false);
      return undefined;
    }

    let mounted = true;
    setLoading(true);

    api
      .get("listings/properties/")
      .then((res) => {
        if (mounted) {
          setProperties(Array.isArray(res.data) ? res.data : []);
        }
      })
      .catch(() => {
        if (mounted) {
          setProperties([]);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [showDiscovery]);

  const filteredProperties = useMemo(() => {
    const searchValue = search.trim().toLowerCase();
    const cityValue = city.trim().toLowerCase();
    const countryValue = country.trim().toLowerCase();

    return properties.filter((property) => {
      const nameText = (property.name || "").toLowerCase();
      const cityText = (property.city || "").toLowerCase();
      const countryText = (property.country || "").toLowerCase();
      const descriptionText = (property.description || "").toLowerCase();

      const matchesSearch =
        !searchValue ||
        nameText.includes(searchValue) ||
        cityText.includes(searchValue) ||
        countryText.includes(searchValue) ||
        descriptionText.includes(searchValue);
      const matchesCity = !cityValue || cityText.includes(cityValue);
      const matchesCountry = !countryValue || countryText.includes(countryValue);

      return matchesSearch && matchesCity && matchesCountry;
    });
  }, [properties, search, city, country]);

  const subtitle =
    me?.role === "owner"
      ? "Manage your properties and rooms"
      : me?.role === "receptionist"
        ? "Front desk for your assigned property"
        : "Search and discover your next stay";

  const pastelColors = ['pastel-blue', 'pastel-purple', 'pastel-green', 'pastel-yellow', 'pastel-pink'];

  return (
    <div className="home-container">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo-section">
          <h1>Travelio</h1>
          <p>{subtitle}</p>
        </div>
        <div className="nav-buttons">
          <Link to="/profile" className="btn-text">
            My Profile
          </Link>
          <button type="button" onClick={handleLogout} className="btn-danger">
            Logout
          </button>
        </div>
      </nav>

      {/* RENDER BAZAT PE ROL */}
      {meLoading ? (
        <p className="status-message">Loading…</p>
      ) : me?.role === "owner" ? (
        <OwnerDashboard />
      ) : me?.role === "receptionist" ? (
        <ReceptionistDashboard profile={me} />
      ) : (
        <>
          {/* BARA DE CĂUTARE SIMPLĂ */}
          <div className="search-section">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, city, country..."
            />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Filter by city"
            />
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Filter by country"
            />
          </div>

          {/* LISTA DE PROPRIETĂȚI */}
          <div className="properties-column">
            <h2>Available Properties</h2>

            {loading ? (
              <p className="status-message">Loading properties...</p>
            ) : filteredProperties.length === 0 ? (
              <p className="status-message">No properties matched your search.</p>
            ) : (
              filteredProperties.map((property, index) => {
                const colorClass = pastelColors[index % pastelColors.length];

                return (
                  <article
                    key={property.id}
                    className="property-card"
                    onClick={() => navigate(`/property/${property.id}`)}
                  >

                    {/* Poza proprietății sau fundal pastelat dacă nu are poză */}
                    <div className={`card-image ${colorClass}`}>
                      {property.images && property.images.length > 0 && (
                        <img
                          src={property.images[0].image_url || property.images[0].image}
                          alt={property.name}
                        />
                      )}
                    </div>

                    {/* Informațiile cardului */}
                    <div className="card-info">
                      <h3>{property.name}</h3>
                      <p className="location">
                        {property.city || "Unknown city"}, {property.country || "Unknown"}
                      </p>
                      <p className="description">
                        {property.description ? property.description.substring(0, 80) + "..." : "No description available."}
                      </p>
                    </div>

                    <button className="btn-book">View Property</button>

                  </article>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}