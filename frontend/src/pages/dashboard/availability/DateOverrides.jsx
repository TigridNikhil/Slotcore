import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash, FaPlus, FaCalendarDay } from "react-icons/fa";
import { format } from "date-fns";
import {
  fetchOverrides,
  createOverride,
  deleteOverride,
} from "../../../operations/availability/availabilityAction";
import { clearMessages } from "../../../operations/availability/availabilitySlice";

export default function DateOverrides() {
  const dispatch = useDispatch();
  const { overrides, loading, error, success } = useSelector(
    (state) => state.availability
  );
  const [newOverride, setNewOverride] = useState({
    date: "",
    startTime: "09:00",
    endTime: "17:00",
    isOff: true,
  });

  useEffect(() => {
    dispatch(fetchOverrides());
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newOverride.date) return;

    const result = await dispatch(createOverride(newOverride));
    if (result && result.success) {
      setNewOverride({
        date: "",
        startTime: "09:00",
        endTime: "17:00",
        isOff: true,
      });
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this override?")) return;
    dispatch(deleteOverride(id));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">
        Date-Specific Overrides
      </h3>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 text-green-600 p-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Add New Form */}
      <form
        onSubmit={handleAdd}
        className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200"
      >
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <FaPlus className="text-indigo-600" /> Add New Override
        </h4>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Date</label>
            <input
              type="date"
              required
              min={new Date().toISOString().split("T")[0]}
              value={newOverride.date}
              onChange={(e) =>
                setNewOverride({ ...newOverride, date: e.target.value })
              }
              className="border rounded px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="block text-xs text-gray-500 mb-1">Type</label>
            <select
              value={newOverride.isOff ? "closed" : "custom"}
              onChange={(e) =>
                setNewOverride({
                  ...newOverride,
                  isOff: e.target.value === "closed",
                })
              }
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="closed">Closed (Day Off)</option>
              <option value="custom">Custom Hours</option>
            </select>
          </div>

          {!newOverride.isOff && (
            <>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Start
                </label>
                <input
                  type="time"
                  required={!newOverride.isOff}
                  value={newOverride.startTime}
                  onChange={(e) =>
                    setNewOverride({
                      ...newOverride,
                      startTime: e.target.value,
                    })
                  }
                  className="border rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">End</label>
                <input
                  type="time"
                  required={!newOverride.isOff}
                  value={newOverride.endTime}
                  onChange={(e) =>
                    setNewOverride({
                      ...newOverride,
                      endTime: e.target.value,
                    })
                  }
                  className="border rounded px-3 py-2 text-sm"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            Add Override
          </button>
        </div>
      </form>

      {/* List */}
      <div className="space-y-2">
        {loading && overrides.length === 0 ? (
          <p className="text-gray-500">Loading...</p>
        ) : overrides.length === 0 ? (
          <p className="text-gray-500 italic">No overrides set.</p>
        ) : (
          overrides.map((override) => (
            <div
              key={override.id}
              className="flex justify-between items-center p-3 border rounded hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-900 font-medium">
                  <FaCalendarDay className="text-gray-400" />
                  {format(new Date(override.date), "MMM d, yyyy")}
                </div>
                <div>
                  {override.isOff ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Closed
                    </span>
                  ) : (
                    <span className="text-sm text-gray-600">
                      {override.startTime.slice(0, 5)} -{" "}
                      {override.endTime.slice(0, 5)}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDelete(override.id)}
                className="text-red-600 hover:text-red-900 p-2"
                title="Remove Override"
              >
                <FaTrash />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
