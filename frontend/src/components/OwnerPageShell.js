export default function OwnerPageShell({ children, maxWidth = "900px" }) {
  return (
    <div style={{ ...styles.page }}>
      <div style={{ ...styles.inner, maxWidth }}>{children}</div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "32px",
    background: "#f6f7fb",
    color: "#111827",
  },
  inner: { margin: "0 auto" },
};
