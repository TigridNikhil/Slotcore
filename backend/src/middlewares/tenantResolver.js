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
      hostname.includes("up.railway.app") || // Allow Railway production host to be a main domain
      (process.env.NODE_ENV === "development" && hostname === "localhost");

    // 0. Try API Key Resolution (Already set by a middleware if present)
    if (req.orgId) {
      const tenant = await Organization.findByPk(req.orgId, {
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
        ],
      });
      if (tenant) {
        req.tenant = tenant;
        return next();
      }
    }

    // 1. Try Header (Prioritize for local testing/API usage)
    const headerSlug = req.headers["x-tenant-slug"];
    const headerOrgId = req.headers["x-organization-id"];
    // 2. Try Query Param (For direct links/downloads)
    const querySlug = req.query.slug || req.query.tenant;

    console.log(
      `[TenantResolver] Host: ${hostname}, HeaderOrgId: ${headerOrgId}, HeaderSlug: ${headerSlug}, QuerySlug: ${querySlug}, Base: ${BASE_DOMAIN}`,
    );

    let subdomain = null;

    if (headerSlug && headerSlug !== "null" && headerSlug !== "undefined") {
      subdomain = headerSlug;
    } else if (querySlug && querySlug !== "null" && querySlug !== "undefined") {
      subdomain = querySlug;
    }
    // 3. Try Subdomain
    else if (!isMainDomain) {
      subdomain = hostname.split(".")[0];
    }

    // Find Organization
    let tenant = null;

    // A. Priority 1: Header Org ID (Common for widgets)
    if (headerOrgId && headerOrgId !== "null" && headerOrgId !== "undefined") {
      tenant = await Organization.findByPk(headerOrgId, {
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
        ],
      });
    }

    // B. Priority 2: Subdomain / Slug
    if (!tenant && subdomain) {
      tenant = await Organization.findOne({
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
        ],
      });
    }

    // If we have a tenant, set it and move on
    if (tenant) {
      req.tenant = tenant;
      req.orgId = tenant.id;
      req.isMainDomain = false;
      return next();
    }

    // If no tenant found and we are on main domain, pass through (no org context)
    if (isMainDomain) {
      req.isMainDomain = true;
      req.tenant = null;
      return next();
    }

    // If not main domain and no tenant found, it's a 404
    return res.notFound("Organization not found");
  } catch (error) {
    console.error("Tenant Resolution Error:", error);
    res.serverError(
      error.message,
      "Internal Server Error during tenant resolution",
    );
  }
};

module.exports = tenantResolver;
