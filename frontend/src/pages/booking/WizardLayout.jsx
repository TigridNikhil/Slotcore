import { motion } from "framer-motion";

export default function WizardLayout({ children, tenant, step, totalSteps }) {
  const primaryColor = tenant?.primaryColor || "#4F46E5";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute top-0 left-0 w-full h-1/2 opacity-10 blur-3xl"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, transparent)`,
          }}
        ></div>
        <div
          className="absolute bottom-0 right-0 w-full h-1/2 opacity-10 blur-3xl"
          style={{
            background: `linear-gradient(-45deg, ${primaryColor}, transparent)`,
          }}
        ></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden relative z-10 grid md:grid-cols-[300px_1fr] md:min-h-[600px]"
      >
        {/* Sidebar */}
        <div className="bg-gray-900 text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              {tenant?.logoUrl ? (
                <img
                  src={tenant.logoUrl}
                  className="w-10 h-10 rounded-lg"
                  alt="logo"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  {tenant?.name?.charAt(0)}
                </div>
              )}
              <span className="font-bold text-xl tracking-tight">
                {tenant?.name}
              </span>
            </div>

            <div className="space-y-8">
              {(() => {
                const baseSteps = [
                  { label: "Select Service", sub: "Choose from our menu" },
                  { label: "Date & Time", sub: "Pick a slot" },
                  { label: "Your Info", sub: "Contact details" },
                  { label: "Payment", sub: "Secure checkout" },
                ];

                const stepsList =
                  totalSteps === 5
                    ? [
                        { label: "Location", sub: "Select nearest center" },
                        ...baseSteps,
                      ]
                    : baseSteps;

                return stepsList.map((s, index) => {
                  const stepNum = index + 1;
                  const isActive = step >= stepNum;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                          isActive
                            ? "bg-white text-gray-900 border-white"
                            : "border-gray-600 text-gray-500"
                        }`}
                      >
                        {isActive ? (step > stepNum ? "✓" : stepNum) : stepNum}
                      </div>
                      <div>
                        <h4
                          className={`font-bold ${
                            isActive ? "text-white" : "text-gray-500"
                          }`}
                        >
                          {s.label}
                        </h4>
                        <p className="text-xs text-gray-500">{s.sub}</p>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* Progress Bar (Mobile only visible if we adjust css but here acts as bg accent) */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `linear-gradient(to bottom right, ${primaryColor}, transparent)`,
            }}
          ></div>
        </div>

        {/* Content Area */}
        <div className="p-8 md:p-12 h-full">{children}</div>
      </motion.div>
    </div>
  );
}
