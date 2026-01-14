import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  importServices,
  downloadServiceTemplate,
} from "../../operations/service/serviceAction";
import ServicesList from "./ServicesList";
import ServiceForm from "./ServiceForm";
import {
  FaFileExcel,
  FaDownload,
  FaPlus,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import * as XLSX from "xlsx";

export default function ServicesManagement() {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Import Preview State
  const [previewData, setPreviewData] = useState([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleServiceCreated = () => {
    setRefreshKey((prev) => prev + 1);
    setShowCreate(false);
    setEditingService(null);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setShowCreate(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        setPreviewData(data);
        setShowPreviewModal(true);
      };
      reader.readAsBinaryString(file);
    }
    e.target.value = null; // Reset input
  };

  const confirmImport = () => {
    dispatch(importServices(previewData)).then((res) => {
      if (res.success) {
        setRefreshKey((prev) => prev + 1);
        setShowPreviewModal(false);
        setPreviewData([]);
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800">My Services</h2>
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx, .xls"
            className="hidden"
          />
          <button
            onClick={() => dispatch(downloadServiceTemplate())}
            className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded hover:bg-green-100 transition-colors"
          >
            <FaDownload /> Template
          </button>
          <button
            onClick={handleImportClick}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition-colors"
          >
            <FaFileExcel /> Import Excel
          </button>
          <button
            onClick={() => {
              setShowCreate(!showCreate);
              setEditingService(null); // Reset edit mode when toggling
            }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition-colors"
          >
            <FaPlus /> {showCreate ? "Cancel" : "Add New"}
          </button>
        </div>
      </div>

      {showCreate && (
        <ServiceForm
          initialData={editingService}
          onServiceCreated={handleServiceCreated}
        />
      )}

      <ServicesList refreshTrigger={refreshKey} onEdit={handleEdit} />

      {/* Import Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Confirm Import Data
              </h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <div className="overflow-auto flex-1 border border-gray-200 rounded mb-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {previewData.length > 0 &&
                      Object.keys(previewData[0]).map((key) => (
                        <th
                          key={key}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {key}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {previewData.map((row, idx) => (
                    <tr key={idx}>
                      {Object.values(row).map((val, i) => (
                        <td
                          key={i}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {previewData.length === 0 && (
                <p className="p-4 text-center text-gray-500">
                  No data found in file.
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmImport}
                disabled={previewData.length === 0}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
              >
                <FaCheck /> Confirm Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
