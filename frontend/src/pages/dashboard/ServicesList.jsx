import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  FaClock,
  FaTag,
  FaTrash,
  FaPen,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import {
  getServices,
  deleteService,
} from "../../operations/service/serviceAction";

export default function ServicesList({ refreshTrigger, onEdit }) {
  const dispatch = useDispatch();
  const { services, loading, error } = useSelector((state) => state.service);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    dispatch(getServices());
  }, [dispatch, refreshTrigger]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    dispatch(deleteService(id));
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (loading && services.length === 0)
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {services.map((service) => (
          <motion.div
            key={service.id}
            variants={item}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
          >
            <div
              className={`h-2 w-full ${
                service.isActive ? "bg-indigo-500" : "bg-gray-300"
              }`}
            ></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                  {service.name}
                </h3>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(service)}
                    className="text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <FaPen size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
                  <FaClock className="text-indigo-400" />
                  <span>{service.durationMin} min</span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded font-medium text-gray-700">
                  <FaTag className="text-green-500" />
                  <span>{service.price}</span>
                </div>
              </div>

              {/* Description Snippet */}
              <p className="text-xs text-gray-400 mb-4 line-clamp-2">
                {service.description || "No description available."}
              </p>

              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <span
                  className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full ${
                    service.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {service.isActive ? (
                    <FaCheckCircle size={10} />
                  ) : (
                    <FaTimesCircle size={10} />
                  )}
                  {service.isActive ? "Active" : "Inactive"}
                </span>
                <button
                  onClick={() => setSelectedService(service)}
                  className="text-sm text-indigo-600 font-medium hover:underline"
                >
                  Details &rarr;
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {services.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
            No services found. Create your first service!
          </div>
        )}
      </motion.div>

      {/* Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                {selectedService.name}
              </h2>
              <button
                onClick={() => setSelectedService(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimesCircle size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Description
                </span>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {selectedService.description || "No description provided."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Duration
                  </span>
                  <div className="font-semibold text-gray-800">
                    {selectedService.durationMin} minutes
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Price
                  </span>
                  <div className="font-semibold text-gray-800">
                    {selectedService.price}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Buffer Time
                  </span>
                  <div className="font-semibold text-gray-800">
                    {selectedService.bufferTime || 0} minutes
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Capacity
                  </span>
                  <div className="font-semibold text-gray-800">
                    {selectedService.capacity || 1} person(s)
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Assigned Staff
                </span>
                {selectedService.staff && selectedService.staff.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedService.staff.map((member) => (
                      <span
                        key={member.id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {member.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">
                    No specific staff assigned (Open to all)
                  </p>
                )}
              </div>

              {/* Locations Section */}
              <div className="mt-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Available At (Locations)
                </span>
                {selectedService.locations &&
                selectedService.locations.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedService.locations.map((loc) => (
                      <span
                        key={loc.id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                      >
                        {loc.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">
                    Available at all locations (Global)
                  </p>
                )}
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button
                onClick={() => setSelectedService(null)}
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onEdit(selectedService);
                  setSelectedService(null);
                }}
                className="ml-3 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
              >
                Edit Service
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
