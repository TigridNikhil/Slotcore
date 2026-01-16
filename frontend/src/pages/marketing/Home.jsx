import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaChartLine,
  FaMagic,
  FaUsers,
  FaCheckCircle,
  FaShieldAlt,
  FaGlobe,
  FaHeadset,
  FaRocket,
  FaStar,
  FaArrowRight,
} from "react-icons/fa";
import { SiTrustpilot } from "react-icons/si";

export default function Home() {
  return (
    <>
      {/* Enhanced Hero Section */}
      <section className="">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-gradient-to-r from-primary-100/20 to-secondary-100/20 blur-3xl rounded-full" />

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-100 text-primary-700 text-sm font-semibold">
            <FaRocket className="text-primary-600" />
            <span>v2.0 Launch • New AI Features Available</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-primary-600 via-secondary-500 to-primary-600 bg-clip-text text-transparent">
              Intelligent Booking
            </span>
            <br className="hidden md:block" />
            <span className="text-neutral-900">for Modern Enterprises</span>
          </h1>

          <p className="text-xl text-neutral-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            The complete platform to manage appointments, customers, and
            payments. Built for scalability, designed for elegance, engineered
            for growth.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link
              to="/register"
              className="group px-8 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold hover:shadow-2xl transition-all shadow-xl flex items-center justify-center gap-3"
            >
              <span>Start Free 14-Day Trial</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 rounded-xl bg-white border border-neutral-200 text-neutral-700 hover:border-primary-300 hover:shadow-lg transition-all shadow-sm flex items-center justify-center gap-3"
            >
              <FaHeadset />
              <span>Schedule a Demo</span>
            </Link>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-20 mx-auto max-w-6xl relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl blur opacity-20"></div>
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-neutral-200 bg-white">
              <div className="flex items-center justify-between p-4 border-b border-neutral-100 bg-neutral-50">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-sm text-neutral-500 font-medium">
                  slotcore.com/dashboard
                </div>
                <div className="w-20"></div>
              </div>
              <div className="bg-gradient-to-brfrom-neutral-50 to-white p-12 flex items-center justify-center">
                <div className="text-center">
                  <img
                    src="/dashboard.png"
                    alt="Slotcore Dashboard"
                    className="h-full w-full object-cover"
                  />{" "}
                  <div className="mt-4"></div>
                  <div className="text-lg font-semibold text-neutral-700">
                    Interactive Dashboard Preview
                  </div>
                  <div className="text-neutral-500 mt-2">
                    Real-time analytics & booking management
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <div className="py-8 bg-white border-y border-neutral-100">
        <div className="container mx-auto px-6">
          <div className="text-center text-neutral-500 text-sm font-medium mb-6">
            TRUSTED BY THOUSANDS OF BUSINESSES WORLDWIDE
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-center">
            {[
              "TechCorp",
              "MediCare",
              "EduSoft",
              "RetailPlus",
              "ServicePro",
            ].map((company) => (
              <div
                key={company}
                className="text-neutral-400 font-bold text-xl text-center"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Features Grid */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-neutral-900">
              Enterprise-Grade Features
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto text-lg">
              Everything you need to scale your booking operations efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <PremiumFeatureCard
              icon={<FaMagic className="text-primary-600" />}
              title="AI-Powered Scheduling"
              desc="Intelligent calendar optimization and automated scheduling suggestions"
              gradient="from-primary-50 to-primary-100"
            />
            <PremiumFeatureCard
              icon={<FaUsers className="text-secondary-600" />}
              title="Team Collaboration"
              desc="Real-time team scheduling, role-based permissions, and collaborative tools"
              gradient="from-secondary-50 to-secondary-100"
            />
            <PremiumFeatureCard
              icon={<FaChartLine className="text-emerald-600" />}
              title="Advanced Analytics"
              desc="Deep insights with predictive analytics and custom reporting dashboards"
              gradient="from-emerald-50 to-emerald-100"
            />
            <PremiumFeatureCard
              icon={<FaCalendarAlt className="text-purple-600" />}
              title="Custom Booking Pages"
              desc="Fully branded booking experiences with your domain and design system"
              gradient="from-purple-50 to-purple-100"
            />
            <PremiumFeatureCard
              icon={<FaShieldAlt className="text-blue-600" />}
              title="Enterprise Security"
              desc="SOC 2 compliant, GDPR ready, and advanced data protection"
              gradient="from-blue-50 to-blue-100"
            />
            <PremiumFeatureCard
              icon={<FaGlobe className="text-orange-600" />}
              title="Global Infrastructure"
              desc="Multi-region deployment with 99.9% uptime SLA"
              gradient="from-orange-50 to-orange-100"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary-50 to-secondary-50 border-y border-neutral-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatCard number="10M+" label="Appointments Booked" />
            <StatCard number="50K+" label="Active Businesses" />
            <StatCard
              number="99.9%"
              label="Uptime SLA"
              icon={<FaCheckCircle className="text-green-500" />}
            />
            <StatCard
              number="4.9/5"
              label="Customer Rating"
              icon={<SiTrustpilot className="text-orange-500" />}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-neutral-900">
              Loved by Industry Leaders
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              See what our customers have to say about their experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Sarah Johnson"
              role="CTO, HealthTech Solutions"
              content="Slotcore reduced our booking-related support tickets by 80%. The AI features alone saved us 20 hours per week."
              rating={5}
            />
            <TestimonialCard
              name="Michael Chen"
              role="Operations Director, RetailChain"
              content="The enterprise features and API flexibility allowed us to integrate seamlessly with our existing systems."
              rating={5}
            />
            <TestimonialCard
              name="Elena Rodriguez"
              role="CEO, ServicePro Network"
              content="Our booking conversion rate increased by 45% after implementing Slotcore's smart scheduling features."
              rating={5}
            />
          </div>
        </div>
      </section>
    </>
  );
}

// Premium Feature Card Component
function PremiumFeatureCard({ icon, title, desc, gradient }) {
  return (
    <div className="group p-8 rounded-2xl bg-white border border-neutral-200 hover:border-primary-300 transition-all duration-300 hover:shadow-xl">
      <div
        className={`mb-6 p-4 rounded-xl bg-gradient-to-br ${gradient} w-16 h-16 flex items-center justify-center`}
      >
        <div className="text-2xl">{icon}</div>
      </div>
      <h3 className="text-2xl font-bold mb-4 text-neutral-900">{title}</h3>
      <p className="text-neutral-600 leading-relaxed mb-6">{desc}</p>
      <button className="text-primary-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
        Learn more
        <FaArrowRight className="text-sm" />
      </button>
    </div>
  );
}

// Stat Card Component
function StatCard({ number, label, icon }) {
  return (
    <div className="text-center p-6 rounded-xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-sm">
      <div className="text-4xl font-bold text-neutral-900 mb-2 flex items-center justify-center gap-2">
        {icon && icon}
        {number}
      </div>
      <div className="text-neutral-600 font-medium">{label}</div>
    </div>
  );
}

// Testimonial Card Component
function TestimonialCard({ name, role, content, rating }) {
  return (
    <div className="p-8 rounded-2xl bg-gradient-to-br from-white to-neutral-50 border border-neutral-200 shadow-sm">
      <div className="flex gap-1 mb-6">
        {[...Array(rating)].map((_, i) => (
          <FaStar key={i} className="text-yellow-400 fill-current" />
        ))}
      </div>
      <p className="text-neutral-700 text-lg mb-8 italic">"{content}"</p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
          {name.charAt(0)}
        </div>
        <div>
          <div className="font-bold text-neutral-900">{name}</div>
          <div className="text-primary-600 text-sm font-medium">{role}</div>
        </div>
      </div>
    </div>
  );
}

// Footer Link Component
function FooterLink({ href, children }) {
  return (
    <li>
      <a
        href={href}
        className="text-neutral-400 hover:text-white transition-colors hover:pl-2 block duration-200"
      >
        {children}
      </a>
    </li>
  );
}

// Social Icon Component
function SocialIcon() {
  return (
    <div className="w-10 h-10 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center cursor-pointer transition-colors">
      <div className="w-4 h-4 bg-neutral-400 rounded-full"></div>
    </div>
  );
}
