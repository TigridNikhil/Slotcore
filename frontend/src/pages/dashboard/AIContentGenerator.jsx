import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  generateSiteContent,
  generateServiceDescriptions,
  updateOrganization,
} from "../../operations/ai/aiAction";
import { FaMagic, FaSave, FaCheckCircle, FaRobot } from "react-icons/fa";
import { motion } from "framer-motion";

export default function AIContentGenerator() {
  const dispatch = useDispatch();
  const { loading, successMessage, error } = useSelector((state) => state.ai);

  const [contentData, setContentData] = useState({
    heroTagline: "",
    heroSubheadline: "",
    aboutUs: "",
  });
  const [tone, setTone] = useState("Professional");
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [contextInput, setContextInput] = useState("");

  const tones = [
    "Professional",
    "Casual & Friendly",
    "Luxury & Elegant",
    "Minimalist",
  ];

  const handleGenerateSiteCallback = () => {
    setShowPromptModal(true);
  };

  const handleConfirmGenerate = async () => {
    setShowPromptModal(false);
    const res = await dispatch(generateSiteContent(tone, contextInput));
    if (res) {
      setContentData(res);
    }
  };

  const handleGenerateServicesCallback = () => {
    const confirm = window.confirm(
      "Make sure you added all services before generating service descriptions. Are you sure you want to generate service descriptions?",
    );
    if (!confirm) return;
    dispatch(generateServiceDescriptions(tone));
  };

  const handleSave = () => {
    dispatch(updateOrganization({ content: contentData }));
  };

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg text-white shadow-lg">
            <FaRobot className="text-2xl" />
          </div>
          AI Content Studio
        </h1>
        <p className="text-gray-500 mt-2 md:ml-16">
          Generate professional website copy and service descriptions in seconds
          using Gemini AI.
        </p>
      </div>

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-2 border border-green-200 shadow-sm"
        >
          <FaCheckCircle /> {successMessage}
        </motion.div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Brand Tone</h2>
          <p className="text-sm text-gray-500">
            Choose the voice for your generated content.
          </p>
        </div>
        <div className="flex gap-2">
          {tones.map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                tone === t
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Site Content Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Website Copy</h2>
            <p className="text-sm text-gray-500">Hero section and About Us</p>
          </div>
          <button
            onClick={handleGenerateSiteCallback}
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-lg hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? (
              "Generating..."
            ) : (
              <>
                <FaMagic /> Auto-Generate
              </>
            )}
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Tagline
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="e.g. Premium Healthcare for Everyone"
                value={contentData.heroTagline}
                onChange={(e) =>
                  setContentData({
                    ...contentData,
                    heroTagline: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subheadline
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="e.g. Book your appointments online instantly."
                value={contentData.heroSubheadline}
                onChange={(e) =>
                  setContentData({
                    ...contentData,
                    heroSubheadline: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About Us
              </label>
              <textarea
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all h-32"
                placeholder="Tell us about your organization..."
                value={contentData.aboutUs}
                onChange={(e) =>
                  setContentData({ ...contentData, aboutUs: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors shadow-md"
            >
              <FaSave /> Save Changes
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Service Descriptions
            </h2>
            <p className="text-sm text-gray-500">
              Batch generate descriptions for all your services
            </p>
          </div>
        </div>
        <div className="p-8 text-center">
          <div className="max-w-md mx-auto">
            <p className="text-gray-600 mb-6">
              This will ask AI to look at all your service names and generate
              attractive, sales-focused descriptions for each one. Existing
              descriptions will be overwritten.
            </p>
            <button
              onClick={handleGenerateServicesCallback}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 border-2 border-indigo-100 px-6 py-4 rounded-xl hover:bg-indigo-100 hover:border-indigo-200 transition-all font-bold text-lg"
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  <FaMagic /> Generate All Service Descriptions
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* AI Prompt Modal */}
      {showPromptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <FaRobot />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Help the AI understand you
              </h3>
            </div>

            <p className="text-gray-500 mb-4 text-sm">
              Briefly describe your organization, location, and specialties. The
              more context you provide, the better the generated content will
              be.
            </p>

            <textarea
              className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none mb-6 text-gray-900"
              placeholder="e.g. A luxury day spa in downtown Chicago offering organic skincare treatments and massages..."
              value={contextInput}
              onChange={(e) => setContextInput(e.target.value)}
              autoFocus
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPromptModal(false)}
                className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmGenerate}
                disabled={!contextInput.trim() || loading}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? "Generating..." : "Generate Content"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
