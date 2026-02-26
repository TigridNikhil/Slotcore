import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheck, FaTimes, FaStar } from "react-icons/fa";

// Configure Axios
const api = axios.create({
  baseURL: "http://localhost:5000/api/platform",
});

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING"); // PENDING | APPROVED | REJECTED

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    try {
      const res = await api.get("/reviews", { params: { status: filter } });
      setReviews(res.data.data);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setLoading(false);
    }
  };

  const moderateReview = async (id, action) => {
    try {
      await api.patch(`/reviews/${id}/moderation`, { action });
      // Remove from list or update status locally
      setReviews(reviews.filter((r) => r.id !== id));
    } catch (err) {
      alert("Moderation failed");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Review Moderation</h1>
        <div className="flex bg-white rounded-lg p-1 border border-gray-200">
          {["PENDING", "APPROVED", "REJECTED"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                filter === status
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        {reviews.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No {filter.toLowerCase()} reviews found.
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-700">
                  Organization
                </th>
                <th className="p-4 font-semibold text-gray-700">Reviewer</th>
                <th className="p-4 font-semibold text-gray-700">Rating</th>
                <th className="p-4 font-semibold text-gray-700 w-1/3">
                  Comment
                </th>
                <th className="p-4 font-semibold text-gray-700">Date</th>
                {filter === "PENDING" && (
                  <th className="p-4 font-semibold text-gray-700 text-right">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">
                    {review.Organization?.name || "Unknown Org"}
                  </td>
                  <td className="p-4 text-gray-600">
                    {review.reviewerName || "Anonymous"}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center text-yellow-400 gap-1">
                      <FaStar />
                      <span className="text-gray-900 font-bold">
                        {review.rating}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    {review.comment || (
                      <span className="italic text-gray-400">No comment</span>
                    )}
                  </td>
                  <td className="p-4 text-gray-500 text-sm">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  {filter === "PENDING" && (
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => moderateReview(review.id, "APPROVE")}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-sm font-medium transition"
                        >
                          <FaCheck /> Approve
                        </button>
                        <button
                          onClick={() => moderateReview(review.id, "REJECT")}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium transition"
                        >
                          <FaTimes /> Reject
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
