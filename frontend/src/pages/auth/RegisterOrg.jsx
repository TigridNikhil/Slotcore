import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerOrg } from "../../operations/auth/authAction";
import { axiosInstance } from "../../utils/baseurl";
import {
  FaBuilding,
  FaUser,
  FaEnvelope,
  FaLock,
  FaCheckCircle,
  FaArrowRight,
  FaShieldAlt,
  FaRocket,
  FaChartLine,
} from "react-icons/fa";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function RegisterOrg() {
  const [formData, setFormData] = useState({
    orgName: "",
    adminName: "",
    email: "",
    password: "",
    category: "",
    categoryId: null,
    phone: "",
  });

  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axiosInstance.get("/categories");
        setCategories(res.data.data);
      } catch (err) {
        console.error("Failed to fetch categories");
      } finally {
        setLoadingCats(false);
      }
    };
    fetchCats();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    const matched = categories.find((c) => c.name === val);
    setFormData((prev) => ({
      ...prev,
      category: val,
      categoryId: matched ? matched.id : null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerOrg(formData));
    if (result && result.success) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.role === "admin" && !result.organization.onboardingCompleted) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-neutral-50 to-primary-50 flex">
      {/* Left Panel - Premium Branding */}
      <div className="hidden lg:flex w-2/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-800"></div>

        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-300 to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary-400/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-secondary-400/10 blur-3xl"></div>

        <div className="relative z-10 p-12 flex flex-col justify-between">
          <div>
            <Link to="/" className="inline-flex items-center gap-3 mb-16 group">
              <div className="flex items-center gap-3 mb-6">
                <img src="/logo.png" alt="Slotcore" className="h-10" />

                <span className="text-2xl font-bold text-white">Slotcore</span>
              </div>
            </Link>

            <h1 className="text-5xl font-bold mb-8 text-white leading-tight">
              Start Your
              <br />
              <span className="bg-gradient-to-r from-secondary-300 to-primary-300 bg-clip-text text-transparent">
                Digital Transformation
              </span>
            </h1>

            <div className="space-y-6">
              {[
                {
                  icon: <FaRocket className="text-secondary-300" />,
                  text: "14-day free trial, no credit card required",
                },
                {
                  icon: <FaShieldAlt className="text-secondary-300" />,
                  text: "Enterprise-grade security & compliance",
                },
                {
                  icon: <FaChartLine className="text-secondary-300" />,
                  text: "Advanced analytics & reporting",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 text-white/90"
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-lg">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="border-t border-white/10 pt-8">
            <p className="text-white/70 text-sm mb-4">
              Trusted by thousands of businesses
            </p>
            <div className="flex items-center gap-8">
              <div className="text-white font-bold text-2xl opacity-80">
                TechCorp
              </div>
              <div className="text-white font-bold text-2xl opacity-80">
                MediCare
              </div>
              <div className="text-white font-bold text-2xl opacity-80">
                EduSoft
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative">
        {/* Decorative Elements */}
        <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-primary-100/50 blur-xl"></div>
        <div className="absolute bottom-8 left-8 w-32 h-32 rounded-full bg-secondary-100/30 blur-xl"></div>

        <Link
          to="/"
          className="absolute top-8 left-8 text-neutral-600 hover:text-primary-600 transition-colors flex items-center gap-2 font-medium group"
        >
          <div className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center group-hover:border-primary-300 transition-colors">
            ←
          </div>
          <span>Back to Home</span>
        </Link>

        <div className="max-w-lg w-full relative z-10">
          {/* Form Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-medium mb-6">
              <FaRocket className="text-sm" />
              <span>Start your free trial today</span>
            </div>
            <h2 className="text-4xl font-bold text-neutral-900 mb-3">
              Create Your Organization
            </h2>
            <p className="text-neutral-600 text-lg">
              Join thousands of businesses that trust Slotcore
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-100">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                </div>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
              <div className="space-y-6">
                {/* Organization Info */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                    <FaBuilding className="text-primary-600" />
                    Organization Details
                  </h3>
                  <Input
                    label="Organization Name"
                    name="orgName"
                    placeholder="e.g. Acme Clinic"
                    value={formData.orgName}
                    onChange={handleChange}
                    required
                    icon={<FaBuilding className="text-neutral-400" />}
                    size="lg"
                  />
                </div>

                {/* Category Input with Suggestions */}
                <div>
                  <label className="block mb-3 text-sm font-medium text-neutral-700">
                    Business Category
                  </label>

                  <input
                    list="business-categories"
                    placeholder={
                      loadingCats
                        ? "Loading categories..."
                        : "Select or type business category"
                    }
                    value={formData.category || ""}
                    onChange={handleCategoryChange}
                    className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm
               placeholder:text-neutral-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  />

                  <datalist id="business-categories">
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name} />
                    ))}
                  </datalist>
                </div>

                {/* Admin Details */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                    <FaUser className="text-primary-600" />
                    Administrator Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      name="adminName"
                      placeholder="John Doe"
                      value={formData.adminName}
                      onChange={handleChange}
                      required
                      icon={<FaUser className="text-neutral-400" />}
                    />
                    <Input
                      label="Phone Number"
                      name="phone"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={handleChange}
                      icon={<FaBuilding className="text-neutral-400" />}
                    />
                  </div>
                </div>

                {/* Account Credentials */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                    <FaLock className="text-primary-600" />
                    Account Credentials
                  </h3>
                  <div className="space-y-4">
                    <Input
                      label="Email Address"
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      icon={<FaEnvelope className="text-neutral-400" />}
                      size="lg"
                    />
                    <Input
                      label="Password"
                      type="password"
                      name="password"
                      placeholder="Create a secure password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      icon={<FaLock className="text-neutral-400" />}
                      size="lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Submit */}
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 w-4 h-4 text-primary-600 bg-white border-neutral-300 rounded focus:ring-primary-500 focus:ring-2"
                />
                <label htmlFor="terms" className="text-sm text-neutral-600">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full group"
                size="xl"
                variant="gradient"
              >
                <span className="flex items-center justify-center gap-3">
                  <span>Create Organization</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>

              <div className="text-center pt-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-neutral-500">
                      Already have an account?
                    </span>
                  </div>
                </div>
                <Link
                  to="/login"
                  className="mt-4 inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                >
                  Sign in to your account
                  <FaArrowRight className="text-sm" />
                </Link>
              </div>
            </div>
          </form>

          {/* Security Badge */}
          <div className="mt-10 pt-6 border-t border-neutral-200">
            <div className="flex items-center justify-center gap-3 text-neutral-500 text-sm">
              <FaShieldAlt className="text-green-500" />
              <span>256-bit encryption • SOC 2 compliant • GDPR ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
