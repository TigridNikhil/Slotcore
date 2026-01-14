import React from "react";
import { Link } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";

export default function TermsOfService() {
  return (
    <div className="py-12 bg-neutral-50 text-neutral-900">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 md:p-12">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 text-primary-600 mb-4">
              <FaShieldAlt className="text-xl" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-neutral-500">Last updated: January 12, 2026</p>
          </div>

          <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-primary-600">
            <section className="mb-8">
              <h2>1. Introduction</h2>
              <p>
                Welcome to Slotcore. By accessing or using our website and
                services, you agree to be bound by these Terms of Service and
                our Privacy Policy. If you do not agree to these terms, please
                do not access or use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2>2. Definitions</h2>
              <p>
                "Slotcore," "we," "us," or "our" refers to Slotcore Inc. "You,"
                "your," or "User" refers to the individual or entity accessing
                or using our services. "Services" means the appointment booking,
                scheduling, and management platform provided by Slotcore.
              </p>
            </section>

            <section className="mb-8">
              <h2>3. Account Registration</h2>
              <p>
                To access certain features of the Services, you must register
                for an account. You agree to provide accurate, current, and
                complete information during the registration process and to
                update such information to keep it accurate, current, and
                complete. You are responsible for safeguarding your password and
                for all activities that occur under your account.
              </p>
            </section>

            <section className="mb-8">
              <h2>4. Use of Services</h2>
              <p>
                You agree to use the Services only for lawful purposes and in
                accordance with these Terms. You allow Slotcore to process data
                on your behalf to facilitate appointments and manage your
                business operations. You serve as the data controller for your
                client's data, and Slotcore serves as the data processor.
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  You strictly prohibited from using the service for illegal
                  activities.
                </li>
                <li>
                  You must not attempt to interfere with or disrupt the
                  integrity or performance of the Services.
                </li>
                <li>
                  You must not attempt to gain unauthorized access to the
                  Services or related systems or networks.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2>5. Subscription and Payments</h2>
              <p>
                Slotcore offers subscription-based access to its premium
                features. By subscribing, you agree to pay the fees applicable
                to your selected plan. All fees are non-refundable except as
                required by law. We reserve the right to change our pricing at
                any time with reasonable notice.
              </p>
            </section>

            <section className="mb-8">
              <h2>6. Data Privacy and Security</h2>
              <p>
                Your privacy is important to us. Please review our{" "}
                <Link to="/privacy">Privacy Policy</Link> to understand how we
                collect, use, and share your information. We implement
                industry-standard security measures, including 256-bit
                encryption and SOC 2 compliance, to protect your data.
              </p>
            </section>

            <section className="mb-8">
              <h2>7. Termination</h2>
              <p>
                We may terminate or suspend your account and access to the
                Services immediately, without prior notice or liability, for any
                reason, including without limitation if you breach these Terms.
                Upon termination, your right to use the Services will
                immediately cease.
              </p>
            </section>

            <section className="mb-8">
              <h2>8. Limitation of Liability</h2>
              <p>
                In no event shall Slotcore, its directors, employees, partners,
                agents, suppliers, or affiliates, be liable for any indirect,
                incidental, special, consequential or punitive damages,
                including without limitation, loss of profits, data, use,
                goodwill, or other intangible losses, resulting from your access
                to or use of or inability to access or use the Services.
              </p>
            </section>

            <section className="mb-8">
              <h2>9. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. We will provide notice of any
                significant changes. By continuing to access or use our Services
                after those revisions become effective, you agree to be bound by
                the revised terms.
              </p>
            </section>

            <section>
              <h2>10. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us
                at legal@slotcore.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
