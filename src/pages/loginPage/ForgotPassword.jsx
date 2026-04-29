import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import HomePage from "../../assets/HomePage.png";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email ID.");
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      // Simulated API CALL
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setMessage("Reset link sent successfully to your email.");
      setEmail("");
    } catch (err) {
        console.log(err);
        
      setError("Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f6f9] p-4 sm:p-8 font-sans">
      <div className="w-full max-w-[1000px] bg-white rounded-[2.5rem] shadow-xl flex p-3 min-h-[650px]">
        {/* Left Side - Image */}
        <div className="hidden md:block w-1/2 relative h-full">
          <img
            src={HomePage}
            alt="HomePage"
            className="w-full h-full object-cover rounded-[2rem]"
          />
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-8">
          <div className="w-full max-w-[380px] mx-auto">
            <div className="mb-10">
              <h1 className="text-[32px] font-bold text-[#0f172a] tracking-tight mb-3">
                Reset Password
              </h1>
              <p className="text-[14px] text-[#64748b] leading-relaxed">
                Enter your email and we'll send you
                <br className="hidden sm:block" />
                a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleReset} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-[13px] font-semibold text-[#334155]">
                  Email ID
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="yourname@beyondliving.com"
                    className={`bg-white border shadow-sm text-[#334155] text-[14px] rounded-full h-[48px] px-5 w-full focus:outline-none focus:ring-1 transition-all border-[#1e3a8a] border-x-3 border-y-0 placeholder-[#cbd5e1] ${
                      error
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-[#1e3a8a] focus:border-[#1e3a8a] focus:ring-[#1e3a8a]"
                    }`}
                  />
                </div>
                {error && <p className="text-red-500 text-[11px] pl-2">{error}</p>}
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full h-[48px] rounded-full text-[14px] font-semibold text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-[#0a1b49]/80 cursor-not-allowed"
                    : "bg-[#0a1b49] hover:bg-[#071336] active:scale-[0.98]"
                }`}
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : null}
                <span>{loading ? "Sending..." : "Send Reset Link →"}</span>
              </button>

              {/* Back Button */}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full h-[48px] rounded-full border border-[#cbd5e1] bg-white text-[#334155] font-semibold text-[14px] hover:bg-gray-50 transition-all flex items-center justify-center"
              >
                ← Back to Login
              </button>

              {/* Success Message */}
              {message && (
                <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-center mt-4">
                  <p className="text-green-600 text-[13px] font-medium">
                    {message}
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}