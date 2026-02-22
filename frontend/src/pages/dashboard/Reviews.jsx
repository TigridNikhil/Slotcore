import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaStar,
  FaSearch,
  FaFilter,
  FaReply,
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
} from "react-icons/fa";
import { axiosInstance } from "../../utils/baseurl";
import { showNotification } from "../../utils/toastmessage";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL"); // ALL, APPROVED, PENDING, REJECTED
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [moderatingId, setModeratingId] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [page, filter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (filter !== "ALL") params.status = filter;

      const response = await axiosInstance.get("/organization/reviews", {
        params,
      });
      setReviews(response.data.data.reviews || []);
      setTotalPages(response.data.data.totalPages || 1);
    } catch (error) {
      console.error("Fetch Reviews Error:", error);
      showNotification({ type: "ERROR", message: "Failed to fetch reviews" });
    } finally {
      setLoading(false);
    }
  };

  const moderateReview = async (id, action) => {
    setModeratingId(id);
    try {
      await axiosInstance.patch(`/organization/reviews/${id}/moderation`, {
        action,
      });
      showNotification({
        type: "SUCCESS",
        message: `Review ${action === "APPROVE" ? "approved" : "rejected"} successfully`,
      });
      fetchReviews();
    } catch (error) {
      console.error("Moderate Review Error:", error);
      showNotification({
        type: "ERROR",
        message: "Failed to update review status",
      });
    } finally {
      setModeratingId(null);
    }
  };

  const statusColors = {
    APPROVED: "bg-green-100 text-green-800 border-green-200",
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    REJECTED: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
          <p className="text-gray-500 mt-1">
            See what customers are saying about your services
          </p>
        </div>
        <div className="flex gap-2">
          {/* Filter Buttons */}
          {["ALL", "APPROVED", "PENDING", "REJECTED"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <FaStar className="text-4xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No Reviews Yet</h3>
          <p className="text-gray-500">
            Reviews will appear here once customers leave feedback.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {reviews.map((review) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={review.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg">
                    {review.reviewerName?.charAt(0) || <FaUser />}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {review.reviewerName || "Anonymous"}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex text-yellow-400 text-sm">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={
                              i < review.rating
                                ? "text-yellow-400"
                                : "text-gray-200"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    statusColors[review.status] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {review.status}
                </span>
              </div>

              <div className="mt-4 pl-16">
                <p className="text-gray-700 leading-relaxed">
                  {review.comment || "No comment provided."}
                </p>
              </div>

              {/* Approve / Reject Actions */}
              <div className="mt-4 pl-16 pt-4 border-t border-gray-50 flex gap-3">
                {review.status !== "APPROVED" && (
                  <button
                    onClick={() => moderateReview(review.id, "APPROVE")}
                    disabled={moderatingId === review.id}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaCheckCircle />
                    Approve
                  </button>
                )}
                {review.status !== "REJECTED" && (
                  <button
                    onClick={() => moderateReview(review.id, "REJECT")}
                    disabled={moderatingId === review.id}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaTimesCircle />
                    Reject
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
