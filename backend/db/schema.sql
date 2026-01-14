-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PLANS (Global Reference)
-- Subscription tiers for the Organization (e.g., Free, Premium)
CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE, -- 'free', 'pro'
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    features JSONB DEFAULT '{}', -- Feature flags/limits
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ORGANIZATIONS (Tenants)
-- The core tenant entity
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID REFERENCES plans(id),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE, -- Subdomain: org.slotcore.com
    logo_url TEXT,
    primary_color VARCHAR(7) DEFAULT '#4F46E5',
    settings JSONB DEFAULT '{}', -- Extra config
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for subdomain lookup (Performance Critical)
CREATE INDEX idx_organizations_slug ON organizations(slug);


-- 3. USERS (Org Admins)
-- Users belonging to an organization (Staff/Admins)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'admin', -- 'admin', 'staff'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure email is unique within an organization (or globally if preferred)
    -- For this MVP, assuming email unique per org allows same email in different orgs
    UNIQUE(org_id, email)
);

-- Index for login lookups
CREATE INDEX idx_users_org_email ON users(org_id, email);


-- 4. SERVICES
-- things that can be booked
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration_min INTEGER NOT NULL, -- e.g., 30, 60
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for listing services by org
CREATE INDEX idx_services_org ON services(org_id);


-- 5. BOOKINGS
-- The core transactional entity
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id),
    
    -- Customer Info (Denormalized for MVP, or could have a 'customers' table later)
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for querying bookings
CREATE INDEX idx_bookings_org_date ON bookings(org_id, start_time);
CREATE INDEX idx_bookings_service ON bookings(service_id);


-- 6. PAGE_SECTIONS (AI Content)
-- Stores the content for the organization's landing page
CREATE TABLE page_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    page_name VARCHAR(50) NOT NULL DEFAULT 'home', -- 'home', 'services'
    section_type VARCHAR(50) NOT NULL, -- 'hero', 'about', 'testimonials', 'footer'
    content JSONB NOT NULL DEFAULT '{}', -- AI generated text: { headline: "...", body: "..." }
    display_order INTEGER NOT NULL DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for retrieving page content quickly
CREATE INDEX idx_page_sections_org_page ON page_sections(org_id, page_name, display_order);
