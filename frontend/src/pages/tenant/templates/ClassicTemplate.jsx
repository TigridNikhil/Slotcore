import { Link } from "react-router-dom";
import { FaCalendarAlt, FaCheck, FaPhoneAlt } from "react-icons/fa";
import ServiceCard from "./common/ServiceCard";
import TestimonialsSection from "./common/TestimonialsSection";
import FAQSection from "./common/FAQSection";
import ContactSection from "./common/ContactSection";

export default function ClassicTemplate({ org }) {
  const primaryColor = org.primaryColor || "#1f2937";
  const isVisible = (section) =>
    org.settings?.sectionVisibility?.[section] !== false;

  return (
    <div className="min-h-screen bg-[#f8f5f2] font-serif text-gray-800">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-6">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 text-center md:text-left">
            {org.logoUrl && (
              <img
                src={org.logoUrl}
                alt={org.name}
                className="h-16 w-16 object-contain"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-wide uppercase text-gray-900">
                {org.name}
              </h1>
              <p className="text-sm text-gray-500 tracking-widest uppercase mt-1">
                Established Service
              </p>
            </div>
          </div>
          <Link
            to="/book"
            className="px-8 py-3 bg-gray-900 text-white uppercase tracking-widest text-sm hover:bg-gray-700 transition-colors"
            style={{ backgroundColor: primaryColor }}
          >
            Book Appt
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="relative py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-medium mb-8 leading-tight">
            {org.content?.heroTagline || "Experience Excellence"}
          </h2>
          <div
            className="w-24 h-1 bg-gray-800 mx-auto mb-8"
            style={{ backgroundColor: primaryColor }}
          ></div>
          <p className="text-xl text-gray-600 mb-12 italic font-light">
            {org.content?.heroSubheadline ||
              "Providing timeless quality and dedicated care for all our clients."}
          </p>
          <Link
            to="/book"
            className="inline-block border-2 border-gray-900 px-10 py-4 text-lg font-bold hover:bg-gray-900 hover:text-white transition-all uppercase tracking-wider"
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            Schedule Now
          </Link>
        </div>
      </div>

      {/* About */}
      {isVisible("about") && (
        <div className="bg-white py-20 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <h3 className="text-2xl font-bold uppercase tracking-widest mb-8">
              Who We Are
            </h3>
            <p className="text-lg leading-loose text-gray-600">
              {org.content?.aboutUs ||
                "We are committed to providing the highest level of service. Our team of professionals is here to ensure your satisfaction with every visit."}
            </p>
          </div>
        </div>
      )}

      {/* Services */}
      {isVisible("services") && org.services && org.services.length > 0 && (
        <div className="bg-[#f2efe9] py-24 px-6 border-t border-gray-200">
          <div className="container mx-auto max-w-6xl">
            <h3 className="text-center text-3xl font-bold uppercase tracking-widest mb-16 text-gray-900">
              Our Menu
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {org.services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  primaryColor={org.primaryColor}
                  variant="classic"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hours Section */}
      {isVisible("hours") && (
        <div className="bg-white py-20 px-6 border-t border-gray-200 text-center">
          <h3 className="text-2xl font-bold uppercase tracking-widest mb-6">
            Hours
          </h3>
          <p className="text-xl italic text-gray-600 max-w-2xl mx-auto">
            {org.content?.hours || "Mon - Fri: 9:00 AM - 5:00 PM"}
          </p>
        </div>
      )}

      {/* Extra Sections */}
      {isVisible("testimonials") && org.content?.testimonials && (
        <TestimonialsSection
          testimonials={org.content.testimonials}
          primaryColor={org.primaryColor}
          variant="classic"
        />
      )}
      {isVisible("faqs") && org.content?.faqs && (
        <FAQSection
          faqs={org.content.faqs}
          primaryColor={org.primaryColor}
          variant="classic"
        />
      )}
      {(isVisible("contact") || isVisible("map")) && (
        <ContactSection
          org={org}
          showMap={isVisible("map")}
          showContact={isVisible("contact")}
        />
      )}

      {/* Footer */}
      <footer className="bg-gray-100 py-12 text-center border-t border-gray-200">
        <p className="font-bold text-lg mb-2">{org.name}</p>
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
