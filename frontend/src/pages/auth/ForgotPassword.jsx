import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPasswordRequest } from "../../operations/auth/authAction";
import { FaEnvelope, FaShieldAlt, FaArrowRight } from "react-icons/fa";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(forgotPasswordRequest(email));
    if (result.success) {
      // Redirect to reset password page, passing email in state
      navigate("/reset-password", { state: { email } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-neutral-50 to-primary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-medium mb-6">
            <FaShieldAlt className="text-sm" />
            <span>Secure Password Recovery</span>
          </div>
          <h2 className="text-4xl font-bold text-neutral-900 mb-3">
            Forgot Password?
          </h2>
          <p className="text-neutral-600 text-lg">
            Enter your email and we'll send you a 6-digit OTP to reset your
            password.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                icon={<FaEnvelope className="text-neutral-400" />}
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="xl"
            >
              Send OTP <FaArrowRight className="ml-2 text-sm" />
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <p className="text-neutral-500">
              Remember your password?{" "}
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
            <span>Protected by 256-bit encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}
