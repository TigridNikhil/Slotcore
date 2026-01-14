import { motion } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function LocationSelection({
  locations,
  onContinue,
  primaryColor,
}) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Select a Location
      </h2>
      <p className="text-gray-600 mb-8">
        Where would you like to book your service?
      </p>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {locations.map((loc) => (
          <motion.button
            key={loc.id}
            variants={item}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onContinue(loc)}
            className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-300 transition-all text-left group"
          >
            <div
              className="p-3 rounded-full bg-gray-50 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors"
              style={{
                color: primaryColor, // Use primary color if passed, manually override helper class
              }}
            >
              <FaMapMarkerAlt size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                {loc.name}
              </h3>
              {loc.address && (
                <p className="text-sm text-gray-500 mt-1">{loc.address}</p>
              )}
              {/* Optional: Show distance if geo-location is available */}
            </div>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}
