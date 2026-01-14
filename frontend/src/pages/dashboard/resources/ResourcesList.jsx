import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaEdit, FaBoxOpen } from "react-icons/fa";
import ResourceForm from "./ResourceForm";
import { axiosInstance } from "../../../utils/baseurl";

export default function ResourcesList() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/resources");
      setResources(res.data);
    } catch (error) {
      console.error("Failed to fetch resources", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;
    try {
      await axiosInstance.delete(`/resources/${id}`);
      fetchResources();
    } catch (error) {
      console.error("Delete failed", error);
      alert(error.response?.data?.error || "Failed to delete");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
          <p className="text-gray-500">Manage rooms, equipment, and assets</p>
        </div>
        <button
          onClick={() => {
            setEditingResource(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <FaPlus /> Add Resource
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : resources.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <FaBoxOpen className="text-4xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No Resources Yet
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first resource to get started
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="text-indigo-600 font-medium hover:text-indigo-700"
          >
            Create Resource
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Type</th>
                <th className="p-4">Quantity</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {resources.map((res) => (
                <tr key={res.id} className="hover:bg-gray-50/50">
                  <td className="p-4 font-medium text-gray-900">{res.name}</td>
                  <td className="p-4">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-bold uppercase">
                      {res.type}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-gray-600">
                    {res.quantity}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setEditingResource(res);
                        setShowForm(true);
                      }}
                      className="text-gray-400 hover:text-indigo-600 transition"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(res.id)}
                      className="text-gray-400 hover:text-red-600 transition"
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

      {showForm && (
        <ResourceForm
          initialData={editingResource}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchResources();
          }}
        />
      )}
    </div>
  );
}
