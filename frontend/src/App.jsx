import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/auth/Login";
import RegisterOrg from "./pages/auth/RegisterOrg";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import BookingPage from "./pages/booking/BookingPage";
import NotFound from "./pages/NotFound";
import Home from "./pages/marketing/Home";
import About from "./pages/marketing/About";
import Contact from "./pages/marketing/Contact";
import Blog from "./pages/marketing/Blog";
import Partners from "./pages/marketing/Partners";
import TermsOfService from "./pages/legal/TermsOfService";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import OrgLanding from "./pages/tenant/OrgLanding";
import ScrollToTop from "./components/common/ScrollToTop";
import PricingPage from "./pages/marketing/PricingPage";
import MainLayout from "./layouts/MainLayout";

import ManageBooking from "./pages/public/ManageBooking";
import MarketplaceHome from "./pages/marketplace/MarketplaceHome";
import ReviewSubmission from "./pages/public/ReviewSubmission";
import Onboarding from "./pages/onboarding/Onboarding";

// Dashboard Sub-components
import OrgHome from "./pages/dashboard/OrgHome";
import Analytics from "./pages/dashboard/Analytics";
import CalendarView from "./pages/dashboard/CalendarView";
import CustomersList from "./pages/dashboard/crm/CustomersList";
import LocationManagement from "./pages/dashboard/locations/LocationManagement";
import Integrations from "./pages/dashboard/Integrations";
import TeamManagement from "./pages/dashboard/team/TeamManagement";
import ServicesManagement from "./pages/dashboard/ServicesManagement";
import BookingsList from "./pages/dashboard/BookingsList";
import AvailabilitySettings from "./pages/dashboard/availability/AvailabilitySettings";
import Reviews from "./pages/dashboard/Reviews";
import ResourcesList from "./pages/dashboard/resources/ResourcesList";
import AIContentGenerator from "./pages/dashboard/AIContentGenerator";
import AppearanceSettings from "./pages/dashboard/AppearanceSettings";
import NotificationSettings from "./pages/dashboard/NotificationSettings";
import Payments from "./pages/dashboard/Payments";
import ScanBooking from "./pages/dashboard/ScanBooking";
import OrganizationDetail from "./pages/dashboard/OrganizationDetail";

function App() {
  // Simple subdomain detection
  const hostname = window.location.hostname;
  const isMainDomain =
    hostname === "localhost" ||
    hostname === "slotcore.com" ||
    hostname === "slotcore.vercel.app" ||
    hostname.startsWith("www");

  return (
    <Router>
      <ScrollToTop />
      <div className="">
        <Routes>
          {/* Public / Landing based on Domain */}
          <Route
            path="/"
            element={
              isMainDomain ? (
                <MainLayout>
                  <Home />
                </MainLayout>
              ) : (
                <OrgLanding />
              )
            }
          />

          {/* Explicit Marketplace Route */}
          <Route path="/marketplace" element={<MarketplaceHome />} />

          {/* Debug/Preview Route for Localhost without Subdomains */}
          <Route path="/preview" element={<OrgLanding />} />

          {/* Marketing Pages with Layout */}
          <Route element={<MainLayout />}>
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Route>

          {/* Auth */}
          <Route
            path="/login"
            element={<Login isMainDomain={isMainDomain} />}
          />
          <Route path="/register" element={<RegisterOrg />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Public Booking */}
          <Route path="/book" element={<BookingPage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/booking/:id" element={<ManageBooking />} />
          <Route path="/review/:bookingId" element={<ReviewSubmission />} />

          {/* Protected Dashboard */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<OrgHome />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="calendar" element={<CalendarView />} />
            <Route path="customers" element={<CustomersList />} />
            <Route path="locations" element={<LocationManagement />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="team" element={<TeamManagement />} />
            <Route path="services" element={<ServicesManagement />} />
            <Route path="bookings" element={<BookingsList />} />
            <Route path="availability" element={<AvailabilitySettings />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="resources" element={<ResourcesList />} />
            <Route path="ai-studio" element={<AIContentGenerator />} />
            <Route path="appearance" element={<AppearanceSettings />} />
            <Route path="notifications" element={<NotificationSettings />} />
            <Route path="payments" element={<Payments />} />
            <Route path="scan" element={<ScanBooking />} />
            <Route path="organization" element={<OrganizationDetail />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
