import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../utils/baseurl";
import * as FaIcons from "react-icons/fa";
// Restore named imports for existing JSX
import {
  FaSearch,
  FaStore,
  FaArrowRight,
  FaMapMarkerAlt,
  FaTimes,
  FaStar,
  FaFire,
  FaCertificate,
  FaHeart,
  FaStethoscope,
  FaHospital,
  FaCut,
  FaBriefcase,
  FaGraduationCap,
  FaLandmark,
  FaHome,
  FaBuilding,
  FaEllipsisH,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Helper for dynamic icons
const DynamicIcon = ({ name, className }) => {
  const IconComponent = FaIcons[name] || FaIcons.FaStore;
  return <IconComponent className={className} />;
};

export default function MarketplaceHome() {
  const [organizations, setOrganizations] = useState([]);
  const [categories, setCategories] = useState([]); // Dynamic Categories
  const [loading, setLoading] = useState(true);

  // Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [tagFilter, setTagFilter] = useState(""); // "" | "FEATURED" | "NEW" | "POPULAR"
  const [activeCategory, setActiveCategory] = useState(null); // Full category object
  const [selectedOrg, setSelectedOrg] = useState(null);

  // Fetch Categories on Mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // Use the public categories endpoint
      const res = await axiosInstance.get("/categories");
      setCategories(res.data.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMarketplace();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, cityFilter, tagFilter, activeCategory]);

  const fetchMarketplace = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.q = searchTerm;
      if (cityFilter) params.city = cityFilter;
      if (tagFilter) params.tag = tagFilter;

      if (activeCategory) {
        // Send categoryId if available (for new dynamic cats)
        params.categoryId = activeCategory.id;
      }

      const res = await axiosInstance.get("/marketplace/organizations", {
        params,
      });
      setOrganizations(res.data.data);
    } catch (error) {
      console.error("Failed to fetch marketplace", error);
    } finally {
      setLoading(false);
    }
  };

  const trackEvent = async (type, orgId) => {
    try {
      await axiosInstance.post("/marketplace/track", { type, orgId });
    } catch (err) {}
  };

  const handleOrgClick = (org) => {
    setSelectedOrg(org);
    trackEvent("CLICK", org.id);
  };

  const handleRedirect = (orgId) => {
    trackEvent("REDIRECT", orgId);
  };

  const featuredOrgs = organizations.filter(
    (org) =>
      org.marketplaceTag === "FEATURED" ||
      org.marketplaceTag === "NEW" ||
      org.marketplaceTag === "POPULAR"
  );
  const showFeaturedSection =
    (!tagFilter && !activeCategory) ||
    tagFilter === "FEATURED" ||
    tagFilter === "NEW" ||
    tagFilter === "POPULAR";
  const regularOrgs = organizations.filter(
    (org) =>
      org.marketplaceTag !== "FEATURED" &&
      org.marketplaceTag !== "NEW" &&
      org.marketplaceTag !== "POPULAR"
  );

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900 selection:bg-primary-100 selection:text-primary-900">
      {/* Navbar - Consistent with MainLayout if possible, reusing classes */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-neutral-100 z-50">
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="Slotcore Logo" className="h-10" />
            <span className="font-bold text-2xl tracking-tight text-neutral-900">
              Slotcore{" "}
              <span className="text-primary-600 font-medium">Market</span>
            </span>
          </Link>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="hidden md:flex items-center text-neutral-600 hover:text-primary-600 font-medium transition-colors px-4"
            >
              Vendor Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-all shadow-lg shadow-neutral-200"
            >
              List Business
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Page Theme Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background Gradients (Same as Home.jsx) */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-primary-50/50 to-transparent -z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-gradient-to-r from-primary-100/30 to-secondary-100/30 blur-3xl rounded-full -z-10" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-neutral-50 border border-neutral-200 text-neutral-600 text-sm font-semibold"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Live Marketplace</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-neutral-900"
            >
              Discover
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent px-2">
                Local Services
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-neutral-500 leading-relaxed max-w-2xl mx-auto"
            >
              Connect with top-rated professionals for health, wellness, and
              more. Book instantly with confidence.
            </motion.p>
          </div>

          {/* Search Complex - Floating Card Style */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white p-3 rounded-2xl shadow-2xl shadow-primary-900/5 border border-neutral-200 flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative group">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Search for services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-transparent rounded-xl focus:bg-neutral-50 outline-none transition-colors placeholder:text-neutral-400 text-neutral-900 font-medium"
                />
              </div>
              <div className="w-px bg-neutral-100 hidden md:block" />
              <div className="flex-1 relative group">
                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-600 transition-colors" />
                <input
                  type="text"
                  placeholder="City or Location"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-transparent rounded-xl focus:bg-neutral-50 outline-none transition-colors placeholder:text-neutral-400 text-neutral-900 font-medium"
                />
              </div>
              <button
                onClick={fetchMarketplace}
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-primary-200 active:scale-95 whitespace-nowrap"
              >
                Search
              </button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {[
                { id: "FEATURED", label: "Featured", icon: <FaStar /> },
                { id: "POPULAR", label: "Popular", icon: <FaFire /> },
                { id: "NEW", label: "New", icon: <FaCertificate /> },
              ].map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => {
                    setTagFilter(tagFilter === tag.id ? "" : tag.id);
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                    tagFilter === tag.id
                      ? "bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-200"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-primary-200 hover:text-primary-600"
                  }`}
                >
                  {tag.icon} {tag.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Strip - Sticky */}
      <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-md border-y border-neutral-100 shadow-sm">
        <div className="container mx-auto">
          <div className="flex overflow-x-auto justify-start md:justify-center py-4 px-6 gap-6 scrollbar-hide snap-x">
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex-shrink-0 flex flex-col items-center gap-2 min-w-[72px] group cursor-pointer snap-start transition-opacity ${
                activeCategory !== null
                  ? "opacity-60 hover:opacity-100"
                  : "opacity-100"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all duration-300 ${
                  activeCategory === null
                    ? "bg-primary-600 text-white shadow-md shadow-primary-200 scale-110"
                    : "bg-neutral-100 text-neutral-400 group-hover:bg-primary-50 group-hover:text-primary-600"
                }`}
              >
                <FaStore />
              </div>
              <span
                className={`text-[11px] font-bold uppercase tracking-wide ${
                  activeCategory === null
                    ? "text-primary-700"
                    : "text-neutral-500"
                }`}
              >
                All
              </span>
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  setActiveCategory(activeCategory?.id === cat.id ? null : cat)
                }
                className={`flex-shrink-0 flex flex-col items-center gap-2 min-w-[72px] group cursor-pointer snap-start transition-opacity ${
                  activeCategory?.id !== cat.id
                    ? "opacity-60 hover:opacity-100"
                    : "opacity-100"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all duration-300 ${
                    activeCategory?.id === cat.id
                      ? "bg-primary-600 text-white shadow-md shadow-primary-200 scale-110"
                      : "bg-neutral-100 text-neutral-400 group-hover:bg-primary-50 group-hover:text-primary-600"
                  }`}
                >
                  <DynamicIcon name={cat.icon} />
                </div>
                <span
                  className={`text-[11px] font-bold uppercase tracking-wide max-w-[80px] text-center truncate ${
                    activeCategory?.id === cat.id
                      ? "text-primary-700"
                      : "text-neutral-500"
                  }`}
                >
                  {cat.name.split(" ")[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 bg-neutral-50/50 min-h-[600px]">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl h-80 animate-pulse border border-neutral-100 shadow-sm"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Featured Section */}
            {showFeaturedSection && featuredOrgs.length > 0 && (
              <div className="mb-20">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">
                      Featured Collections
                    </h2>
                    <p className="text-neutral-500 mt-2">
                      Curated for exceptional quality
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredOrgs.map((org, idx) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      key={org.id}
                    >
                      <OrgCardV2
                        org={org}
                        isFeatured={true}
                        onClick={() => handleOrgClick(org)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Main Grid */}
            <div>
              <div className="flex items-end justify-between mb-10">
                <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">
                  Explore {activeCategory?.name || "All"}
                  <span className="text-primary-600">.</span>
                </h2>
                <span className="text-neutral-500 font-medium bg-white px-4 py-2 rounded-full border border-neutral-200 shadow-sm text-sm">
                  {regularOrgs.length} Results
                </span>
              </div>

              {organizations.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-neutral-200">
                  <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaSearch className="text-2xl text-neutral-300" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">
                    No results found
                  </h3>
                  <p className="text-neutral-500 max-w-md mx-auto">
                    We couldn't find any matches. Try adjusting your search term
                    or location.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setCityFilter("");
                    }}
                    className="mt-6 text-primary-600 font-bold hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {regularOrgs.map((org, idx) => (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      key={org.id}
                    >
                      <OrgCardV2
                        org={org}
                        onClick={() => handleOrgClick(org)}
                      />
                    </motion.div>
                  ))}
                  {!showFeaturedSection &&
                    featuredOrgs.map((org) => (
                      <OrgCardV2
                        key={org.id}
                        org={org}
                        onClick={() => handleOrgClick(org)}
                      />
                    ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedOrg && (
          <QuickViewModal
            org={selectedOrg}
            onClose={() => setSelectedOrg(null)}
            onRedirect={handleRedirect}
          />
        )}
      </AnimatePresence>

      {/* Footer (Simplified) */}
      <footer className="bg-white border-t border-neutral-200 py-12">
        <div className="container mx-auto px-6 text-center text-neutral-500">
          <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
            <FaStore />
            <span className="font-bold">Slotcore Marketplace</span>
          </div>
          <p>
            &copy; {new Date().getFullYear()} Slotcore Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function OrgCardV2({ org, isFeatured, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl overflow-hidden cursor-pointer border border-neutral-200 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-900/5 transition-all duration-300 relative h-full flex flex-col"
    >
      {/* Image / Logo Area */}
      <div className="relative h-48 overflow-hidden bg-neutral-100">
        {org.logoUrl ? (
          <img
            src={org.logoUrl}
            alt={org.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-4xl font-bold text-white uppercase"
            style={{ backgroundColor: org.primaryColor || "#4F46E5" }}
          >
            {org.name.slice(0, 2)}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {isFeatured && (
            <span className="bg-white/95 backdrop-blur-md text-neutral-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
              <FaStar className="text-yellow-400" /> Featured
            </span>
          )}
          {org.marketplaceTag === "NEW" && (
            <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              New
            </span>
          )}
          {org.marketplaceTag === "POPULAR" && (
            <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              Popular
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 leading-tight group-hover:text-primary-600 transition-colors">
              {org.name}
            </h3>
            <p className="text-xs font-semibold text-neutral-500 mt-1 uppercase tracking-wide">
              {org.categoryDetails?.name || org.category || "Service"}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 bg-neutral-50 px-2 py-1 rounded-lg border border-neutral-100">
              <FaStar className="text-yellow-400 text-xs" />
              <span className="text-xs font-bold text-neutral-800">
                {org.averageRating
                  ? Number(org.averageRating).toFixed(1)
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {org.address && (
          <p className="text-sm text-neutral-500 flex items-center gap-1.5 mt-2 mb-4">
            <FaMapMarkerAlt className="text-neutral-300 shrink-0" />
            <span className="truncate">{org.address}</span>
          </p>
        )}

        {/* Action Line */}
        <div className="mt-auto pt-4 border-t border-neutral-50 flex items-center justify-between text-sm">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border-2 border-white bg-neutral-200"
              />
            ))}
            <div className="w-6 h-6 rounded-full border-2 border-white bg-neutral-100 flex items-center justify-center text-[8px] text-neutral-500 font-bold">
              +
            </div>
          </div>
          <span className="font-bold text-primary-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
            View <FaArrowRight className="text-xs" />
          </span>
        </div>
      </div>
    </div>
  );
}

function QuickViewModal({ org, onClose, onRedirect }) {
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [org.id]);

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const res = await axiosInstance.get(
        `/marketplace/orgs/${org.id}/reviews?limit=3`
      );
      setReviews(res.data.reviews || []);
    } catch (error) {
      console.error("Failed to load reviews");
    } finally {
      setLoadingReviews(false);
    }
  };

  const getOrgUrl = (slug) => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const rootDomain = host.replace("www.", "");
    return `${protocol}//${slug}.${rootDomain}`;
  };

  const handleVisit = () => {
    onRedirect(org.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden relative max-h-[90vh] flex flex-col md:flex-row"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/20 backdrop-blur-md hover:bg-white/40 p-2 rounded-full z-20 text-white md:text-neutral-500 md:bg-neutral-100 md:hover:bg-neutral-200 transition-colors"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Left Side: Visuals */}
        <div className="w-full md:w-2/5 bg-neutral-100 relative h-48 md:h-auto">
          {org.logoUrl ? (
            <img
              src={org.logoUrl}
              className="w-full h-full object-cover"
              alt=""
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: org.primaryColor || "#6366f1" }}
            >
              <span className="text-6xl text-white/50 font-bold uppercase">
                {org.name.slice(0, 2)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
            <div className="text-white">
              <h3 className="font-bold text-2xl mb-1">{org.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-200 opacity-90">
                <FaMapMarkerAlt /> {org.address}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Info & Reviews */}
        <div className="w-full md:w-3/5 p-8 overflow-y-auto flex flex-col bg-white">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">About</h2>
          <p className="text-neutral-600 leading-relaxed mb-8 text-sm">
            {org.content?.heroTagline ||
              "Providing top-tier certified services. Book your appointment effortlessly with us today."}
          </p>

          {/* Reviews Block */}
          <div className="mb-8 flex-1">
            <div className="flex items-center justify-between mb-4 border-b border-neutral-100 pb-2">
              <h3 className="font-bold text-neutral-900 flex items-center gap-2 text-sm uppercase tracking-wide">
                Recent Feedback
              </h3>
              <div className="flex items-center gap-1 text-yellow-400 text-sm">
                <span className="font-bold text-neutral-900">
                  {Number(org.averageRating || 0).toFixed(1)}
                </span>
                <FaStar />
                <span className="text-neutral-400 text-xs font-normal">
                  ({org.totalReviews})
                </span>
              </div>
            </div>

            {loadingReviews ? (
              <div className="space-y-3">
                <div className="h-20 bg-neutral-50 rounded-xl animate-pulse" />
                <div className="h-20 bg-neutral-50 rounded-xl animate-pulse" />
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map((r, i) => (
                  <div
                    key={i}
                    className="bg-neutral-50 p-4 rounded-xl border border-neutral-100"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-sm text-neutral-900">
                        {r.reviewerName}
                      </span>
                      <div className="flex text-yellow-400 text-[10px]">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={i < r.rating ? "" : "text-neutral-200"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-neutral-600 text-xs leading-relaxed italic">
                      "{r.comment}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-neutral-50 rounded-xl border border-dashed border-neutral-200 text-neutral-400 text-sm">
                No reviews yet.
              </div>
            )}
          </div>

          <div className="mt-auto">
            <a
              onClick={handleVisit}
              href={getOrgUrl(org.slug)}
              target="_blank"
              rel="noreferrer"
              className="block w-full bg-neutral-900 hover:bg-black text-white text-center font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
            >
              Book Appointment <FaArrowRight />
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
