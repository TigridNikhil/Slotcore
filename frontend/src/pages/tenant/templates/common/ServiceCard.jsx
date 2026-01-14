import { motion } from "framer-motion";
import { FaCalendarPlus, FaClock, FaTag } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ServiceCard({
  service,
  primaryColor = "#4F46E5",
  variant = "modern",
}) {
  const isMinimal = variant === "minimal";
  const isClassic = variant === "classic";

  if (isMinimal) {
    return (
      <div className="group border-t border-black py-8 flex flex-col md:flex-row justify-between items-start gap-6 hover:bg-gray-50 transition-colors">
        <div className="flex-1">
          <h3 className="text-2xl font-bold uppercase tracking-tighter mb-2">
            {service.name}
          </h3>
          <p className="text-gray-500 max-w-lg">{service.description}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-mono mb-2">${service.price}</p>
          <Link
            to={`/book?service=${service.id}`}
            className="inline-block text-sm font-bold border-b border-black pb-0.5 hover:border-transparent transition-all"
          >
            BOOK NOW
          </Link>
        </div>
      </div>
    );
  }

  if (isClassic) {
    return (
      <div className="bg-white p-8 border border-gray-200 text-center hover:shadow-lg transition-all duration-300">
        <h3 className="text-xl font-bold uppercase tracking-wide mb-4 text-gray-900">
          {service.name}
        </h3>
        <div className="w-12 h-0.5 mx-auto mb-4 bg-gray-300"></div>
        <p className="text-gray-600 mb-6 font-light leading-relaxed min-h-[60px]">
          {service.description}
        </p>
        <p className="text-lg font-medium mb-6" style={{ color: primaryColor }}>
          ${service.price}{" "}
          <span className="text-gray-400 text-sm">
            / {service.duration} mins
          </span>
        </p>
        <Link
          to={`/book?service=${service.id}`}
          className="inline-block px-6 py-2 border border-gray-900 text-gray-900 uppercase text-xs tracking-widest hover:bg-gray-900 hover:text-white transition-colors"
          style={{
            borderColor: primaryColor,
            color: primaryColor === "#000000" ? undefined : primaryColor,
          }}
        >
          Reserve
        </Link>
      </div>
    );
  }

  // Modern Default
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col h-full"
    >
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
          {service.name}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">
          {service.description || "No description available."}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <FaClock className="text-indigo-400" /> {service.duration}m
          </div>
          <div className="flex items-center gap-1.5">
            <FaTag className="text-green-400" /> ${service.price}
          </div>
        </div>
        <Link
          to={`/book?service=${service.id}`}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md transition-transform transform active:scale-95"
          style={{ backgroundColor: primaryColor }}
        >
          <FaCalendarPlus />
        </Link>
      </div>
    </motion.div>
  );
}
