import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaRocket,
  FaPalette,
  FaConciergeBell,
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft,
  FaMagic,
  FaGlobe,
} from "react-icons/fa";
import { updateOrganization } from "../../operations/ai/aiAction";
import { createService } from "../../operations/service/serviceAction";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { applyTheme } from "../../utils/themeUtils";

const STEPS = [
  { id: 1, title: "Brand Identity", icon: <FaRocket /> },
  { id: 2, title: "Visual Style", icon: <FaPalette /> },
  { id: 3, title: "Initial Offering", icon: <FaConciergeBell /> },
  { id: 4, title: "Ready to Launch", icon: <FaCheckCircle /> },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form States
  const [config, setConfig] = useState({
    name: user.orgName || "",
    heroTagline: "Book your appointment with ease",
    heroSubheadline: "Experience professional service at your convenience.",
    primaryColor: "#4F46E5",
  });

  const [service, setService] = useState({
    name: "",
    price: "",
    durationMin: 30,
    description: "Our basic service offering.",
  });

  // Real-time theme preview
  useEffect(() => {
    applyTheme(config.primaryColor);
  }, [config.primaryColor]);

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    setService((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleComplete = async () => {
    setLoading(true);
    try {
      // 1. Update Organization Config
      await dispatch(
        updateOrganization({
          name: config.name,
          primaryColor: config.primaryColor,
          content: {
            heroTagline: config.heroTagline,
            heroSubheadline: config.heroSubheadline,
          },
        }),
      );

      // 2. Create First Service
      if (service.name) {
        await dispatch(createService(service));
      }

      // 3. Mark Onboarding as Completed
      await dispatch(
        updateOrganization({
          onboardingCompleted: true,
        }),
      );

      // Update local storage user object
      const updatedUser = { ...user, onboardingCompleted: true };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // 4. Redirect to Dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Onboarding failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-7xl w-full bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar Stepper */}
        <div className="w-full md:w-80 bg-gray-900 p-10 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-12">
              <img src="/logo.png" alt="Logo" className="h-8" />
              <span className="text-xl font-bold tracking-tight">Slotcore</span>
            </div>

            <div className="space-y-8">
              {STEPS.map((step) => (
                <div key={step.id} className="flex items-center gap-4 group">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      currentStep >= step.id
                        ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                        : "bg-gray-800 text-gray-500"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-xs font-bold uppercase tracking-widest ${
                        currentStep >= step.id
                          ? "text-primary-400"
                          : "text-gray-600"
                      }`}
                    >
                      Step 0{step.id}
                    </span>
                    <span
                      className={`font-bold ${
                        currentStep === step.id ? "text-white" : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50">
            <p className="text-sm text-gray-400 italic">
              "First impressions are the most lasting."
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-4xl font-black text-gray-900 italic tracking-tight mb-2">
                    Build Your Identity
                  </h2>
                  <p className="text-gray-500 font-medium">
                    Let's start with how your customers see you.
                  </p>
                </div>

                <div className="space-y-6">
                  <Input
                    label="Organization Name"
                    name="name"
                    value={config.name}
                    onChange={handleConfigChange}
                    placeholder="Enter your business name"
                    icon={<FaGlobe className="text-primary-500" />}
                  />
                  <Input
                    label="Hero Tagline"
                    name="heroTagline"
                    value={config.heroTagline}
                    onChange={handleConfigChange}
                    placeholder="E.g. The Best Salon in Town"
                  />
                  <Input
                    label="Description"
                    name="heroSubheadline"
                    value={config.heroSubheadline}
                    onChange={handleConfigChange}
                    placeholder="Briefly describe what you do"
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-4xl font-black text-gray-900 italic tracking-tight mb-2">
                    Define Your Look
                  </h2>
                  <p className="text-gray-500 font-medium">
                    Choose a color that represents your brand.
                  </p>
                </div>

                <div className="space-y-8">
                  <div className="p-8 bg-gray-100 rounded-3xl flex flex-col items-center gap-6 border-2 border-dashed border-gray-200">
                    <div
                      className="w-24 h-24 rounded-[2rem] shadow-2xl transition-all duration-500"
                      style={{ backgroundColor: config.primaryColor }}
                    ></div>
                    <div className="flex flex-wrap justify-center gap-4">
                      {[
                        "#4F46E5",
                        "#10B981",
                        "#F59E0B",
                        "#EF4444",
                        "#EC4899",
                        "#8B5CF6",
                        "#111827",
                      ].map((color) => (
                        <button
                          key={color}
                          onClick={() =>
                            setConfig((prev) => ({
                              ...prev,
                              primaryColor: color,
                            }))
                          }
                          className={`w-10 h-10 rounded-full transition-transform hover:scale-125 ${config.primaryColor === color ? "ring-4 ring-offset-2 ring-gray-400 scale-110" : ""}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <Input
                    label="Custom Hex Color"
                    name="primaryColor"
                    value={config.primaryColor}
                    onChange={handleConfigChange}
                    placeholder="#000000"
                    icon={<FaPalette className="text-primary-500" />}
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-4xl font-black text-gray-900 italic tracking-tight mb-2">
                    First Offering
                  </h2>
                  <p className="text-gray-500 font-medium">
                    Add your primary service to get started.
                  </p>
                </div>

                <div className="space-y-6">
                  <Input
                    label="Service Name"
                    name="name"
                    value={service.name}
                    onChange={handleServiceChange}
                    placeholder="E.g. Haircut, Consultation, Repair"
                    icon={<FaConciergeBell className="text-primary-500" />}
                  />
                  <div className="grid grid-cols-2 gap-6">
                    <Input
                      label="Price ($)"
                      name="price"
                      type="number"
                      value={service.price}
                      onChange={handleServiceChange}
                      placeholder="0.00"
                    />
                    <Input
                      label="Duration (min)"
                      name="durationMin"
                      type="number"
                      value={service.durationMin}
                      onChange={handleServiceChange}
                      placeholder="30"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center space-y-8"
              >
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-primary-500 blur-3xl opacity-20 animate-pulse"></div>
                  <div className="relative w-32 h-32 bg-primary-50 rounded-[2.5rem] flex items-center justify-center text-primary-600 border border-primary-100 shadow-xl mx-auto">
                    <FaMagic size={48} className="animate-bounce" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-4xl font-black text-gray-900 italic tracking-tight">
                    You're All Set!
                  </h2>
                  <p className="text-xl text-gray-500 font-medium max-w-sm mx-auto">
                    We've configured your brand and added your first service.
                    You're ready to start taking bookings!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center pt-8 border-t border-gray-100 mt-12">
            <button
              onClick={prevStep}
              className={`flex items-center gap-2 font-bold transition-all ${currentStep === 1 ? "opacity-0 pointer-events-none" : "text-gray-400 hover:text-gray-900 active:scale-95"}`}
            >
              <FaArrowLeft size={12} /> Previous
            </button>

            {currentStep < 4 ? (
              <Button onClick={nextStep} size="xl" className="px-10 group">
                Continue{" "}
                <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                loading={loading}
                size="xl"
                className="px-12 bg-gray-900 border-gray-900 hover:bg-black"
              >
                Launch Dashboard
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
