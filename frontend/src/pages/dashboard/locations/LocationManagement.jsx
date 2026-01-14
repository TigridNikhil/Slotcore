import { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaPlus,
  FaPen,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { axiosInstance } from "../../../utils/baseurl";

export default function LocationManagement() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    timezone: "UTC",
    contactEmail: "",
    contactPhone: "",
  });

  const fetchLocations = async () => {
    try {
      const res = await axiosInstance.get("/locations");
      setLocations(res.data);
    } catch (error) {
      console.error("Failed to fetch locations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLocation) {
        await axiosInstance.put(`/locations/${editingLocation.id}`, formData);
      } else {
        await axiosInstance.post("/locations", formData);
      }
      setModalOpen(false);
      setEditingLocation(null);
      setFormData({
        name: "",
        address: "",
        timezone: "UTC",
        contactEmail: "",
        contactPhone: "",
      });
      fetchLocations();
    } catch (error) {
      console.error("Failed to save location", error);
      alert("Failed to save location");
    }
  };

  const handleEdit = (loc) => {
    setEditingLocation(loc);
    setFormData({
      name: loc.name,
      address: loc.address || "",
      timezone: loc.timezone || "UTC",
      contactEmail: loc.contactEmail || "",
      contactPhone: loc.contactPhone || "",
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure? This will not delete associated bookings but might affect future availability."
      )
    )
      return;
    try {
      await axiosInstance.delete(`/locations/${id}`);
      fetchLocations();
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
          <p className="text-gray-500">
            Manage your business branches and locations.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingLocation(null);
            setFormData({
              name: "",
              address: "",
              timezone: "UTC",
              contactEmail: "",
              contactPhone: "",
            });
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <FaPlus /> Add Location
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc) => (
            <motion.div
              key={loc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <FaMapMarkerAlt />
                  </div>
                  <h3 className="font-bold text-gray-900">{loc.name}</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(loc)}
                    className="text-gray-400 hover:text-indigo-600"
                  >
                    <FaPen size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(loc.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                {loc.address && <p>{loc.address}</p>}
                {loc.contactPhone && <p>Phone: {loc.contactPhone}</p>}
                {loc.contactEmail && <p>Email: {loc.contactEmail}</p>}
                <p className="text-xs text-gray-400 mt-2">
                  Timezone: {loc.timezone}
                </p>
              </div>
            </motion.div>
          ))}

          {locations.length === 0 && (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200 text-gray-500">
              No locations added yet.
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900">
                {editingLocation ? "Edit Location" : "Add New Location"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Headquarters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Street, City, Zip"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={formData.contactEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, contactEmail: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={formData.contactPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, contactPhone: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={formData.timezone}
                  onChange={(e) =>
                    setFormData({ ...formData, timezone: e.target.value })
                  }
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">New York (EST)</option>
                  <option value="America/Los_Angeles">Los Angeles (PST)</option>
                  <option value="Europe/London">London (GMT)</option>
                  {/* Add more as needed */}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm"
                >
                  Save Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
