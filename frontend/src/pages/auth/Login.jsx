import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../../operations/auth/authAction";
import {
  FaEnvelope,
  FaLock,
  FaBuilding,
  FaArrowRight,
  FaShieldAlt,
  FaRocket,
  FaChartLine,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { SiTrustpilot } from "react-icons/si";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function Login({ isMainDomain }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    slug: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      if (localStorage.getItem("isNewPass")) {
        // Handle password reset flow if needed
      }
      navigate("/dashboard");
    }
    return () => {
      dispatch(clearError());
    };
  }, [user, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
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
              Welcome Back
              <br />
              <span className="bg-gradient-to-r from-secondary-300 to-primary-300 bg-clip-text text-transparent">
                To Your Dashboard
              </span>
            </h1>

            <div className="space-y-6">
              {[
                {
                  icon: <FaChartLine className="text-secondary-300" />,
                  text: "Real-time analytics & insights",
                },
                {
                  icon: <FaShieldAlt className="text-secondary-300" />,
                  text: "Enterprise-grade security",
                },
                {
                  icon: <FaRocket className="text-secondary-300" />,
                  text: "Fast & reliable performance",
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
        </div>
      </div>

      {/* Right Panel - Login Form */}
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

        <div className="max-w-md w-full relative z-10">
          {/* Form Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-medium mb-6">
              <FaShieldAlt className="text-sm" />
              <span>Secure Login Portal</span>
            </div>
            <h2 className="text-4xl font-bold text-neutral-900 mb-3">
              Sign In to Your Account
            </h2>
            <p className="text-neutral-600 text-lg">
              Access your dashboard and continue growing your business
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-100 animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                </div>
                <div>
                  <p className="text-red-700 font-medium">Login Failed</p>
                  <p className="text-red-600 text-sm mt-1">
                    {typeof error === "string"
                      ? error
                      : "Invalid credentials. Please try again."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Organization Slug (for main domain) */}
              {isMainDomain && (
                <div className="space-y-2">
                  <Input
                    label="Organization Domain"
                    name="slug"
                    placeholder="your-company"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    icon={<FaBuilding className="text-neutral-400" />}
                    rightElement={
                      <span className="text-neutral-500 text-sm whitespace-nowrap">
                        .slotcore.com
                      </span>
                    }
                    className="pr-28"
                  />
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  icon={<FaEnvelope className="text-neutral-400" />}
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-neutral-700">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  icon={<FaLock className="text-neutral-400" />}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-neutral-400 hover:text-neutral-600 transition-colors focus:outline-none"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  }
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                        rememberMe
                          ? "bg-primary-500 border-primary-500"
                          : "border-neutral-300"
                      }`}
                    >
                      {rememberMe && (
                        <FaCheckCircle className="text-white text-xs" />
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-neutral-700">
                    Remember this device
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                loading={loading}
                className="w-full"
                size="xl"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-8 text-center text-sm">
              <p className="text-neutral-500">
                New to Slotcore?{" "}
                <Link
                  to="/register"
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  Create your Organization
                </Link>
              </p>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-8 pt-6 border-t border-neutral-200/50">
            <div className="flex items-center justify-center gap-3 text-neutral-500 text-xs font-medium">
              <FaShieldAlt className="text-green-500" />
              <span>256-bit encryption • SOC 2 compliant • GDPR ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Star component for testimonials
function FaStar(props) {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" {...props}>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}
