const { Organization } = require("../models");

/**
 * Tenant Resolver Middleware
 * Resolves the organization based on the subdomain.
 */
const tenantResolver = async (req, res, next) => {
  try {
    const hostname = req.hostname;
    // Default to main domain if using IP or localhost without subdomain
    // In production, BASE_DOMAIN should be set (e.g., 'slotcore.com')
    const BASE_DOMAIN = process.env.BASE_DOMAIN || "localhost";

    // Check if we are on the main domain or a reserved subdomain
    const isMainDomain =
      hostname === BASE_DOMAIN ||
      hostname === `www.${BASE_DOMAIN}` ||
      (process.env.NODE_ENV === "development" && hostname === "localhost"); // Handle plain localhost

    let subdomain = null;

    // 1. Try Header (Prioritize for local testing/API usage)
    const headerSlug = req.headers["x-tenant-slug"];
    // 2. Try Query Param (For direct links/downloads)
    const querySlug = req.query.slug || req.query.tenant;

    console.log(
      `[TenantResolver] Host: ${hostname}, HeaderSlug: ${headerSlug}, QuerySlug: ${querySlug}, Base: ${BASE_DOMAIN}`,
    );

    if (headerSlug) {
      subdomain = headerSlug;
    } else if (querySlug) {
      subdomain = querySlug;
    }
    // 3. Try Subdomain
    else if (!isMainDomain) {
      subdomain = hostname.split(".")[0];
    }

    // If no subdomain determined and we are on main domain, pass through
    if (!subdomain && isMainDomain) {
      req.isMainDomain = true;
      req.tenant = null;
      return next();
    }

    // Sanity check: if hostname doesn't contain base domain using subdomain extraction
    if (
      !headerSlug && // Skip check if using header
      !hostname.includes(BASE_DOMAIN) &&
      process.env.NODE_ENV !== "development"
    ) {
      return res.status(404).json({ error: "Invalid domain configuration" });
    }

    // Find Organization
    const tenant = await Organization.findOne({
      where: { slug: subdomain, isActive: true },
      attributes: [
        "id",
        "name",
        "slug",
        "primaryColor",
        "logoUrl",
        "settings",
        "content",
        "contactEmail",
        "contactPhone",
        "address",
      ], // Select only needed fields
    });

    if (!tenant) {
      return res.status(404).json({ error: "Organization not found" });
    }

    // Attach to request
    req.tenant = tenant;
    req.orgId = tenant.id;
    req.isMainDomain = false;

    next();
  } catch (error) {
    console.error("Tenant Resolution Error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error during tenant resolution" });
  }
};

module.exports = tenantResolver;
