import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../operations/auth/authAction";
import { FaLock, FaKey, FaShieldAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!formData.email) {
      navigate("/forgot-password");
    }
  }, [formData.email, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const result = await dispatch(
      resetPassword({
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      }),
    );
    if (result.success) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-neutral-50 to-primary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-medium mb-6">
            <FaShieldAlt className="text-sm" />
            <span>Verify Identity</span>
          </div>
          <h2 className="text-4xl font-bold text-neutral-900 mb-3">
            Reset Password
          </h2>
          <p className="text-neutral-600 text-lg">
            Enter the 6-digit code sent to <strong>{formData.email}</strong>
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div className="space-y-2">
              <Input
                label="Verification Code (OTP)"
                name="otp"
                placeholder="6-digit code"
                value={formData.otp}
                onChange={handleChange}
                required
                icon={<FaKey className="text-neutral-400" />}
                maxLength={6}
              />
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Input
                label="New Password"
                type={showPassword ? "text" : "password"}
                name="newPassword"
                placeholder="Create a strong password"
                value={formData.newPassword}
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <Input
                label="Confirm New Password"
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Repeat your new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                icon={<FaLock className="text-neutral-400" />}
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="xl"
            >
              Reset Password
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <p className="text-neutral-500">
              Wait, I remember it!{" "}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Back to Login
              </Link>
            </p>
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-8 pt-6 border-t border-neutral-200/50">
          <div className="flex items-center justify-center gap-3 text-neutral-500 text-xs font-medium">
            <FaShieldAlt className="text-green-500" />
            <span>Encrypted transmission • Secure reset</span>
          </div>
        </div>
      </div>
    </div>
  );
}
