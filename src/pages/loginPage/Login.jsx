import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2, Check } from "lucide-react";
import Google from "../../assets/Google.png";
import HomePage from "../../assets/HomePage.png";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    keepSigned: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate("/dashboard");
      }, 1500);
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
            <div className="mb-8">
              <h1 className="text-[32px] font-bold text-[#0f172a] tracking-tight mb-2">
                Welcome back
              </h1>
              <p className="text-[14px] text-[#64748b]">
                Enter your credentials to access your studio dashboard.
              </p>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-1 bg-white border border-x-3 border-y-0 border-[#1e293b] shadow-sm rounded-full py-3 text-[14px] font-semibold text-[#0f172a] hover:bg-gray-50 transition-all mb-8"
            >
              <img src={Google} alt="Google" className="h-10 w-12 object-contain" />
              Continue with Google
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-[1px] bg-[#e2e8f0]"></div>
              <span className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider">
                Or Login With Email
              </span>
              <div className="flex-1 h-[1px] bg-[#e2e8f0]"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-semibold text-[#334155]">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 text-[#94a3b8]" size={18} strokeWidth={2} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@atelier.com"
                    className={`bg-white border border-x-3 border-y-0 border-[#1e293b] shadow-sm text-[#334155] text-[14px] rounded-full h-[48px] pl-11 pr-4 w-full focus:outline-none focus:ring-1 transition-all placeholder-[#cbd5e1] ${
                      errors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-[#1e3a8a] focus:border-[#1e3a8a] focus:ring-[#1e3a8a]"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-[11px] pl-2">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-semibold text-[#334155]">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 text-[#94a3b8]" size={18} strokeWidth={2} />
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`bg-white border border-x-3 border-y-0 border-[#1e293b] shadow-sm text-[#334155] text-[14px] rounded-full h-[48px] pl-11 pr-11 w-full focus:outline-none focus:ring-1 transition-all placeholder-[#cbd5e1] ${
                      errors.password
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-[#1e3a8a] focus:border-[#1e3a8a] focus:ring-[#1e3a8a]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 text-[#94a3b8] hover:text-[#475569] transition-colors"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-[11px] pl-2">{errors.password}</p>
                )}
              </div>

              {/* Forgot password */}
              <div className="flex justify-end pt-1">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/forgot-password");
                  }}
                  className="text-[13px] font-medium text-[#1e3a8a] hover:underline transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              {/* Keep signed in */}
              <div className="pt-2 pb-4">
                <label className="flex items-center gap-2 cursor-pointer w-fit group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      name="keepSigned"
                      checked={formData.keepSigned}
                      onChange={handleChange}
                      className="peer appearance-none w-4 h-4 border border-[#cbd5e1] rounded-[4px] checked:bg-[#0a1b49] checked:border-[#0a1b49] transition-all cursor-pointer bg-white"
                    />
                    <Check
                      className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                      strokeWidth={3}
                    />
                  </div>
                  <span className="text-[13px] font-medium text-[#64748b]">
                    Keep me signed in
                  </span>
                </label>
              </div>

              {/* Submit Button */}
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
                <span>{loading ? "Signing in..." : "Sign In"}</span>
              </button>

              <p className="text-center text-[13px] font-medium text-[#64748b] pt-4">
                Don't have an account?{" "}
                <a href="#" className="text-[#0a1b49] font-bold hover:underline">
                  Create an account
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
