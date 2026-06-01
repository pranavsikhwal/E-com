import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e5e5",
      }}
    >
      <Link
        href="/"
        style={{
          fontSize: "1.4rem",
          fontWeight: "700",
          textDecoration: "none",
          color: "#111",
        }}
      >
        ECOM
      </Link>

      <div style={{ display: "flex", gap: "1.5rem" }}>
        <Link
          href="/cart"
          style={{
            textDecoration: "none",
            color: "#111",
            fontWeight: "500",
          }}
        >
          Cart
        </Link>

        <Link
          href="/login"
          style={{
            textDecoration: "none",
            color: "#111",
            fontWeight: "500",
          }}
        >
          Login
        </Link>
      </div>
    </nav>
  );
}
