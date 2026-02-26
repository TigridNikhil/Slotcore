import React from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Features", to: "/#features" },
  { label: "Marketplace", to: "/marketplace" },
  { label: "Pricing", to: "/pricing" },
  { label: "About", to: "/about" },
  { label: "Enterprise", to: "/#enterprise" },
];

const Navbar = ({ toggleMenu, closeMenu, isMobileMenuOpen }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-neutral-200/50">
      <div className="container mx-auto px-6 h-20">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-3 z-[110]"
          >
            <img src="/logo.png" alt="Slotcore" className="h-9" />
            <span className="text-xl font-black tracking-tight text-neutral-900">
              Slotcore
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <NavItem key={link.label} {...link} />
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 font-bold transition-all duration-200"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white font-bold shadow-lg shadow-neutral-200 hover:bg-neutral-800 transition-all duration-200"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={toggleMenu}
            aria-label="Toggle menu"
            className="lg:hidden z-[110] p-2 -mr-2 text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
          >
            {isMobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-[90] lg:hidden"
            />

            {/* Content Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[100%] max-w-sm bg-white shadow-2xl z-[100] lg:hidden flex flex-col pt-24"
            >
              <div className="px-6 space-y-2 flex-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-6 px-4">
                  Navigation
                </p>
                {NAV_LINKS.map((link, idx) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                    key={link.label}
                  >
                    <MobileNavItem {...link} onClick={closeMenu} />
                  </motion.div>
                ))}
              </div>

              <div className="p-6 border-t border-neutral-100 bg-neutral-50/50">
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="w-full flex items-center justify-center px-8 py-4 rounded-2xl bg-neutral-900 text-white font-black shadow-lg mb-4 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Start Free Trial
                </Link>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="w-full flex items-center justify-center px-8 py-4 rounded-2xl border border-neutral-200 bg-white text-neutral-900 font-black hover:bg-neutral-50 transition-all"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

/* ---------------- Components ---------------- */

const NavItem = ({ to, label }) => (
  <Link
    to={to}
    className="text-sm text-neutral-500 hover:text-neutral-900 font-bold transition-all relative group py-2"
  >
    {label}
    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-neutral-900 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
  </Link>
);

const MobileNavItem = ({ to, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center justify-between w-full px-4 py-4 rounded-2xl text-lg font-black text-neutral-800 hover:bg-neutral-50 hover:text-primary-600 transition-all border border-transparent hover:border-neutral-100"
  >
    {label}
    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 text-xs shadow-sm">
      →
    </div>
  </Link>
);

export default Navbar;
