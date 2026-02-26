import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaMagic,
  FaUsers,
  FaCheckCircle,
  FaShieldAlt,
  FaGlobe,
  FaHeadset,
  FaRocket,
  FaStar,
  FaArrowRight,
  FaPlaystation,
  FaApple,
  FaMicrochip,
  FaCreditCard,
  FaLayerGroup,
} from "react-icons/fa";

export default function Home() {
  return (
    <div className="bg-white selection:bg-primary-100 selection:text-primary-900 font-sans">
      {/* Enhanced Hero Section */}
      <section className="relative pb-48 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-primary-50/50 via-secondary-50/30 to-transparent blur-3xl rounded-full -z-10" />

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-primary-100 shadow-sm text-primary-700 text-sm font-semibold animate-fade-in">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            <span>Scale your booking infrastructure with AI</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tight leading-[1.1]">
            <span className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 bg-clip-text text-transparent">
              Enterprise Booking
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Infrastructure
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-neutral-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Slotcore is the multi-tenant marketplace engine designed for modern
            enterprises. Build, scale, and automate your entire booking
            ecosystem with AI-powered efficiency.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-20">
            <Link
              to="/register"
              className="group px-10 py-5 rounded-2xl bg-neutral-900 text-white font-bold hover:bg-neutral-800 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center justify-center gap-3 active:scale-95"
            >
              <span>Get Started for Free</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="px-10 py-5 rounded-2xl bg-white border border-neutral-200 text-neutral-800 font-bold hover:border-neutral-300 hover:bg-neutral-50 transition-all shadow-sm flex items-center justify-center gap-3 active:scale-95"
            >
              <FaHeadset />
              <span>Request Enterprise Demo</span>
            </Link>
          </div>

          {/* Premium Dashboard Preview */}
          <div className="mx-auto max-w-6xl relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-[2.5rem] blur-3xl opacity-50"></div>
            <div className="relative rounded-3xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] border border-neutral-200 bg-white p-2">
              <div className="bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-100">
                <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-white">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-neutral-300"></div>
                    <div className="w-3 h-3 rounded-full bg-neutral-200"></div>
                    <div className="w-3 h-3 rounded-full bg-neutral-100"></div>
                  </div>
                  <div className="flex items-center gap-2 px-6 py-1.5 rounded-lg bg-neutral-50 border border-neutral-100 text-[11px] text-neutral-400 font-mono">
                    <FaShieldAlt className="text-neutral-300" />
                    app.slotcore.com/dashboard
                  </div>
                  <div className="w-20"></div>
                </div>
                <div className="bg-white p-4">
                  <img
                    src="/dashboard.png"
                    alt="Slotcore Enterprise Dashboard"
                    className="w-full rounded-xl shadow-inner border border-neutral-50"
                  />
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-10 -right-10 hidden lg:block">
              <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/50 flex flex-col gap-1 items-start">
                <div className="text-secondary-600 font-bold text-2xl">
                  4.9/5
                </div>
                <div className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">
                  Top Rated Engine
                </div>
                <div className="flex gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <FaStar key={i} className="text-yellow-400 text-[10px]" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-14 bg-neutral-50/50 border-y border-neutral-100">
        <div className="container mx-auto px-6 text-center">
          <p className="text-neutral-400 text-sm font-bold uppercase tracking-[0.2em] mb-12">
            The infrastructure powering tomorrow's leaders
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            {[
              "TechCorp",
              "MediCare",
              "EduSoft",
              "RetailPlus",
              "ServicePro",
            ].map((name) => (
              <span
                key={name}
                className="text-3xl font-black text-neutral-900 tracking-tighter uppercase"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid - The Engine */}
      <section id="features" className="py-40 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-24">
            <h2 className="text-indigo-600 font-bold tracking-widest uppercase text-sm mb-4">
              Core Capabilities
            </h2>
            <h3 className="text-5xl md:text-6xl font-black text-neutral-900 mb-8 leading-tight">
              Engineered for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">
                High-Growth
              </span>{" "}
              Organizations
            </h3>
            <p className="text-xl text-neutral-600 leading-relaxed font-medium">
              A complete suite of infrastructure tools to manage multi-tenant
              operations, marketplace discovery, and AI-driven automation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SaaSFeatureCard
              icon={<FaLayerGroup />}
              title="Multi-Tenant Core"
              desc="True data isolation per organization with automated subdomain provisioning (orgname.slotcore.com)."
              color="text-primary-600"
              bg="bg-primary-50"
            />
            <SaaSFeatureCard
              icon={<FaGlobe />}
              title="Marketplace Ecosystem"
              desc="Propel your reach with centralized marketplace discovery and organization-specific booking flows."
              color="text-indigo-600"
              bg="bg-indigo-50"
            />
            <SaaSFeatureCard
              icon={<FaMicrochip />}
              title="AI Studio"
              desc="Leverage GPT-4o for automated website building and bulk-generation of high-converting service content."
              color="text-secondary-600"
              bg="bg-secondary-50"
            />
            <SaaSFeatureCard
              icon={<FaCalendarAlt />}
              title="Engineered Scheduling"
              desc="Real-time slot availability with transactional conflict prevention and custom status lifecycles."
              color="text-emerald-600"
              bg="bg-emerald-50"
            />
            <SaaSFeatureCard
              icon={<FaCreditCard />}
              title="Monetization Layer"
              desc="Integrated Razorpay checkout with automated platform commissions and vendor ledger tracking."
              color="text-orange-600"
              bg="bg-orange-50"
            />
            <SaaSFeatureCard
              icon={<FaShieldAlt />}
              title="Access Control (RBAC)"
              desc="Enterprise-grade role-based access control with secure JWT tokens and detailed audit logging."
              color="text-blue-600"
              bg="bg-blue-50"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 bg-neutral-900 selection:bg-primary-500/30 selection:text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <StatItem number="10M+" label="API Requests/mo" />
            <StatItem number="50K+" label="Active Subdomains" />
            <StatItem number="99.99%" label="Engine Uptime" />
            <StatItem number="24/7" label="Global Support" />
          </div>
        </div>
      </section>

      {/* Mobile App Promo Section */}
      <section className="py-40 bg-neutral-900 relative overflow-hidden underline-offset-4">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-900/40 to-transparent pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-24">
            <div className="lg:w-1/2 text-left">
              <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-bold backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                <span>COMING SOON: SLOTIFY MOBILE</span>
              </div>

              <h2 className="text-5xl md:text-7xl font-black mb-8 text-white leading-none tracking-tighter">
                Infrastructure <br />
                <span className="text-secondary-400">in your pocket.</span>
              </h2>

              <p className="text-xl text-neutral-400 mb-12 max-w-xl leading-relaxed">
                We're extending our backend engine to native mobile. Soon,
                organization admins will manage their entire dashboard with
                native-level performance.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <div className="flex-1 max-w-sm">
                  <div className="relative group">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-neutral-600 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                    />
                    <button className="absolute right-2.5 top-2.5 bottom-2.5 bg-white text-neutral-900 px-6 rounded-xl font-black text-sm hover:bg-neutral-100 transition-all active:scale-95">
                      JOIN WAITLIST
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3 text-neutral-500 font-bold group hover:text-white transition-colors cursor-default">
                  <FaApple className="text-3xl" />
                  <span className="text-sm tracking-widest uppercase">
                    iOS EXCLUSIVE
                  </span>
                </div>
                <div className="h-4 w-[1px] bg-neutral-800" />
                <div className="flex items-center gap-3 text-neutral-500 font-bold group hover:text-white transition-colors cursor-default">
                  <FaPlaystation className="text-3xl" />
                  <span className="text-sm tracking-widest uppercase">
                    ANDROID CORE
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 relative w-full mt-20 lg:mt-0">
              <div className="relative h-full w-full flex items-center justify-center">
                {/* Background images (older ones) */}
                <div className="absolute transform -rotate-12 -translate-x-40 opacity-30 hover:opacity-100 transition-all duration-500 hover:scale-105 hover:z-30">
                  <img
                    src="/signup.jpeg"
                    alt="Signup"
                    className="w-48 md:w-56 rounded-[2.5rem] shadow-2xl border-2 border-white/10"
                  />
                </div>
                <div className="absolute transform -rotate-6 -translate-x-24 opacity-50 hover:opacity-100 transition-all duration-500 hover:scale-105 hover:z-30">
                  <img
                    src="/bookingmodal.jpeg"
                    alt="Booking Modal"
                    className="w-48 md:w-56 rounded-[2.5rem] shadow-2xl border-2 border-white/10"
                  />
                </div>
                <div className="absolute transform rotate-0 -translate-x-0 opacity-70 hover:opacity-100 transition-all duration-500 hover:scale-105 hover:z-30">
                  <img
                    src="/bookingpage.jpeg"
                    alt="Booking Page"
                    className="w-48 md:w-56 rounded-[2.5rem] shadow-2xl border-2 border-white/10"
                  />
                </div>

                {/* Main focus images */}
                <div className="absolute transform rotate-6 translate-x-24 z-10 hover:z-30 transition-all duration-500 hover:scale-105">
                  <img
                    src="/dashboardmobileapp.jpeg"
                    alt="Dashboard"
                    className="w-48 md:w-56 rounded-[2.5rem] shadow-2xl border-4 border-primary-500/50"
                  />
                </div>
                <div className="absolute transform rotate-12 translate-x-40 z-20 hover:z-30 transition-all duration-500 hover:scale-105">
                  <img
                    src="/splashscreen.jpeg"
                    alt="Splash"
                    className="w-48 md:w-56 rounded-[2.5rem] shadow-2xl border-4 border-secondary-500/50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-40 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-black text-neutral-900 mb-6 tracking-tight leading-none">
              Trust by Infrastructure Leads
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto font-medium">
              Slotcore handles the complexity so you can focus on building your
              business.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <SaaSTestimonialCard
              name="Sarah Johnson"
              role="CTO @ HealthTech"
              content="Slotcore's multi-tenant architecture is the most robust we've seen. Provisioning new organizations takes seconds, not hours."
            />
            <SaaSTestimonialCard
              name="Michael Chen"
              role="VP Ops @ RetailHub"
              content="The marketplace ecosystem allowed us to scale our reach globally while maintaining brand consistency across subdomains."
            />
            <SaaSTestimonialCard
              name="Elena Rodriguez"
              role="Founder @ ServiceFlow"
              content="AI-powered service generation cut our manual entry time by 90%. It's more than a tool—it's an unfair advantage."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-10">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-7xl font-black text-white mb-10 tracking-tight leading-none">
                Ready to deploy your <br />
                <span className="text-primary-500">Booking Engine?</span>
              </h2>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link
                  to="/register"
                  className="px-12 py-6 rounded-2xl bg-white text-neutral-900 font-black hover:bg-neutral-100 transition-all flex items-center justify-center gap-3 text-lg"
                >
                  DEPLOY NOW <FaRocket />
                </Link>
                <Link
                  to="/contact"
                  className="px-12 py-6 rounded-2xl bg-white/10 text-white font-black hover:bg-white/20 transition-all flex items-center justify-center gap-3 backdrop-blur-md border border-white/10 text-lg"
                >
                  TALK TO SALES
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SaaSFeatureCard({ icon, title, desc, color, bg }) {
  return (
    <div className="group p-10 rounded-[2.5rem] bg-white border border-neutral-100 hover:border-neutral-200 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col items-start translate-y-0 hover:-translate-y-2">
      <div
        className={`mb-8 p-5 rounded-2xl ${bg} ${color} text-3xl transition-transform duration-500 group-hover:scale-110 shadow-sm`}
      >
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-4 text-neutral-900">{title}</h3>
      <p className="text-neutral-500 leading-relaxed font-medium mb-8 flex-grow">
        {desc}
      </p>
      <button className="text-neutral-900 font-bold flex items-center gap-2 group-hover:gap-4 transition-all uppercase text-xs tracking-widest">
        Explore Module{" "}
        <FaArrowRight className="text-xs opacity-50 transition-opacity group-hover:opacity-100" />
      </button>
    </div>
  );
}

function StatItem({ number, label }) {
  return (
    <div className="group flex flex-col items-center">
      <div className="text-5xl md:text-6xl font-black text-white mb-2 group-hover:text-primary-500 transition-colors duration-500 tabular-nums">
        {number}
      </div>
      <div className="text-neutral-500 text-xs font-bold uppercase tracking-[0.2em]">
        {label}
      </div>
    </div>
  );
}

function SaaSTestimonialCard({ name, role, content }) {
  return (
    <div className="p-12 rounded-[3.5rem] bg-neutral-50 border border-neutral-100 hover:bg-white hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] transition-all duration-500 h-full flex flex-col">
      <div className="flex gap-1 mb-8">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className="text-primary-500 text-xs" />
        ))}
      </div>
      <p className="text-neutral-800 text-xl font-bold mb-12 italic leading-relaxed flex-grow">
        "{content}"
      </p>
      <div className="flex items-center gap-5 pt-8 border-t border-neutral-200/50">
        <div className="w-14 h-14 rounded-2xl bg-neutral-900 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-neutral-950/20">
          {name.charAt(0)}
        </div>
        <div>
          <div className="font-black text-neutral-900 text-lg leading-tight">
            {name}
          </div>
          <div className="text-primary-600 text-sm font-bold tracking-tight">
            {role}
          </div>
        </div>
      </div>
    </div>
  );
}
