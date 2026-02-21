import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaTrash,
  FaUserShield,
  FaUserMd,
  FaEye,
  FaCalendarAlt,
} from "react-icons/fa";
import { axiosInstance } from "../../../utils/baseurl";
import StaffAvailabilitySettings from "../availability/StaffAvailabilitySettings";

// Helper for Role Icons
const getRoleIcon = (role) => {
  switch (role) {
    case "org_admin":
    case "super_admin":
      return <FaUserShield className="text-purple-600" />;
    case "staff":
      return <FaUserMd className="text-blue-500" />;
    case "viewer":
      return <FaEye className="text-gray-500" />;
    default:
      return <FaUserMd className="text-gray-400" />;
  }
};

const TeamManagement = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [scheduleModalUser, setScheduleModalUser] = useState(null); // User selected for schedule edit

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "staff",
    title: "",
    password: "", // Optional for invite flow, mandatory for direct create
  });

  const fetchTeam = async () => {
    try {
      const res = await axiosInstance.get("/organization/team");
      setTeam(res.data.data);
    } catch (error) {
      console.error("Failed to fetch team", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/organization/team", newUser);
      setShowAddModal(false);
      setNewUser({
        name: "",
        email: "",
        role: "staff",
        title: "",
        password: "",
      });
      fetchTeam();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to add member");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this team member?"))
      return;
    try {
      await axiosInstance.delete(`/organization/team/${userId}`);
      fetchTeam();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to remove member");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Team Management</h2>
          <p className="text-sm text-gray-500">
            Manage your staff access and roles
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition-colors"
        >
          <FaPlus /> Add Member
        </button>
      </div>

      {loading ? (
        <p>Loading team...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name / Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {team.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-900 capitalize">
                      {getRoleIcon(member.role)} {member.role.replace("_", " ")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.title || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3">
                    <button
                      onClick={() => setScheduleModalUser(member)}
                      className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                      title="Manage Availability"
                    >
                      <FaCalendarAlt /> Hours
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">Add Team Member</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full border rounded-md p-2"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="mt-1 block w-full border rounded-md p-2"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Temporary Password
                </label>
                <input
                  type="text"
                  required
                  placeholder="Min 6 characters"
                  className="mt-1 block w-full border rounded-md p-2"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    className="mt-1 block w-full border rounded-md p-2"
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                  >
                    <option value="staff">Staff</option>
                    <option value="org_admin">Admin</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Doctor"
                    className="mt-1 block w-full border rounded-md p-2"
                    value={newUser.title}
                    onChange={(e) =>
                      setNewUser({ ...newUser, title: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Availability Modal */}
      {scheduleModalUser && (
        <StaffAvailabilitySettings
          staffId={scheduleModalUser.id}
          staffName={scheduleModalUser.name}
          onClose={() => setScheduleModalUser(null)}
        />
      )}
    </div>
  );
};

export default TeamManagement;
