import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect } from "react";

export default function MainLayout({ children }) {
  // If children are passed, render them. If not, render Outlet for router-based usage.
  // This supports both manual wrapping and Layout Routes.
  const content = children || <Outlet />;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="">
      <Navbar
        toggleMenu={toggleMenu}
        closeMenu={closeMenu}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 pt-24">{content}</main>

      {/* Premium Footer */}
      <Footer />
    </div>
  );
}
