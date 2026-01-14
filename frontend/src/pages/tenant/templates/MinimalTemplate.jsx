import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import ServiceCard from "./common/ServiceCard";
import TestimonialsSection from "./common/TestimonialsSection";
import FAQSection from "./common/FAQSection";
import ContactSection from "./common/ContactSection";

export default function MinimalTemplate({ org }) {
  const primaryColor = org.primaryColor || "#000000";
  const isVisible = (section) =>
    org.settings?.sectionVisibility?.[section] !== false;

  return (
    <div className="min-h-screen bg-white font-mono text-black selection:bg-black selection:text-white">
      <nav className="fixed top-0 w-full p-8 flex justify-between items-center z-50 bg-white/90 backdrop-blur-sm mix-blend-difference text-black">
        <div className="flex items-center gap-3 text-2xl font-bold tracking-tighter uppercase">
          {org.logoUrl && (
            <img
              src={org.logoUrl}
              alt={org.name}
              className="h-8 w-8 object-contain"
            />
          )}
          {org.name}
        </div>
        <Link
          to="/book"
          className="text-sm border-b border-black pb-1 hover:pb-2 transition-all uppercase tracking-widest"
        >
          Book Now
        </Link>
      </nav>

      <main className="pt-32 px-8 container mx-auto">
        <div className="min-h-[70vh] flex flex-col justify-center max-w-5xl">
          <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
            {org.content?.heroTagline || "SIMPLY BETTER."}
          </h2>
          <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mb-12">
            {org.content?.heroSubheadline ||
              "Efficient. Reliable. Professional. Book your service today."}
          </p>
          <Link
            to="/book"
            className="group flex items-center gap-4 text-2xl font-bold hover:gap-6 transition-all"
            style={{ color: primaryColor }}
          >
            <span>GET STARTED</span> <FaArrowRight />
          </Link>
        </div>

        {isVisible("about") && org.content?.aboutUs && (
          <div className="py-32 grid md:grid-cols-2 gap-16 border-t border-gray-100">
            <h3 className="text-xl font-bold text-gray-400">01 / ABOUT</h3>
            <p className="text-2xl md:text-3xl leading-snug font-medium">
              {org.content.aboutUs}
            </p>
          </div>
        )}

        {org.services && org.services.length > 0 && (
          <div className="py-32 border-t border-gray-100">
            <div className="flex justify-between items-end mb-16">
              <h3 className="text-xl font-bold text-gray-400">02 / SERVICES</h3>
              <p className="text-sm font-bold uppercase">Curated Selection</p>
            </div>
            <div className="space-y-0">
              {org.services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  primaryColor={org.primaryColor}
                  variant="minimal"
                />
              ))}
            </div>
          </div>
        )}

        {/* Hours Section */}
        {isVisible("hours") && (
          <div className="py-32 border-t border-gray-100 grid md:grid-cols-2 gap-16">
            <h3 className="text-xl font-bold text-gray-400">03 / HOURS</h3>
            <div>
              <p className="text-3xl font-bold mb-4">
                {org.content?.hours || "Mon - Fri: 9am - 5pm"}
              </p>
              <p className="text-gray-500">
                Walk-ins welcome based on availability.
              </p>
            </div>
          </div>
        )}

        {/* Extra Sections */}
        {isVisible("testimonials") && org.content?.testimonials && (
          <TestimonialsSection
            testimonials={org.content.testimonials}
            primaryColor={org.primaryColor}
            variant="minimal"
          />
        )}
        {isVisible("faqs") && org.content?.faqs && (
          <FAQSection
            faqs={org.content.faqs}
            primaryColor={org.primaryColor}
            variant="minimal"
          />
        )}
        {(isVisible("contact") || isVisible("map")) && (
          <ContactSection
            org={org}
            showMap={isVisible("map")}
            showContact={isVisible("contact")}
          />
        )}
      </main>

      <footer className="px-8 py-8 border-t border-gray-100 flex justify-between items-center text-xs font-mono uppercase text-gray-400">
        <div>{org.name} ®</div>
        <div>All Rights Reserved</div>
      </footer>
    </div>
  );
}
