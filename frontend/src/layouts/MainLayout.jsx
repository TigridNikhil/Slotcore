import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout({ children }) {
  // If children are passed, render them. If not, render Outlet for router-based usage.
  // This supports both manual wrapping and Layout Routes.
  const content = children || <Outlet />;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="bg-gradient-to-b from-white to-neutral-50 text-neutral-900 min-h-screen font-sans flex flex-col">
      <Navbar
        toggleMenu={toggleMenu}
        closeMenu={closeMenu}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1">{content}</main>

      {/* Premium Footer */}
      <Footer />
    </div>
  );
}
