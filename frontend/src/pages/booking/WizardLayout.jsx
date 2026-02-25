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
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden relative z-10 grid grid-cols-1 md:grid-cols-[300px_1fr] md:min-h-[600px] max-h-[95vh] md:max-h-none"
      >
        {/* Sidebar / Top Header */}
        <div className="bg-gray-900 text-white p-6 md:p-8 flex flex-col md:justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6 md:mb-12">
              {tenant?.logoUrl ? (
                <img
                  src={tenant.logoUrl}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg"
                  alt="logo"
                />
              ) : (
                <div
                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center font-bold text-base md:text-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  {tenant?.name?.charAt(0)}
                </div>
              )}
              <span className="font-bold text-lg md:text-xl tracking-tight">
                {tenant?.name}
              </span>
            </div>

            {/* Desktop Vertical Stepper */}
            <div className="hidden md:block space-y-8">
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

            {/* Mobile Horizontal Stepper */}
            <div className="md:hidden flex justify-between items-center px-2 py-4 border-t border-gray-800">
              {(() => {
                const total = totalSteps;
                const progressTotal = total;
                return Array.from({ length: total }).map((_, idx) => {
                  const stepNum = idx + 1;
                  const isPast = step > stepNum;
                  const isCurrent = step === stepNum;
                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center flex-1 relative"
                    >
                      {/* Connector Line */}
                      {idx !== 0 && (
                        <div
                          className={`absolute w-full h-[2px] right-1/2 top-4 -translate-y-1/2 z-0 ${
                            isPast || isCurrent ? "bg-white" : "bg-gray-700"
                          }`}
                        />
                      )}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 relative z-10 transition-all ${
                          isPast || isCurrent
                            ? "bg-white text-gray-900 border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                            : "bg-gray-900 border-gray-700 text-gray-500"
                        }`}
                      >
                        {isPast ? "✓" : stepNum}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background: `linear-gradient(to bottom right, ${primaryColor}, transparent)`,
            }}
          ></div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 md:p-12 h-full overflow-y-auto">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
