import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createService,
  updateService,
} from "../../operations/service/serviceAction";
import { axiosInstance } from "../../utils/baseurl";

export default function ServiceForm({ initialData, onServiceCreated }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.service);
  const [staffList, setStaffList] = useState([]);
  const [locationsList, setLocationsList] = useState([]);
  const [resourcesList, setResourcesList] = useState([]);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    durationMin: initialData?.durationMin || 30,
    price: initialData?.price || 0,
    paymentType: "FULL",
    advanceAmount: 0,
    description: initialData?.description || "",
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
    bufferTime: initialData?.bufferTime || 0,
    capacity: initialData?.capacity || 1,
    maxBookingsPerDay: initialData?.maxBookingsPerDay || "",
    staffIds: initialData?.staff ? initialData.staff.map((s) => s.id) : [],
    locationIds: initialData?.locations
      ? initialData.locations.map((l) => l.id)
      : [],
    resourceIds: initialData?.resources
      ? initialData.resources.map((r) => r.id)
      : [],
  });

  // Fetch Staff, Locations, and Resources
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const [staffRes, locRes, resRes] = await Promise.all([
          axiosInstance.get("/organization/team"),
          axiosInstance.get("/locations"),
          axiosInstance.get("/resources"),
        ]);
        setStaffList(staffRes.data.data);
        setLocationsList(locRes.data.data);
        // Assuming resRes.data is array of resources
        setResourcesList(resRes.data.data);
      } catch (err) {
        console.error("Failed to fetch dependencies", err);
      }
    };
    fetchResources();
  }, []);

  // Effect to update form data if initialData changes (e.g. user selects different service)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        durationMin: initialData.durationMin || 30,
        price: initialData.price || 0,
        paymentType:
          initialData.ServicePricings?.find((p) => !p.locationId)
            ?.paymentType || "FULL",
        advanceAmount:
          initialData.ServicePricings?.find((p) => !p.locationId)
            ?.advanceAmount || 0,
        description: initialData.description || "",
        isActive:
          initialData.isActive !== undefined ? initialData.isActive : true,
        bufferTime: initialData.bufferTime || 0,
        capacity: initialData.capacity || 1,
        maxBookingsPerDay: initialData.maxBookingsPerDay || "",
        staffIds: initialData.staff ? initialData.staff.map((s) => s.id) : [],
        locationIds: initialData.locations
          ? initialData.locations.map((l) => l.id)
          : [],
      });
    } else {
      // Reset logic could go here if needed when switching from Edit to Create
    }
  }, [initialData]);

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleStaffToggle = (staffId) => {
    setFormData((prev) => {
      const current = prev.staffIds || [];
      if (current.includes(staffId)) {
        return { ...prev, staffIds: current.filter((id) => id !== staffId) };
      } else {
        return { ...prev, staffIds: [...current, staffId] };
      }
    });
  };

  const handleLocationToggle = (locId) => {
    setFormData((prev) => {
      const current = prev.locationIds || [];
      if (current.includes(locId)) {
        return { ...prev, locationIds: current.filter((id) => id !== locId) };
      } else {
        return { ...prev, locationIds: [...current, locId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let result;
    if (initialData && initialData.id) {
      result = await dispatch(updateService(initialData.id, formData));
    } else {
      result = await dispatch(createService(formData));
    }

    if (result && result.success) {
      setFormData({
        name: "",
        durationMin: 30,
        price: 0,
        description: "",
        isActive: true,
        bufferTime: 0,
        capacity: 1,
        maxBookingsPerDay: "",
        staffIds: [],
        locationIds: [],
      });
      if (onServiceCreated) onServiceCreated();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6 border border-gray-100">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {initialData ? "Edit Service" : "Add New Service"}
      </h3>

      {error && <div className="text-red-600 text-sm mb-3">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Service Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duration (min)
            </label>
            <input
              type="number"
              name="durationMin"
              value={formData.durationMin}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Buffer (min)
            </label>
            <input
              type="number"
              name="bufferTime"
              value={formData.bufferTime}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Capacity
            </label>
            <input
              type="number"
              name="capacity"
              min="1"
              value={formData.capacity}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Max / Day
            </label>
            <input
              type="number"
              name="maxBookingsPerDay"
              value={formData.maxBookingsPerDay}
              onChange={handleChange}
              placeholder="Unlimited"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Staff Assignment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assign Staff (Providers)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
            {staffList.map((staff) => (
              <label
                key={staff.id}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.staffIds?.includes(staff.id)}
                  onChange={() => handleStaffToggle(staff.id)}
                  className="text-indigo-600 focus:ring-indigo-500 rounded"
                />
                <span className="text-sm text-gray-700">
                  {staff.name}{" "}
                  <span className="text-gray-400 text-xs">({staff.role})</span>
                </span>
              </label>
            ))}
            {staffList.length === 0 && (
              <span className="text-gray-500 text-sm">
                No staff members found. Add them in Team tab.
              </span>
            )}
          </div>
        </div>

        {/* Location Assignment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assign Locations (Branches)
          </label>
          <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
            {locationsList.map((loc) => (
              <label
                key={loc.id}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.locationIds?.includes(loc.id)}
                  onChange={() => handleLocationToggle(loc.id)}
                  className="text-indigo-600 focus:ring-indigo-500 rounded"
                />
                <span className="text-sm text-gray-700">{loc.name}</span>
              </label>
            ))}
            {locationsList.length === 0 && (
              <span className="text-gray-500 text-sm">
                No locations found. Add them in Locations tab.
              </span>
            )}
          </div>
        </div>

        {/* Resource Assignment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Required Resources (Rooms / Equipment)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
            {resourcesList.map((res) => (
              <label
                key={res.id}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.resourceIds?.includes(res.id)}
                  onChange={() => {
                    setFormData((prev) => {
                      const current = prev.resourceIds || [];
                      if (current.includes(res.id))
                        return {
                          ...prev,
                          resourceIds: current.filter((id) => id !== res.id),
                        };
                      return { ...prev, resourceIds: [...current, res.id] };
                    });
                  }}
                  className="text-indigo-600 focus:ring-indigo-500 rounded"
                />
                <span className="text-sm text-gray-700">
                  {res.name}{" "}
                  <span className="text-xs text-gray-400">({res.type})</span>
                </span>
              </label>
            ))}
            {resourcesList.length === 0 && (
              <span className="text-gray-500 text-sm">
                No resources found. Add them in Resources tab.
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            If selected, booking spans this resource preventing dual usage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              name="price"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Type
            </label>
            <select
              name="paymentType"
              value={formData.paymentType || "FULL"}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="FULL">Full Payment</option>
              <option value="ADVANCE">Advance Amount (Partial)</option>
              <option value="FREE">Free</option>
            </select>
          </div>
          {formData.paymentType === "ADVANCE" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Advance Amount
              </label>
              <input
                type="number"
                name="advanceAmount"
                step="0.01"
                min="0"
                value={formData.advanceAmount}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}
        </div>
        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">Active</label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            rows="2"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : initialData
              ? "Update Service"
              : "Add Service"}
        </button>
      </form>
    </div>
  );
}
