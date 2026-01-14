import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateOrganization } from "../../../operations/ai/aiAction";
import { FaSave, FaPlus, FaTrash } from "react-icons/fa";

export default function ContentEditor({ initialData, onSave }) {
  const [formData, setFormData] = useState({
    heroTagline: "",
    heroSubheadline: "",
    aboutUs: "",
    hours: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    testimonials: [],
    faqs: [],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        heroTagline: initialData.content?.heroTagline || "",
        heroSubheadline: initialData.content?.heroSubheadline || "",
        aboutUs: initialData.content?.aboutUs || "",
        hours: initialData.content?.hours || "",
        contactEmail: initialData.contactEmail || "",
        contactPhone: initialData.contactPhone || "",
        address: initialData.address || "",
        testimonials: initialData.content?.testimonials || [],
        faqs: initialData.content?.faqs || [],
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Helper for array fields (Testimonials/FAQs)
  const updateArrayItem = (field, index, key, value) => {
    const newArray = [...formData[field]];
    newArray[index] = { ...newArray[index], [key]: value };
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const addItem = (field, item) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], item] }));
  };

  const removeItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    // Split content fields vs contact fields
    const content = {
      heroTagline: formData.heroTagline,
      heroSubheadline: formData.heroSubheadline,
      aboutUs: formData.aboutUs,
      hours: formData.hours,
      testimonials: formData.testimonials,
      faqs: formData.faqs,
    };

    onSave({
      content,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      address: formData.address,
    });
  };

  return (
    <div className="space-y-8">
      {/* General Info */}
      <section className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-xl font-bold mb-6">General Information</h2>
        <div className="grid gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Hero Tagline
            </label>
            <input
              type="text"
              name="heroTagline"
              value={formData.heroTagline}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              placeholder="Welcome to my business"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Hero Subheadline
            </label>
            <textarea
              name="heroSubheadline"
              value={formData.heroSubheadline}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg h-20"
              placeholder="A short description..."
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              About Us
            </label>
            <textarea
              name="aboutUs"
              value={formData.aboutUs}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg h-32"
              placeholder="Tell your story..."
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Opening Hours
            </label>
            <input
              type="text"
              name="hours"
              value={formData.hours}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              placeholder="Mon - Fri: 9am - 5pm"
            />
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-xl font-bold mb-6">Contact Details</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="text"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Testimonials</h2>
          <button
            onClick={() =>
              addItem("testimonials", { name: "", text: "", rating: 5 })
            }
            className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded flex items-center gap-1 hover:bg-indigo-200"
          >
            <FaPlus /> Add
          </button>
        </div>
        <div className="space-y-4">
          {formData.testimonials.map((item, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-lg relative group">
              <button
                onClick={() => removeItem("testimonials", idx)}
                className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FaTrash />
              </button>
              <div className="grid gap-3">
                <input
                  type="text"
                  placeholder="Client Name"
                  value={item.name}
                  onChange={(e) =>
                    updateArrayItem("testimonials", idx, "name", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
                <textarea
                  placeholder="Review Text"
                  value={item.text}
                  onChange={(e) =>
                    updateArrayItem("testimonials", idx, "text", e.target.value)
                  }
                  className="w-full p-2 border rounded h-20"
                />
                <input
                  type="number"
                  max="5"
                  min="1"
                  placeholder="Rating (1-5)"
                  value={item.rating}
                  onChange={(e) =>
                    updateArrayItem(
                      "testimonials",
                      idx,
                      "rating",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-20 p-2 border rounded"
                />
              </div>
            </div>
          ))}
          {formData.testimonials.length === 0 && (
            <p className="text-gray-400 text-sm italic">
              No testimonials added.
            </p>
          )}
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">FAQs</h2>
          <button
            onClick={() => addItem("faqs", { question: "", answer: "" })}
            className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded flex items-center gap-1 hover:bg-indigo-200"
          >
            <FaPlus /> Add
          </button>
        </div>
        <div className="space-y-4">
          {formData.faqs.map((item, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-lg relative group">
              <button
                onClick={() => removeItem("faqs", idx)}
                className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FaTrash />
              </button>
              <div className="grid gap-3">
                <input
                  type="text"
                  placeholder="Question"
                  value={item.question}
                  onChange={(e) =>
                    updateArrayItem("faqs", idx, "question", e.target.value)
                  }
                  className="w-full p-2 border rounded font-bold"
                />
                <textarea
                  placeholder="Answer"
                  value={item.answer}
                  onChange={(e) =>
                    updateArrayItem("faqs", idx, "answer", e.target.value)
                  }
                  className="w-full p-2 border rounded h-24"
                />
              </div>
            </div>
          ))}
          {formData.faqs.length === 0 && (
            <p className="text-gray-400 text-sm italic">No FAQs added.</p>
          )}
        </div>
      </section>

      <button
        onClick={handleSave}
        className="w-full md:w-auto bg-gray-900 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 text-lg shadow-lg"
      >
        <FaSave /> Save Content
      </button>
    </div>
  );
}
