import { FaQuoteLeft, FaStar } from "react-icons/fa";

export default function TestimonialsSection({
  testimonials,
  primaryColor = "#6366f1",
  variant,
}) {
  if (!testimonials || testimonials.length === 0) return null;

  const isMinimal = variant === "minimal";
  const isClassic = variant === "classic";

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2
            className={`font-extrabold tracking-tight ${
              isMinimal ? "text-4xl uppercase" : "text-3xl md:text-4xl"
            }`}
          >
            {isMinimal ? "Client Stories" : "Trusted by Our Clients"}
          </h2>
          <p className="text-gray-500 mt-4">
            Real feedback from people who experienced our service
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl p-8 bg-white/70 backdrop-blur-xl border border-gray-200 shadow-sm
                         transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              style={{
                boxShadow: `0 20px 40px ${primaryColor}12`,
              }}
            >
              {/* Quote icon */}
              {!isClassic && (
                <FaQuoteLeft
                  className="absolute -top-5 left-6 text-5xl opacity-10"
                  style={{ color: primaryColor }}
                />
              )}

              {/* Stars (classic top aligned) */}
              {isClassic && (
                <div className="flex justify-center mb-4 text-yellow-400">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
              )}

              {/* Text */}
              <p
                className={`text-gray-600 leading-relaxed mb-8 ${
                  isClassic ? "italic font-serif text-center" : ""
                }`}
              >
                “{t.text}”
              </p>

              {/* User */}
              <div
                className={`flex items-center gap-4 ${
                  isClassic ? "justify-center text-center" : ""
                }`}
              >
                {/* Avatar */}
                {!isClassic && (
                  <div
                    className="relative w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                    style={{
                      background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}99)`,
                    }}
                  >
                    {t.name?.charAt(0)}
                  </div>
                )}

                <div>
                  <p className="font-semibold text-gray-900">{t.name}</p>

                  {!isClassic && (
                    <div className="flex gap-1 text-yellow-400 text-xs mt-1">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <FaStar key={i} className="transition-transform group-hover:scale-110" />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Glow border */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition"
                style={{
                  boxShadow: `inset 0 0 0 1px ${primaryColor}40`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
