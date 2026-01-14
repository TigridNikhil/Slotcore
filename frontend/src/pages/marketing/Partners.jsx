import React from "react";
import {
  FaHandshake,
  FaGlobe,
  FaCogs,
  FaRocket,
  FaBuilding,
  FaCode,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Partners() {
  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-neutral-900">
            Our Ecosystem of <br />
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Trusted Partners
            </span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed mb-10">
            We collaborate with industry leaders to deliver the best possible
            solutions for our customers. Together, we are reshaping the future
            of appointment scheduling.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Become a Partner <FaHandshake />
          </Link>
        </div>
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary-100 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-secondary-100 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Associate Partner Section - Highlighted */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-primary-600 font-bold tracking-wider uppercase text-sm">
              Featured
            </span>
            <h2 className="text-3xl font-bold mt-2 text-neutral-900">
              Associate Partner
            </h2>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-primary-100 transform hover:-translate-y-1 transition-all duration-300">
            <div className="md:flex">
              <div className="md:w-2/5 bg-gradient-to-br from-neutral-900 to-neutral-800 p-10 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur rounded-xl mx-auto flex items-center justify-center mb-4">
                    <FaCode className="text-4xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Tigrid Technologies
                  </h3>
                  <div className="text-neutral-400 text-sm">
                    Technology Solutions
                  </div>
                </div>
              </div>
              <div className="md:w-3/5 p-10 flex flex-col justify-center">
                <p className="text-neutral-600 text-lg mb-6 leading-relaxed">
                  Tigrid Technologies is a premier software development firm
                  specializing in scalable enterprise architectures. As our
                  Associate Partner, they help power the core infrastructure
                  that keeps Slotcore running smoothly and securely.
                </p>
                <div className="flex flex-wrap gap-3 mb-8">
                  <span className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-sm font-medium">
                    Cloud Infrastructure
                  </span>
                  <span className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-sm font-medium">
                    Security
                  </span>
                  <span className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-sm font-medium">
                    AI Integration
                  </span>
                </div>
                <div>
                  <a
                    href="https://tigrid.in"
                    className="text-primary-600 font-bold hover:text-primary-700 inline-flex items-center gap-2 group"
                  >
                    Visit Website{" "}
                    <FaGlobe className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Partners Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-neutral-900">
              Strategic Alliances
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Global companies that trust and integrate with our platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <PartnerCard
              name="Global Payments Inc."
              category="FinTech"
              description="Providing secure and seamless payment processing for millions of transactions daily."
              icon={<FaCreditCard />}
            />
            <PartnerCard
              name="CloudScale Systems"
              category="Hosting"
              description="Ensuring 99.99% uptime and global availability for our booking engine."
              icon={<FaRocket />}
            />
            <PartnerCard
              name="Enterpise Solutions"
              category="Consulting"
              description="Helping large organizations digitally transform their scheduling workflows."
              icon={<FaBuilding />}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-neutral-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to grow with us?
          </h2>
          <p className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto">
            Join our partner program and unlock exclusive benefits, revenue
            sharing, and technical support.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-4 rounded-xl bg-white text-neutral-900 font-bold hover:bg-neutral-100 transition-colors"
            >
              Apply for Partnership
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 rounded-xl border border-neutral-700 hover:border-white transition-colors text-white font-medium"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper Component for other partners
function PartnerCard({ name, category, description, icon }) {
  // Placeholder icon mapping if passed icon is just a name, but we are passing React Nodes here.
  return (
    <div className="p-8 rounded-2xl border border-neutral-100 hover:shadow-lg transition-shadow bg-neutral-50 group hover:border-primary-100">
      <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-xl text-neutral-400 group-hover:text-primary-600 transition-colors mb-6">
        {React.isValidElement(icon) ? icon : <FaCogs />}
      </div>
      <div className="text-xs font-bold text-primary-600 uppercase tracking-wide mb-2">
        {category}
      </div>
      <h3 className="text-xl font-bold text-neutral-900 mb-3">{name}</h3>
      <p className="text-neutral-600 text-sm leading-relaxed mb-6">
        {description}
      </p>
    </div>
  );
}

// Icon placeholder helper needed for the first card
function FaCreditCard() {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 576 512"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 432c0 26.5 21.5 48 48 48h480c26.5 0 48-21.5 48-48V256H0v176zm192-68c0-6.6 5.4-12 12-12h136c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H204c-6.6 0-12-5.4-12-12v-40zm-128 0c0-6.6 5.4-12 12-12h72c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zM576 80c0-26.5-21.5-48-48-48H48C21.5 32 0 53.5 0 80v96h576V80z"></path>
    </svg>
  );
}
