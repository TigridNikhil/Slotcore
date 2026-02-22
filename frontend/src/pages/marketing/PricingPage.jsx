import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCheck,
  FaTimes,
  FaRocket,
  FaBuilding,
  FaGem,
  FaArrowRight,
  FaQuestionCircle,
} from "react-icons/fa";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState("yearly");

  const plans = [
    {
      name: "Starter",
      description: "For solo professionals getting started",
      monthlyPrice: 499,
      yearlyPrice: 4999,
      features: [
        "1 User Account",
        "1 Location",
        "Up to 200 Appointments / month",
        "Basic Booking Page",
        "Email Notifications",
        "Pay at Venue Option",
      ],
      notIncluded: [
        "WhatsApp/SMS Reminders",
        "Online Payments",
        "Team Management",
        "Custom Branding",
      ],
      popular: false,
      icon: <FaRocket />,
      buttonVariant: "outline",
    },
    {
      name: "Growth",
      description: "For growing clinics & service teams",
      monthlyPrice: 999,
      yearlyPrice: 9999,
      features: [
        "Up to 5 Users",
        "3 Locations",
        "Unlimited Appointments",
        "WhatsApp Reminders",
        "Online Payments (3% platform fee)",
        "Basic Reporting",
        "Service-level & Staff-level Scheduling",
      ],
      notIncluded: ["White Label Domain", "Advanced Analytics", "API Access"],
      popular: true,
      icon: <FaBuilding />,
      buttonVariant: "primary",
    },
    {
      name: "Business",
      description: "For established service organizations",
      monthlyPrice: 1999,
      yearlyPrice: 19999,
      features: [
        "Up to 20 Users",
        "Unlimited Locations",
        "Everything in Growth",
        "Custom Domain (White Label)",
        "Advanced Analytics",
        "Priority Support",
        "Reduced Payment Fee (2%)",
      ],
      notIncluded: ["Custom Integrations", "Dedicated Account Manager"],
      popular: false,
      icon: <FaGem />,
      buttonVariant: "black",
    },
    {
      name: "Enterprise",
      description: "Custom solutions for large organizations",
      monthlyPrice: "Custom",
      yearlyPrice: "Custom",
      features: [
        "Unlimited Users",
        "Unlimited Locations",
        "Everything in Business",
        "API Access & Webhooks",
        "Dedicated Account Manager",
        "Custom Integrations",
      ],
      notIncluded: [],
      popular: false,
      icon: <FaBuilding />,
      buttonVariant: "outline",
    },
  ];

  return (
    <>
      {/* Hero Header */}
      <section className="pt-20 pb-10 text-center px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary-100/30 to-secondary-100/30 rounded-full blur-3xl -z-10"></div>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-neutral-500 max-w-2xl mx-auto mb-10">
          Choose the plan that best fits your business needs.
          <br className="hidden md:block" /> No hidden fees. Cancel anytime.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <span
            className={`text-sm font-semibold transition-colors ${
              billingCycle === "monthly"
                ? "text-neutral-900"
                : "text-neutral-500"
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() =>
              setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")
            }
            className="w-14 h-7 bg-neutral-200 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <div
              className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
                billingCycle === "yearly" ? "left-8 bg-primary-500" : "left-1"
              }`}
            ></div>
          </button>
          <span
            className={`text-sm font-semibold transition-colors flex items-center gap-2 ${
              billingCycle === "yearly"
                ? "text-neutral-900"
                : "text-neutral-500"
            }`}
          >
            Yearly
            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide">
              Save 20%
            </span>
          </span>
        </div>

        {/* Trial Banner */}
        <div className="mt-10 inline-flex items-center gap-3 bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-full px-6 py-3 shadow-sm">
          <span className="px-2.5 py-1 bg-primary-500 text-white text-xs font-bold rounded-full uppercase tracking-wide">
            New
          </span>
          <span className="text-sm font-semibold text-neutral-800">
            All paid plans include a{" "}
            <strong className="text-primary-600">30-day free trial</strong> with
            full features — no credit card required.
          </span>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="container mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-1 flex flex-col
                ${
                  plan.popular
                    ? "border-primary-500 shadow-xl scale-105 z-10"
                    : "border-neutral-200 shadow-sm hover:shadow-lg"
                }
              `}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-bold rounded-full shadow-lg">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-6">
                <div className="w-12 h-12 rounded-xl bg-neutral-50 flex items-center justify-center mb-4 text-2xl">
                  {plan.icon}
                </div>
                <h3 className="text-xl font-bold text-neutral-900">
                  {plan.name}
                </h3>
                <p className="text-sm text-neutral-500 mt-2 min-h-[40px]">
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                {typeof plan.monthlyPrice === "number" ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-neutral-900">
                      Rs.
                      {billingCycle === "monthly"
                        ? plan.monthlyPrice
                        : plan.yearlyPrice}
                    </span>
                    <span className="text-neutral-500">
                      /{billingCycle === "monthly" ? "mo" : "yr"}
                    </span>
                  </div>
                ) : (
                  <div className="text-4xl font-bold text-neutral-900">
                    Custom
                  </div>
                )}
                {billingCycle === "yearly" &&
                  typeof plan.monthlyPrice === "number" && (
                    <div className="text-xs text-green-600 font-medium mt-1">
                      Billed Rs. {plan.yearlyPrice} yearly
                    </div>
                  )}
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 text-sm text-neutral-700"
                  >
                    <FaCheck className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
                {plan.notIncluded.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 text-sm text-neutral-400"
                  >
                    <FaTimes className="mt-0.5 flex-shrink-0 opacity-50" />
                    <span className="line-through opacity-70">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2
                ${
                  plan.buttonVariant === "primary"
                    ? "bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:shadow-lg hover:from-primary-700 hover:to-secondary-700"
                    : plan.buttonVariant === "black"
                      ? "bg-neutral-900 text-white hover:bg-neutral-800"
                      : "bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50"
                }
              `}
              >
                {plan.name === "Enterprise"
                  ? "Contact Sales"
                  : "Start Free Trial"}
                <FaArrowRight className="text-xs" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-neutral-50 border-t border-neutral-200">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-neutral-500">
              Everything you need to know about our pricing and billing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <FaqItem
              q="Can I change plans later?"
              a="Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any payments."
            />
            <FaqItem
              q="Do you offer a free trial?"
              a="Absolutely! All paid plans come with a 30-day free trial with full features — no credit card required to start."
            />
            <FaqItem
              q="What payment methods do you accept?"
              a="We accept all major credit cards (Visa, Mastercard, Amex) and PayPal for business subscriptions."
            />
            <FaqItem
              q="Is my data secure?"
              a="Yes, we take security seriously. We use bank-level 256-bit encryption and are SOC 2 compliant to ensure your data is safe."
            />
          </div>
        </div>
      </section>
    </>
  );
}

function FaqItem({ q, a }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
      <h4 className="font-bold text-neutral-900 mb-2 flex items-start gap-3">
        <FaQuestionCircle className="text-primary-500 mt-1 flex-shrink-0" />
        {q}
      </h4>
      <p className="text-neutral-600 text-sm leading-relaxed pl-7">{a}</p>
    </div>
  );
}
