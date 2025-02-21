"use client";

import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("access_token");

    router.push("/login");
  };

  if (["/login", "/register"].includes(pathname)) {
    return null;
  }

  return (
    <header style={headerStyles}>
      <div style={navStyles}>
        <Link href="/home" style={linkStyles}>
          Home
        </Link>
        <Link href="/dashboard" style={linkStyles}>
          Dashboard
        </Link>
      </div>

      <div style={logoutStyles}>
        <button onClick={handleLogout} style={buttonStyles}>
          Logout
        </button>
      </div>
    </header>
  );
};

const headerStyles = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 20px",
  backgroundColor: "#f8f9fa",
  borderBottom: "1px solid #dee2e6",
};

const navStyles = {
  display: "flex",
  gap: "15px",
};

const linkStyles = {
  textDecoration: "none",
  color: "#007bff",
  fontSize: "16px",
};

const logoutStyles = {
  display: "flex",
  alignItems: "center",
};

const buttonStyles = {
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "4px",
  cursor: "pointer",
};

export default Header;