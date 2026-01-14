import React from "react";
import { FaUsers, FaLightbulb, FaRocket, FaHandshake } from "react-icons/fa";

export default function About() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-primary-50 to-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-neutral-900">
            Empowering Business <br />
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Through Intelligent Booking
            </span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            We're on a mission to simplify scheduling for everyone. From small
            businesses to large enterprises, Slotcore provides the tools to
            manage time effectively.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Team working together"
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-neutral-900">
                Our Story
              </h2>
              <p className="text-neutral-600 mb-6 leading-relaxed">
                Founded in 2024, Slotcore began with a simple observation:
                scheduling meetings and appointments was far too complicated. We
                saw businesses losing valuable time and money on administrative
                tasks that could be automated.
              </p>
              <p className="text-neutral-600 mb-6 leading-relaxed">
                What started as a simple calendar tool has grown into a
                comprehensive platform processing millions of bookings
                worldwide. Today, we're proud to serve thousands of businesses,
                helping them focus on what they do best while we handle the
                logistics.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="p-4 bg-neutral-50 rounded-xl">
                  <div className="text-3xl font-bold text-primary-600 mb-1">
                    2024
                  </div>
                  <div className="text-sm text-neutral-500">Year Founded</div>
                </div>
                <div className="p-4 bg-neutral-50 rounded-xl">
                  <div className="text-3xl font-bold text-primary-600 mb-1">
                    50k+
                  </div>
                  <div className="text-sm text-neutral-500">Active Users</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-neutral-900">
              Our Core Values
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              These principles guide every decision we make and every feature we
              build.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <ValueCard
              icon={<FaLightbulb />}
              title="Innovation"
              desc="We constantly push boundaries to find better solutions."
            />
            <ValueCard
              icon={<FaUsers />}
              title="Customer First"
              desc="Your success is our success. We prioritize your needs."
            />
            <ValueCard
              icon={<FaHandshake />}
              title="Integrity"
              desc="We believe in being transparent and honest in everything we do."
            />
            <ValueCard
              icon={<FaRocket />}
              title="Speed"
              desc="We move fast to deliver value and adapt to changes."
            />
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-neutral-900">
              Meet the Team
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              The passionate people behind Slotcore.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TeamMember
              name="Sarah Johnson"
              role="CEO & Founder"
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            />
            <TeamMember
              name="Michael Chen"
              role="CTO"
              image="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            />
            <TeamMember
              name="Emily Davis"
              role="Head of Product"
              image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function ValueCard({ icon, title, desc }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow text-center">
      <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-xl">
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-3 text-neutral-900">{title}</h3>
      <p className="text-neutral-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function TeamMember({ name, role, image }) {
  return (
    <div className="text-center">
      <img
        src={image}
        alt={name}
        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg"
      />
      <h3 className="font-bold text-xl text-neutral-900">{name}</h3>
      <p className="text-primary-600 font-medium">{role}</p>
    </div>
  );
}
