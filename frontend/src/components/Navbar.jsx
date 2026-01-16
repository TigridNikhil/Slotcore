import React from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const NAV_LINKS = [
  { label: "Features", to: "/#features" },
  { label: "Marketplace", to: "/marketplace" },
  { label: "Pricing", to: "/pricing" },
  { label: "About", to: "/about" },
  { label: "Enterprise", to: "/#enterprise" },
];

const Navbar = ({ toggleMenu, closeMenu, isMobileMenuOpen }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-neutral-100 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-3 z-50"
          >
            <img src="/logo.png" alt="Slotcore Logo" className="h-10" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Slotcore
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <NavItem key={link.label} {...link} />
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-lg text-neutral-700 hover:text-primary-600 font-medium transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={toggleMenu}
            aria-label="Toggle menu"
            className="md:hidden z-50 text-neutral-700 hover:text-primary-600"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="
      fixed inset-0 z-[60] bg-white
      flex flex-col items-center justify-center
      md:hidden
      animate-slideDown
    "
        >
          <div className="flex flex-col items-center gap-8 text-lg font-medium">
            {NAV_LINKS.map((link) => (
              <MobileNavItem key={link.label} {...link} onClick={closeMenu} />
            ))}
            <MobileNavItem to="/contact" label="Contact" onClick={closeMenu} />
            <MobileNavItem to="/blog" label="Blog" onClick={closeMenu} />
          </div>

          <div className="flex flex-col gap-4 mt-10 w-64">
            <Link
              to="/login"
              onClick={closeMenu}
              className="px-8 py-3 text-center rounded-lg border border-neutral-200 text-neutral-700 font-medium"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              onClick={closeMenu}
              className="px-8 py-3 text-center rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium shadow-lg"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

/* ---------------- Components ---------------- */

const NavItem = ({ to, label }) => (
  <Link
    to={to}
    className="text-neutral-700 hover:text-primary-600 font-medium group transition"
  >
    <span className="pb-1 group-hover:border-b-2 group-hover:border-primary-600">
      {label}
    </span>
  </Link>
);

const MobileNavItem = ({ to, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="text-neutral-800 hover:text-primary-600 transition"
  >
    {label}
  </Link>
);

export default Navbar;
