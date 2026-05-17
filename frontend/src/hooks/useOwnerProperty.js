import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

/**
 * Loads a single property from the owner's listings. Redirects to /home if not owner or not found.
 */
export default function useOwnerProperty() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const pid = Number(propertyId);

    if (!propertyId || Number.isNaN(pid)) {
      navigate("/home", { replace: true });
      return undefined;
    }

    (async () => {
      setLoading(true);
      try {
        const meRes = await api.get("auth/me/");
        if (cancelled) return;
        if (meRes.data?.role !== "owner") {
          navigate("/home", { replace: true });
          return;
        }

        const res = await api.get("listings/my-properties/");
        const list = Array.isArray(res.data) ? res.data : [];
        const found = list.find((p) => p.id === pid);
        if (!found) {
          navigate("/home", { replace: true });
          return;
        }
        if (!cancelled) setProperty(found);
      } catch {
        if (!cancelled) navigate("/home", { replace: true });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [propertyId, navigate]);

  const reload = async () => {
    const pid = Number(propertyId);
    const res = await api.get("listings/my-properties/");
    const list = Array.isArray(res.data) ? res.data : [];
    const found = list.find((p) => p.id === pid);
    if (found) setProperty(found);
    return found;
  };

  return { property, loading, reload, propertyId: Number(propertyId) };
}
