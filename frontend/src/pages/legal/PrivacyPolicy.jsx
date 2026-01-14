import React from "react";
import { Link } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";

export default function PrivacyPolicy() {
  return (
    <div className="py-12 bg-neutral-50 text-neutral-900">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 md:p-12">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 text-green-600 mb-4">
              <FaShieldAlt className="text-xl" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-neutral-500">Last updated: January 12, 2026</p>
          </div>

          <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-primary-600">
            <section className="mb-8">
              <h2>1. Introduction</h2>
              <p>
                Slotcore Inc. ("Slotcore," "we," "us," or "our") respects your
                privacy and is committed to protecting your personal data. This
                Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you access or use our booking
                and management platform.
              </p>
            </section>

            <section className="mb-8">
              <h2>2. Information We Collect</h2>
              <p>
                We collect information to provide better services to all our
                users. The types of information we collect include:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  <strong>Personal Identification Information:</strong> Name,
                  email address, phone number, and billing information when you
                  register.
                </li>
                <li>
                  <strong>Business Information:</strong> Organization name,
                  service offerings, staff details, and scheduling data.
                </li>
                <li>
                  <strong>Usage Data:</strong> Information on how you use the
                  Services, including log data, device information, and IP
                  addresses.
                </li>
                <li>
                  <strong>Client Data:</strong> Data about your clients that you
                  input into the system for booking purposes. You retain
                  ownership of this data.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2>3. How We Use Your Information</h2>
              <p>
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>To provide, operate, and maintain our Services.</li>
                <li>To process transactions and manage your subscription.</li>
                <li>
                  To send you updates, security alerts, and support messages.
                </li>
                <li>To improve our Services through analytics and research.</li>
                <li>To comply with legal obligations and prevent fraud.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2>4. Data Sharing and Disclosure</h2>
              <p>
                We do not sell your personal data. We may share your information
                only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  <strong>Service Providers:</strong> With third-party vendors
                  who perform services on our behalf (e.g., payment processing,
                  hosting).
                </li>
                <li>
                  <strong>Legal Requirements:</strong> If required to do so by
                  law or in response to valid requests by public authorities.
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with a
                  merger, sale, or asset transfer, subject to confidentiality
                  agreements.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2>5. Data Security</h2>
              <p>
                We employ industry-standard security measures to protect your
                data. This includes 256-bit SSL encryption for data in transit
                and at rest, strict access controls, and regular SOC 2
                compliance audits. However, no method of transmission over the
                internet is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2>6. Your Rights (GDPR & CCPA)</h2>
              <p>
                Depending on your location, you may have the following rights
                regarding your personal data:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>The right to access and receive a copy of your data.</li>
                <li>The right to rectify or update inaccurate data.</li>
                <li>
                  The right to request deletion of your data (Right to be
                  Forgotten).
                </li>
                <li>The right to restrict or object to processing.</li>
                <li>The right to data portability.</li>
              </ul>
              <p className="mt-4">
                To exercise any of these rights, please contact our Data
                Protection Officer at privacy@slotcore.com.
              </p>
            </section>

            <section className="mb-8">
              <h2>7. Changes to This Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2>8. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at privacy@slotcore.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
