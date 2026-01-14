import React, { useEffect, useState } from "react";
import {
  FaGoogle,
  FaMicrosoft,
  FaCheckCircle,
  FaTrash,
  FaPlug,
} from "react-icons/fa";
import { axiosInstance } from "../../utils/baseurl";

export default function Integrations() {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIntegrations = async () => {
    try {
      const response = await axiosInstance.get("/integrations");
      setIntegrations(response.data);
    } catch (err) {
      console.error("Failed to fetch integrations", err);
      // setError("Could not load integrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleConnect = async (provider) => {
    try {
      // 1. Get Auth URL
      const response = await axiosInstance.get(
        `/integrations/${provider}/auth-url`
      );
      const { url } = response.data;
      // 2. Redirect
      window.location.href = url;
    } catch (err) {
      console.error("Connect Error:", err);
      alert(err.response?.data?.error || "Failed to start connection");
    }
  };

  const handleDisconnect = async (provider) => {
    if (
      !window.confirm(
        "Are you sure you want to disconnect? This will stop syncing events."
      )
    )
      return;
    try {
      await axiosInstance.delete(`/integrations/${provider}`);
      fetchIntegrations(); // Refresh list
    } catch (err) {
      console.error("Disconnect Error:", err);
      alert("Failed to disconnect");
    }
  };

  const IntegrationCard = ({ provider, name, icon, description, color }) => {
    const integration = integrations.find(
      (i) => i.provider === provider && i.isActive
    );
    const isConnected = !!integration;

    return (
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${color} bg-opacity-10 text-3xl`}
        >
          {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500 mt-2 mb-6 h-10">{description}</p>

        {isConnected ? (
          <div className="w-full">
            <div className="flex items-center justify-center gap-2 text-green-600 font-medium text-sm mb-4 bg-green-50 py-1.5 rounded-full">
              <FaCheckCircle /> Connected
            </div>
            <button
              onClick={() => handleDisconnect(provider)}
              className="w-full border border-red-200 text-red-500 hover:bg-red-50 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <FaTrash size={12} /> Disconnect
            </button>
            {integration.lastSyncAt && (
              <p className="text-xs text-gray-400 mt-2">
                Last synced:{" "}
                {new Date(integration.lastSyncAt).toLocaleDateString()}
              </p>
            )}
          </div>
        ) : (
          <button
            onClick={() => handleConnect(provider)}
            className="w-full bg-gray-900 hover:bg-black text-white py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Connect
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="pb-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <FaPlug className="text-indigo-600" /> Integrations
        </h2>
        <p className="text-gray-500 mt-1">
          Connect your favorite tools to Slotcore
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <IntegrationCard
          provider="google"
          name="Google Calendar"
          icon={<FaGoogle className="text-red-500" />}
          description="Sync bookings automatically with your Google Calendar."
          color="bg-red-500"
        />
        <IntegrationCard
          provider="outlook"
          name="Outlook Calendar"
          icon={<FaMicrosoft className="text-blue-500" />}
          description="Keep your Outlook Calendar in sync with upcoming slots."
          color="bg-blue-500"
        />
      </div>
    </div>
  );
}
