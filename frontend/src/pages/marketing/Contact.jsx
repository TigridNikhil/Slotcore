import React, { useState } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaClock,
} from "react-icons/fa";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-neutral-50 min-h-screen py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900">
            Get in Touch
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200 h-full">
              <h3 className="text-2xl font-bold mb-8 text-neutral-900">
                Contact Information
              </h3>

              <div className="space-y-6">
                <ContactInfoItem
                  icon={<FaPhone />}
                  title="Phone"
                  content="+1 (555) 123-4567"
                  sub="Mon-Fri from 9am to 6pm EST"
                />
                <ContactInfoItem
                  icon={<FaEnvelope />}
                  title="Email"
                  content="hello@slotcore.com"
                  sub="We usually reply within 24 hours"
                />
                <ContactInfoItem
                  icon={<FaMapMarkerAlt />}
                  title="Office"
                  content="100 Innovation Dr."
                  sub="San Francisco, CA 94103"
                />
                <ContactInfoItem
                  icon={<FaClock />}
                  title="Support Hours"
                  content="24/7 Support"
                  sub="For Enterprise customers"
                />
              </div>

              <div className="mt-10 pt-10 border-t border-neutral-100">
                <div className="h-48 rounded-xl bg-neutral-100 w-full flex items-center justify-center text-neutral-400 text-sm">
                  Map Placeholder
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-neutral-200">
              {submitted ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                    <FaPaperPlane />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-neutral-600 mb-8">
                    Thanks for reaching out. We'll get back to you shortly.
                  </p>
                  <Button onClick={() => setSubmitted(false)} variant="outline">
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Input
                        label="Full Name"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Input
                      label="Subject"
                      name="subject"
                      placeholder="How can we help?"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows="6"
                      className="block w-full rounded-lg border-neutral-200 bg-white text-neutral-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-4 placeholder:text-neutral-400"
                      placeholder="Tell us more about your inquiry..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      loading={loading}
                      size="lg"
                      className="w-full md:w-auto px-8"
                    >
                      <span className="flex items-center gap-2">
                        Send Message <FaPaperPlane className="text-xs" />
                      </span>
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactInfoItem({ icon, title, content, sub }) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex-shrink-0 flex items-center justify-center text-lg">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-neutral-900 text-sm mb-0.5">{title}</h4>
        <div className="text-neutral-700 font-medium">{content}</div>
        <div className="text-neutral-500 text-xs mt-0.5">{sub}</div>
      </div>
    </div>
  );
}
