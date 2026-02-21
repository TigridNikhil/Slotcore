import { useState, useEffect } from "react";
import { FaWhatsapp, FaSms, FaSave } from "react-icons/fa";
import { axiosInstance } from "../../utils/baseurl";
import { showNotification } from "../../utils/toastmessage";

export default function NotificationSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    enableSMS: false,
    enableWhatsApp: false,
    senderId: "",
    whatsappTemplateId: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axiosInstance.get("/notifications/settings");
      setSettings(res.data.data);
    } catch (error) {
      console.error(error);
      showNotification({ type: "ERROR", message: "Failed to load settings" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setSettings({ ...settings, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.put("/notifications/settings", settings);
      showNotification({
        type: "SUCCESS",
        message: "Notification settings updated",
      });
    } catch (error) {
      console.error(error);
      showNotification({ type: "ERROR", message: "Failed to update settings" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Notification Settings
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* WhatsApp Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <FaWhatsapp size={24} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    WhatsApp Integration
                  </h3>
                  <p className="text-sm text-gray-500">
                    Send booking confirmations via WhatsApp
                  </p>
                </div>
                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input
                    type="checkbox"
                    name="enableWhatsApp"
                    id="toggle-whatsapp"
                    checked={settings.enableWhatsApp}
                    onChange={handleChange}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300 checked:right-0 checked:border-green-400"
                    style={{
                      right: settings.enableWhatsApp ? 0 : "auto",
                      left: settings.enableWhatsApp ? "auto" : 0,
                    }}
                  />
                  <label
                    htmlFor="toggle-whatsapp"
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                      settings.enableWhatsApp ? "bg-green-400" : "bg-gray-300"
                    }`}
                  ></label>
                </div>
              </div>

              {settings.enableWhatsApp && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Template ID
                    </label>
                    <input
                      type="text"
                      name="whatsappTemplateId"
                      value={settings.whatsappTemplateId || ""}
                      onChange={handleChange}
                      placeholder="e.g. booking_confirm_v1"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Integration requires a configured Business API provider
                    (Interakt/Wati).
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SMS Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <FaSms size={24} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    SMS Notifications
                  </h3>
                  <p className="text-sm text-gray-500">
                    Send SMS alerts for urgent updates
                  </p>
                </div>
                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input
                    type="checkbox"
                    name="enableSMS"
                    id="toggle-sms"
                    checked={settings.enableSMS}
                    onChange={handleChange}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300"
                    style={{
                      right: settings.enableSMS ? 0 : "auto",
                      left: settings.enableSMS ? "auto" : 0,
                    }}
                  />
                  <label
                    htmlFor="toggle-sms"
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                      settings.enableSMS ? "bg-blue-400" : "bg-gray-300"
                    }`}
                  ></label>
                </div>
              </div>

              {settings.enableSMS && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sender ID
                    </label>
                    <input
                      type="text"
                      name="senderId"
                      value={settings.senderId || ""}
                      onChange={handleChange}
                      placeholder="e.g. SLOTYB"
                      maxLength="6"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 disabled:opacity-50"
          >
            <FaSave /> {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
