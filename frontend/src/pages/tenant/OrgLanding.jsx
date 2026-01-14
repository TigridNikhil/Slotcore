import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../../utils/baseurl";

import ModernTemplate from "./templates/ModernTemplate";
import ClassicTemplate from "./templates/ClassicTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";

export default function OrgLanding() {
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchOrgInfo = async () => {
      try {
        // Preview Mode Support: If ?org=demo is present, set it as tenant context
        const previewSlug = searchParams.get("org");
        if (previewSlug) {
          localStorage.setItem("tenantSlug", previewSlug);
        }

        const res = await axiosInstance.get("/organization/public");
        setOrg(res.data);
      } catch (err) {
        console.error("Failed to load org info:", err);
        setError("Organization not found or inactive.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrgInfo();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !org) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-gray-600 text-lg mb-8">
          {error || "Organization not found."}
        </p>
        <Link
          to="/"
          className="text-indigo-600 hover:text-indigo-500 font-medium"
        >
          Go to Slotcore Home
        </Link>
      </div>
    );
  }

  // Template Selection Logic
  const template = org.settings?.template || "modern";

  switch (template) {
    case "classic":
      return <ClassicTemplate org={org} />;
    case "minimal":
      return <MinimalTemplate org={org} />;
    case "modern":
    default:
      return <ModernTemplate org={org} />;
  }
}
