import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateOrganization } from "../../operations/ai/aiAction";
import { axiosInstance } from "../../utils/baseurl";
import {
  FaPalette,
  FaCheckCircle,
  FaLaptopCode,
  FaNewspaper,
  FaFeather,
} from "react-icons/fa";
import ContentEditor from "./components/ContentEditor";
import AvailabilitySettings from "./components/AvailabilitySettings";

const templates = [
  {
    id: "modern",
    name: "Modern SaaS",
    description: "Clean, colorful, and friendly. Default style.",
    icon: <FaLaptopCode />,
  },
  {
    id: "classic",
    name: "Classic & Timeless",
    description: "Serif fonts, centered layout, trustworthy feel.",
    icon: <FaNewspaper />,
  },
  {
    id: "minimal",
    name: "Ultra Minimal",
    description: "Bold typography, monochrome, high fashion.",
    icon: <FaFeather />,
  },
];

export default function AppearanceSettings() {
  const dispatch = useDispatch();
  const { loading, successMessage, error } = useSelector((state) => state.ai);

  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [primaryColor, setPrimaryColor] = useState("#4F46E5");
  const [logoUrl, setLogoUrl] = useState("");
  const [sectionVisibility, setSectionVisibility] = useState({});
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState("appearance");
  const [orgData, setOrgData] = useState(null);

  // Fetch current settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axiosInstance.get("/organization/settings");
        if (res.data) {
          setOrgData(res.data);
          setPrimaryColor(res.data.primaryColor || "#4F46E5");
          setLogoUrl(res.data.logoUrl || "");
          setSelectedTemplate(res.data.settings?.template || "modern");
          setSectionVisibility(res.data.settings?.sectionVisibility || {});
        }
      } catch (err) {
        console.error("Failed to fetch settings", err);
      } finally {
        setFetching(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = () => {
    dispatch(
      updateOrganization({
        primaryColor,
        logoUrl,
        settings: {
          template: selectedTemplate,
          sectionVisibility,
        },
      })
    );
  };

  const handleContentSave = (data) => {
    dispatch(updateOrganization(data));
    // Optimistically update local state so editor doesn't flicker
    setOrgData((prev) => ({ ...prev, ...data, content: data.content }));
  };

  if (fetching)
    return (
      <div className="p-8 text-center text-gray-500">Loading settings...</div>
    );

  const currentSettings = {
    content: {
      // We need to merge existing content because the API returns it nested
      // But wait, we didn't save it to local state in useEffect except for parts?
      // Actually we only saved primaryColor and template.
      // We need to fetch the FULL content object to pass to editor.
      // Let's refactor the state slightly to hold the full 'orgData'.
    },
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
              <FaPalette className="text-2xl" />
            </div>
            Site Customization
          </h1>
          <p className="text-gray-500 mt-2">
            Manage the look, feel, and content of your landing page.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("appearance")}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === "appearance"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Design & Layout
          </button>
          <button
            onClick={() => setActiveTab("content")}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === "content"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Content Editor
          </button>
          {/* <button
            onClick={() => setActiveTab("availability")}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === "availability"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Availability
          </button> */}
        </div>
      </div>

      {successMessage && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-2 border border-green-200">
          <FaCheckCircle /> {successMessage}
        </div>
      )}

      {activeTab === "appearance" ? (
        <div className="space-y-8 animate-fade-in">
          {/* Template Selector */}
          <section>
            <h2 className="text-xl font-bold mb-4">Choose a Template</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templates.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`cursor-pointer border-2 rounded-xl p-6 transition-all hover:scale-105 ${
                    selectedTemplate === t.id
                      ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200"
                      : "border-gray-200 bg-white hover:border-indigo-300"
                  }`}
                >
                  <div className="text-4xl mb-4 text-gray-700">{t.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{t.name}</h3>
                  <p className="text-sm text-gray-500">{t.description}</p>
                  {selectedTemplate === t.id && (
                    <div className="mt-4 text-indigo-600 font-bold flex items-center gap-2 text-sm">
                      <FaCheckCircle /> Selected
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Section Visibility */}
          <section className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-bold mb-6">Page Layout & Visibility</h2>
            <div className="space-y-4">
              {[
                { id: "hero", label: "Hero Section", canToggle: false },
                { id: "services", label: "Services List", canToggle: false },
                { id: "booking", label: "Booking CTA", canToggle: false },
                { id: "about", label: "About Us", canToggle: true },
                { id: "hours", label: "Opening Hours", canToggle: true },
                {
                  id: "testimonials",
                  label: "Reviews / Testimonials",
                  canToggle: true,
                },
                { id: "contact", label: "Contact Info", canToggle: false },
                { id: "map", label: "Location Map", canToggle: true },
                { id: "faqs", label: "FAQs", canToggle: true },
              ].map((section) => (
                <div
                  key={section.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <span className="font-bold text-gray-700">
                    {section.label}
                  </span>
                  {section.canToggle ? (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={sectionVisibility[section.id] !== false}
                        onChange={(e) =>
                          setSectionVisibility((prev) => ({
                            ...prev,
                            [section.id]: e.target.checked,
                          }))
                        }
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  ) : (
                    <span className="text-xs font-mono uppercase text-gray-400 bg-gray-200 px-2 py-1 rounded">
                      Required
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Logo & Color Selector */}
          <section className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Brand Identity</h2>
            <div className="space-y-6">
              {/* Logo URL */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Logo URL
                </label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="w-full p-3 border rounded-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Paste a direct link to your logo image (PNG or JPG
                      recommended).
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-gray-50 border rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt="Preview"
                        className="w-full h-full object-contain"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    ) : (
                      <span className="text-xs text-gray-400">Preview</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-16 h-16 rounded cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="mt-1 block w-32 p-2 border border-gray-300 rounded font-mono uppercase"
                  />
                </div>
              </div>
            </div>
          </section>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full md:w-auto bg-gray-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Saving..." : "Apply Changes"}
          </button>
        </div>
      ) : activeTab === "content" ? (
        <div className="animate-fade-in">
          <ContentEditor initialData={orgData} onSave={handleContentSave} />
        </div>
      ) : activeTab === "availability" ? (
        <div className="animate-fade-in">
          <AvailabilitySettings
            initialData={orgData}
            loading={loading}
            onSave={(newSettings) => {
              // Merge newSettings.availability into existing settings
              const mergedSettings = {
                ...orgData.settings,
                availability: newSettings.availability,
              };

              dispatch(updateOrganization({ settings: mergedSettings }));
              setOrgData((prev) => ({ ...prev, settings: mergedSettings }));
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
