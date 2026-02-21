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

function App() {
  // Simple subdomain detection
  const hostname = window.location.hostname;
  const isMainDomain =
    hostname === "localhost" ||
    hostname === "slotcore.com" ||
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

          {/* Public Booking */}
          <Route path="/book" element={<BookingPage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/booking/:id" element={<ManageBooking />} />
          <Route path="/review/:bookingId" element={<ReviewSubmission />} />

          {/* Protected Dashboard */}
          <Route path="/dashboard/*" element={<Dashboard />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
