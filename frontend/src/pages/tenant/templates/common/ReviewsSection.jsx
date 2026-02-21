import React, { useEffect, useState } from "react";
import { FaStar, FaQuoteLeft, FaCheckCircle } from "react-icons/fa";
import { axiosInstance } from "../../../../utils/baseurl";

export default function ReviewsSection({ orgId, primaryColor }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ average: 0, total: 0 });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axiosInstance.get(
          `/marketplace/orgs/${orgId}/reviews?limit=6`
        );
        setReviews(res.data.data.reviews);
        // We could fetch explicit stats, but we can also use Org's stats passed down or calculate from response if needed.
        // For now, let's rely on what's visible or simple display.
        // Actually, the GET /orgs/:id/reviews endpoint returns { reviews, total, ... }
        // We can use that.
      } catch (err) {
        console.error("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    if (orgId) fetchReviews();
  }, [orgId]);

  if (loading) return null; // Or skeleton
  if (reviews.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
            style={{
              backgroundColor: `${primaryColor}15`,
              color: primaryColor,
            }}
          >
            <FaCheckCircle /> Verified Reviews
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            What our customers say
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative"
            >
              <FaQuoteLeft className="text-4xl text-gray-100 absolute top-6 right-6" />

              <div className="flex text-yellow-400 mb-4 text-sm">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < review.rating ? "text-yellow-400" : "text-gray-200"
                    }
                  />
                ))}
              </div>

              <p className="text-gray-600 mb-6 italic min-h-[60px]">
                "{review.comment || "Rated highly."}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-sm">
                  {review.reviewerName ? review.reviewerName.charAt(0) : "A"}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">
                    {review.reviewerName || "Anonymous"}
                  </p>
                  <p className="text-xs text-gray-400">Verified Customer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
