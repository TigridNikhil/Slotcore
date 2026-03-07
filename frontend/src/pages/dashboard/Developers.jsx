import React, { useEffect, useState } from "react";
import {
  FaKey,
  FaGlobe,
  FaBook,
  FaCode,
  FaPlus,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaCopy,
  FaExternalLinkAlt,
  FaTerminal,
} from "react-icons/fa";
import { axiosInstance } from "../../utils/baseurl";
import { motion, AnimatePresence } from "framer-motion";

export default function Developers() {
  const [activeTab, setActiveTab] = useState("keys");
  const [keys, setKeys] = useState([]);
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [showNewWebhookModal, setShowNewWebhookModal] = useState(false);

  // New Key Form
  const [keyForm, setKeyForm] = useState({
    name: "",
    type: "secret",
    environment: "test",
  });
  // New Webhook Form
  const [webhookForm, setWebhookForm] = useState({
    url: "",
    description: "",
    events: ["*"],
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [keysRes, webhooksRes] = await Promise.all([
        axiosInstance.get("/developers/keys"),
        axiosInstance.get("/developers/webhooks"),
      ]);
      setKeys(keysRes.data.data);
      setWebhooks(webhooksRes.data.data);
    } catch (err) {
      console.error("Failed to fetch developer data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateKey = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/developers/keys", keyForm);
      setShowNewKeyModal(false);
      setKeyForm({ name: "", type: "secret", environment: "test" });
      fetchData();
    } catch (err) {
      alert("Failed to create API key");
    }
  };

  const handleDeleteKey = async (id) => {
    if (
      !window.confirm(
        "Are you sure? Applications using this key will stop working.",
      )
    )
      return;
    try {
      await axiosInstance.delete(`/developers/keys/${id}`);
      fetchData();
    } catch (err) {
      alert("Failed to delete key");
    }
  };

  const handleCreateWebhook = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/developers/webhooks", webhookForm);
      setShowNewWebhookModal(false);
      setWebhookForm({ url: "", description: "", events: ["*"] });
      fetchData();
    } catch (err) {
      alert("Failed to create webhook");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="pb-12 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <FaCode className="text-indigo-600" /> Developer Hub
        </h2>
        <p className="text-gray-500 mt-2 text-lg">
          Manage your API credentials, webhooks, and explore our scheduling
          infrastructure.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
        {[
          { id: "keys", label: "API Keys", icon: <FaKey /> },
          { id: "webhooks", label: "Webhooks", icon: <FaGlobe /> },
          { id: "sdk", label: "SDK & Documentation", icon: <FaBook /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "keys" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            key="keys"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                API Credentials
              </h3>
              <button
                onClick={() => setShowNewKeyModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-200"
              >
                <FaPlus /> Create New Key
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Key</th>
                    <th className="px-6 py-4">Env</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Last Used</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {keys.map((key) => (
                    <tr
                      key={key.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">
                          {key.name}
                        </div>
                        <div className="text-xs text-gray-400 capitalize">
                          {key.type}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 font-mono text-sm bg-gray-100 px-3 py-1 rounded-lg w-fit">
                          {key.key.substring(0, 8)}...
                          <button
                            onClick={() => copyToClipboard(key.key)}
                            className="text-gray-400 hover:text-indigo-600"
                          >
                            <FaCopy size={12} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            key.environment === "live"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {key.environment}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {key.isActive ? (
                          <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                            <FaCheckCircle size={12} /> Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-500 text-sm font-medium">
                            <FaTimesCircle size={12} /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {key.lastUsedAt
                          ? new Date(key.lastUsedAt).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteKey(key.id)}
                          className="text-red-400 hover:text-red-600 p-2"
                        >
                          <FaTrash size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {keys.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-12 text-center text-gray-400"
                      >
                        No API keys found. Create one to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === "webhooks" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            key="webhooks"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Webhooks</h3>
              <button
                onClick={() => setShowNewWebhookModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-200"
              >
                <FaPlus /> Add Endpoint
              </button>
            </div>

            <div className="grid gap-6">
              {webhooks.map((webhook) => (
                <div
                  key={webhook.id}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-gray-900 flex items-center gap-2">
                        {webhook.url}
                        {webhook.isActive && (
                          <FaCheckCircle className="text-green-500 text-xs" />
                        )}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {webhook.description || "No description provided"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-indigo-600 text-sm font-bold hover:underline">
                        Test
                      </button>
                      <button
                        onClick={() => handleDeleteKey(webhook.id)}
                        className="text-red-500 text-sm font-bold hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {webhook.events.map((event) => (
                      <span
                        key={event}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-mono font-bold"
                      >
                        {event}
                      </span>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-gray-50 flex items-center gap-4">
                    <div className="text-xs text-gray-400">
                      Signing Secret:{" "}
                      <code className="bg-gray-50 px-2 py-0.5 rounded ml-1">
                        whsec_••••••••
                      </code>
                    </div>
                  </div>
                </div>
              ))}
              {webhooks.length === 0 && (
                <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-dashed border-gray-200">
                  Listen to real-time events like booking.created by adding a
                  webhook endpoint.
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "sdk" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            key="sdk"
            className="space-y-8"
          >
            <div className="bg-gray-900 rounded-2xl p-8 text-white shadow-2xl overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <FaTerminal className="text-indigo-400" /> Slotcore.js SDK
                </h3>
                <p className="text-gray-400 mb-6 max-w-2xl">
                  The most powerful way to integrate scheduling into your
                  application. Supports both Node.js and Browser-based
                  environments.
                </p>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="bg-white text-black px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
                  >
                    Documentation <FaExternalLinkAlt size={12} />
                  </a>
                  <button className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-xl text-sm font-bold">
                    View on GitHub
                  </button>
                </div>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <FaCode size={200} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-4">
                  Getting Started (NPM)
                </h4>
                <div className="bg-gray-50 p-4 rounded-xl font-mono text-sm text-gray-700 mb-4 border border-gray-100">
                  npm install @slotcore/sdk
                </div>
                <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs text-indigo-300">
                  {`const Slotcore = require('@slotcore/sdk');\nconst slotcore = new Slotcore('sk_test_...');`}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-4">
                  Headless Widget (CDN)
                </h4>
                <div className="bg-gray-50 p-4 rounded-xl font-mono text-sm text-gray-700 mb-4 border border-gray-100 truncate">
                  {`<script src="https://cdn.slotcore.com/v1/widget.js"></script>`}
                </div>
                <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs text-indigo-300">
                  {`<slotcore-widget \n  org-id="your_org_id" \n  theme="premium"\n></slotcore-widget>`}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals - Simplified for now */}
      {showNewKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Create API Key</h3>
            <form onSubmit={handleCreateKey} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Key Name
                </label>
                <input
                  type="text"
                  value={keyForm.name}
                  onChange={(e) =>
                    setKeyForm({ ...keyForm, name: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Production Web App"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={keyForm.type}
                    onChange={(e) =>
                      setKeyForm({ ...keyForm, type: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none"
                  >
                    <option value="secret">Secret</option>
                    <option value="public">Public</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Environment
                  </label>
                  <select
                    value={keyForm.environment}
                    onChange={(e) =>
                      setKeyForm({ ...keyForm, environment: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none"
                  >
                    <option value="test">Test</option>
                    <option value="live">Live</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewKeyModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showNewWebhookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Add Webhook Endpoint</h3>
            <form onSubmit={handleCreateWebhook} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Endpoint URL
                </label>
                <input
                  type="url"
                  value={webhookForm.url}
                  onChange={(e) =>
                    setWebhookForm({ ...webhookForm, url: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="https://your-api.com/webhooks"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={webhookForm.description}
                  onChange={(e) =>
                    setWebhookForm({
                      ...webhookForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none"
                  placeholder="Main production endpoint"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Events
                </label>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked
                    readOnly
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700 font-medium">
                    All events (Wildcard)
                  </span>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewWebhookModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                >
                  Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
