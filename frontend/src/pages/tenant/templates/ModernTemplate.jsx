import { Link } from "react-router-dom";
import { FaCalendarAlt, FaCheckCircle, FaStar } from "react-icons/fa";
import ServiceCard from "./common/ServiceCard";
import TestimonialsSection from "./common/TestimonialsSection";
import ReviewsSection from "./common/ReviewsSection";
import FAQSection from "./common/FAQSection";
import ContactSection from "./common/ContactSection";

export default function ModernTemplate({ org }) {
  const isVisible = (section) =>
    org.settings?.sectionVisibility?.[section] !== false;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Navbar */}
      {/* Premium Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Brand */}
          <div className="flex items-center gap-3 group cursor-pointer">
            {org.logoUrl ? (
              <img
                src={org.logoUrl}
                alt={org.name}
                className="h-10 w-10 rounded-xl object-cover shadow-sm group-hover:scale-105 transition"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${org.primaryColor}, ${org.primaryColor}99)`,
                }}
              >
                {org.name?.charAt(0) || "S"}
              </div>
            )}

            <span className="text-xl font-extrabold tracking-tight text-gray-900">
              {org.name}
            </span>
          </div>

          {/* CTA */}
          <Link
            to="/book"
            className="relative px-6 py-2.5 rounded-full text-white font-semibold overflow-hidden transition-all hover:-translate-y-0.5"
            style={{
              background: `linear-gradient(135deg, ${org.primaryColor}, ${org.primaryColor}cc)`,
            }}
          >
            <span className="relative z-10">Book Now</span>
            <span className="absolute inset-0 opacity-0 hover:opacity-100 transition bg-white/10" />
          </Link>
        </div>
      </nav>
      {/* Hero Section */}
      {/* Premium Hero */}
      <header className="relative overflow-hidden py-24 lg:py-36 bg-gradient-to-b from-gray-50 to-white">
        {/* Background Orbs */}
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: org.primaryColor }}
        />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-400 rounded-full blur-3xl opacity-10" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          {/* Badge */}
          <span
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold mb-8"
            style={{
              backgroundColor: `${org.primaryColor}15`,
              color: org.primaryColor,
            }}
          >
            ✨ Welcome to {org.name}
          </span>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8 leading-tight">
            {org.content?.heroTagline || (
              <>
                Book Smarter.
                <br />
                <span
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage: `linear-gradient(90deg, ${org.primaryColor}, #9333ea)`,
                  }}
                >
                  Experience Excellence
                </span>
              </>
            )}
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            {org.content?.heroSubheadline ||
              "A modern booking experience designed for speed, clarity, and convenience. Schedule your service in seconds."}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/book"
              className="group px-8 py-4 rounded-full text-white font-bold text-lg transition-all hover:-translate-y-1 hover:shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${org.primaryColor}, ${org.primaryColor}cc)`,
              }}
            >
              <span className="flex items-center justify-center gap-2">
                <FaCalendarAlt className="group-hover:scale-110 transition" />
                Book Appointment
              </span>
            </Link>

            <button className="px-8 py-4 rounded-full bg-white border border-gray-200 font-semibold text-gray-700 hover:border-gray-400 hover:shadow-md transition">
              Learn More
            </button>
          </div>
        </div>
      </header>

      {isVisible("about") && org.content?.aboutUs && (
        <section className="py-28 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 md:px-8">
            {/* About */}
            {org.content?.aboutUs && (
              <div className="mb-28 max-w-4xl mx-auto">
                <div className="text-center mb-14">
                  <span
                    className="inline-block px-5 py-2 rounded-full text-sm font-semibold mb-4 border"
                    style={{
                      backgroundColor: `${org.primaryColor}15`,
                      color: org.primaryColor,
                      borderColor: `${org.primaryColor}30`,
                    }}
                  >
                    Our Story
                  </span>

                  <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                    About{" "}
                    <span style={{ color: org.primaryColor }}>Our Company</span>
                  </h2>

                  <div
                    className="w-24 h-1.5 mx-auto rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${org.primaryColor}, ${org.primaryColor}80)`,
                    }}
                  />
                </div>

                <div className="relative">
                  <div
                    className="absolute -inset-6 rounded-3xl blur-2xl opacity-40"
                    style={{
                      background: `linear-gradient(120deg, ${org.primaryColor}25, transparent)`,
                    }}
                  />

                  <div className="relative bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-2xl shadow-xl border border-gray-200">
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                      {org.content.aboutUs}
                    </p>

                    {/* Highlights */}
                    <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap gap-4 justify-center">
                      {["Established 2024", "500+ Clients", "24/7 Support"].map(
                        (label, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium"
                            style={{
                              backgroundColor: `${org.primaryColor}10`,
                              color: org.primaryColor,
                            }}
                          >
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: org.primaryColor }}
                            />
                            {label}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Why Choose Us */}
            <div className="mt-28">
              <div className="text-center mb-20">
                <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                  Why Choose <span style={{ color: org.primaryColor }}>Us</span>
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                  A modern, reliable, and trusted service experience
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                {[
                  {
                    icon: <FaCheckCircle />,
                    title: "Professional Staff",
                    desc: "Certified professionals delivering consistent, high-quality service.",
                    stat: "100% Certified",
                  },
                  {
                    icon: <FaStar />,
                    title: "Top Rated",
                    desc: "Loved by customers with industry-leading satisfaction scores.",
                    stat: "4.9 / 5 Rating",
                  },
                  {
                    icon: <FaCalendarAlt />,
                    title: "Easy Scheduling",
                    desc: "Instant booking with real-time availability across devices.",
                    stat: "24/7 Booking",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="group relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  >
                    {/* Icon */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                      <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl border"
                        style={{
                          background: `linear-gradient(135deg, ${org.primaryColor}25, white)`,
                          borderColor: `${org.primaryColor}30`,
                        }}
                      >
                        <div
                          className="text-3xl"
                          style={{ color: org.primaryColor }}
                        >
                          {item.icon}
                        </div>
                      </div>
                    </div>

                    <div className="pt-14 text-center">
                      <h4 className="text-2xl font-bold text-gray-900 mb-4">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {item.desc}
                      </p>

                      <div
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold"
                        style={{
                          backgroundColor: `${org.primaryColor}15`,
                          color: org.primaryColor,
                        }}
                      >
                        {item.stat}
                        <span className="opacity-50">• Industry Leading</span>
                      </div>
                    </div>

                    {/* Bottom Accent */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl opacity-0 group-hover:opacity-100 transition"
                      style={{
                        background: `linear-gradient(90deg, ${org.primaryColor}, ${org.primaryColor}80)`,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Metrics */}
            <div
              className="mt-28 rounded-3xl p-10 md:p-14 text-white"
              style={{
                background: `linear-gradient(135deg, ${org.primaryColor}, #111827)`,
              }}
            >
              <div className="max-w-4xl mx-auto text-center">
                <h4 className="text-2xl md:text-3xl font-extrabold mb-6">
                  Trusted by Growing Businesses
                </h4>

                <p className="text-white/80 mb-12 max-w-2xl mx-auto">
                  Proven reliability backed by real performance metrics
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                  {[
                    ["98%", "Client Satisfaction"],
                    ["24/7", "Support"],
                    ["10+", "Years Experience"],
                    ["500+", "Bookings"],
                  ].map(([value, label], i) => (
                    <div key={i}>
                      <div className="text-4xl font-extrabold">{value}</div>
                      <div className="text-sm opacity-80 mt-2">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services Section - Dynamic */}
      {org.services && org.services.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
                style={{
                  backgroundColor: `${org.primaryColor}15`,
                  color: org.primaryColor,
                }}
              >
                What We Offer
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                Our Premium Services
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {org.services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  primaryColor={org.primaryColor}
                  variant="modern"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Opening Hours */}
      {isVisible("hours") && (
        <section className="relative py-28 overflow-hidden">
          {/* Background */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${org.primaryColor}, #0f172a)`,
            }}
          />

          {/* Soft Glow */}
          <div
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: org.primaryColor }}
          />

          <div className="relative z-10 container mx-auto px-6 text-center text-white">
            {/* Badge */}
            <span
              className="inline-block px-5 py-2 rounded-full text-sm font-semibold mb-6 border"
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                borderColor: "rgba(255,255,255,0.2)",
              }}
            >
              🕒 Availability
            </span>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 tracking-tight">
              Opening Hours
            </h2>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              {org.content?.hours || "Mon – Fri: 9:00 AM – 5:00 PM"}
            </p>

            {/* Divider */}
            <div
              className="mt-10 w-24 h-1 mx-auto rounded-full"
              style={{
                background: `linear-gradient(90deg, rgba(255,255,255,0.8), rgba(255,255,255,0.2))`,
              }}
            />
          </div>
        </section>
      )}
      {isVisible("testimonials") && org.content?.testimonials && (
        <TestimonialsSection
          testimonials={org.content.testimonials}
          primaryColor={org.primaryColor}
          variant="modern"
        />
      )}

      {/* Trusted Reviews (Real) */}
      <ReviewsSection
        orgId={org.id}
        primaryColor={org.primaryColor || "#4F46E5"}
      />

      {isVisible("faqs") && org.content?.faqs && (
        <FAQSection
          faqs={org.content.faqs}
          primaryColor={org.primaryColor}
          variant="modern"
        />
      )}
      {(isVisible("contact") || isVisible("map")) && (
        <ContactSection
          org={org}
          showMap={isVisible("map")}
          showContact={isVisible("contact")}
        />
      )}
      {/* Premium Footer */}
      <footer className="relative overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, #fafbffff, ${org.primaryColor}40)`,
          }}
        />

        {/* Glow */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: org.primaryColor }}
        />

        <div className="relative z-10 container mx-auto px-6 py-16 text-center">
          {/* Brand */}
          <p className="text-2xl font-extrabold text-black mb-3 tracking-tight">
            {org.name}
          </p>

          {/* Tagline (optional future-proof) */}
          <p className="text-gray-800 max-w-xl mx-auto mb-8 text-sm">
            Modern booking experience designed for speed, trust, and
            convenience.
          </p>

          {/* Divider */}
          <div className="w-24 h-px mx-auto mb-6 bg-white/10" />

          {/* Credits */}
          <p className="text-sm text-gray-800">
            Powered by{" "}
            <a
              href="https://slotcore.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold transition hover:underline"
              style={{ color: org.primaryColor }}
            >
              Slotcore
            </a>
          </p>

          {/* Copyright */}
          <p className="text-xs text-gray-800 mt-4">
            © {new Date().getFullYear()} {org.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
