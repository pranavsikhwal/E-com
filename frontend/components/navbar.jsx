"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setEmail(payload.sub);
      } catch (err) {
        setEmail("");
      }
    }
  }, []);

  function handleLogout() {
    const confirmed = window.confirm("Are you sure you want to logout?"); //two factor authentification
    if (!confirmed) return;
    localStorage.removeItem("token");
    setEmail("");
    router.push("/login");
  }

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
        Bazaar
      </Link>

      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
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

        {email ? (
          <>
            <span
              style={{
                color: "#555",
                fontSize: "0.9rem",
              }}
            >
              {email}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: "#111",
                color: "white",
                border: "none",
                padding: "0.4rem 1rem",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "0.9rem",
              }}
            >
              Logout
            </button>
          </>
        ) : (
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
        )}
      </div>
    </nav>
  );
}
