import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utils/baseurl";
import { FaStar, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ReviewSubmission() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [bookingInfo, setBookingInfo] = useState(null);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchBookingInfo();
  }, [bookingId]);

  const fetchBookingInfo = async () => {
    try {
      const res = await axiosInstance.get(
        `/marketplace/reviews/booking/${bookingId}`
      );
      setBookingInfo(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid review link");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      await axiosInstance.post("/marketplace/reviews/submit", {
        bookingId,
        rating,
        comment,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FaSpinner className="animate-spin text-3xl text-indigo-600" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-3xl text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your review has been submitted and is pending moderation.
          </p>
          <button
            onClick={() => navigate("/marketplace")}
            className="w-full bg-indigo-600 text-white font-medium py-3 rounded-xl hover:bg-indigo-700 transition"
          >
            Back to Marketplace
          </button>
        </motion.div>
      </div>
    );
  }

  if (error && !bookingInfo) {
    // Fatal error (invalid link)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/marketplace")}
            className="w-full bg-gray-100 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-200 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden"
      >
        {/* Header */}
        <div className="bg-indigo-600 p-8 text-center text-white">
          <h1 className="text-2xl font-bold mb-2">How was your experience?</h1>
          {bookingInfo && (
            <p className="text-indigo-100">
              Hi {bookingInfo.customerName}, please rate your visit to
              <span className="font-semibold block text-white mt-1 text-lg">
                {bookingInfo.organization?.name}
              </span>
            </p>
          )}
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit}>
            {/* Star Rating */}
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="text-4xl focus:outline-none transition-transform hover:scale-110"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <FaStar
                    className={`transition-colors duration-200 ${
                      star <= (hoverRating || rating)
                        ? "text-yellow-400"
                        : "text-gray-200"
                    }`}
                  />
                </button>
              ))}
            </div>

            {rating > 0 && (
              <div className="text-center text-sm font-medium text-gray-500 mb-6 animate-fade-in">
                {rating === 5 && "Excellent! ⭐⭐⭐⭐⭐"}
                {rating === 4 && "Good! ⭐⭐⭐⭐"}
                {rating === 3 && "Average ⭐⭐⭐"}
                {rating === 2 && "Poor ⭐⭐"}
                {rating === 1 && "Terrible ⭐"}
              </div>
            )}

            {/* Comment */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share your feedback (optional)
              </label>
              <textarea
                rows={4}
                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 p-4"
                placeholder="Tell us what you liked or what could be improved..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
