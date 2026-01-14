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
      description: "Perfect for independent professionals",
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        "1 User Account",
        "100 Appointments / mo",
        "Basic Calendar",
        "Email Notifications",
        "Mobile App Access",
      ],
      notIncluded: [
        "SMS Reminders",
        "Team Management",
        "Advanced Analytics",
        "API Access",
      ],
      icon: <FaRocket className="text-blue-500" />,
      buttonVariant: "outline",
      popular: false,
    },
    {
      name: "Growth",
      description: "For small teams scaling up",
      monthlyPrice: 29,
      yearlyPrice: 24,
      features: [
        "Up to 5 Users",
        "Unlimited Appointments",
        "Google/Outlook Sync",
        "SMS Reminders",
        "Client Portal",
        "Basic Reporting",
      ],
      notIncluded: ["White Labeling", "API Access", "Dedicated Support"],
      icon: <FaBuilding className="text-emerald-500" />,
      buttonVariant: "primary",
      popular: true,
    },
    {
      name: "Business",
      description: "Powering established clinics & agencies",
      monthlyPrice: 79,
      yearlyPrice: 65,
      features: [
        "Up to 20 Users",
        "Everything in Growth",
        "Advanced Analytics",
        "Payment Processing (0 fees)",
        "White Label Booking Page",
        "Priority Email Support",
      ],
      notIncluded: ["Custom Integrations", "SLA Guarantees"],
      icon: <FaGem className="text-purple-500" />,
      buttonVariant: "outline",
      popular: false,
    },
    {
      name: "Enterprise",
      description: "Tailored for large organizations",
      monthlyPrice: "Custom",
      yearlyPrice: "Custom",
      features: [
        "Unlimited Users",
        "Everything in Business",
        "Dedicated Account Manager",
        "SSO & Custom Security",
        "API Access & Webhooks",
        "99.9% Uptime SLA",
      ],
      notIncluded: [],
      icon: <FaBuilding className="text-neutral-500" />,
      buttonVariant: "black",
      popular: false,
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
                      $
                      {billingCycle === "monthly"
                        ? plan.monthlyPrice
                        : plan.yearlyPrice}
                    </span>
                    <span className="text-neutral-500">/mo</span>
                  </div>
                ) : (
                  <div className="text-4xl font-bold text-neutral-900">
                    Custom
                  </div>
                )}
                {billingCycle === "yearly" &&
                  typeof plan.monthlyPrice === "number" && (
                    <div className="text-xs text-green-600 font-medium mt-1">
                      Billed ${plan.yearlyPrice * 12} yearly
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
                {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
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
              a="Absolutely! All paid plans come with a 14-day free trial, no credit card required to start."
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
