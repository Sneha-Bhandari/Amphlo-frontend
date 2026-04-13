"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Store, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/app/(cms)/admin/contexts/AuthContext";
import { postData } from "@/lib/frontendApi";

export default function CmsLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { checkAuth, loggedIn } = useAuth();

  useEffect(() => {
    if (loggedIn) {
      router.push("/admin");
    }
  }, [loggedIn, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      // Use postData instead of fetch
      const result = await postData("auth/login", { email, password });
      
      console.log("Login response:", result);
  
      if (!result || result.error) {
        setError(result?.message || result?.error || "Login failed");
        return;
      }
  
      // Store token if returned
      if (result.token) {
        localStorage.setItem("token", result.token);
      }
      
      if (result.accessToken) {
        localStorage.setItem("access_token", result.accessToken);
      }
      
      // Store user data
      const userData = result.user || result.data?.user || result;
      localStorage.setItem("cms_auth", JSON.stringify({ 
        loggedIn: true, 
        user: userData,
        timestamp: Date.now() 
      }));
      
      // Update AuthContext state
      await checkAuth();
      
      // Redirect to admin
      router.push("/admin");
  
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Server not reachable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gray-100/30 flex items-center justify-center p-3">
      <div className="relative w-full max-w-lg">
        <div className="relative bg-white backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-2">
                <div className="absolute -inset-4 bg-linear-to-r from-[#04413D] to-[#04413D]/50 rounded-full blur-lg opacity-20"></div>
                <div className="relative w-16 h-16 bg-linear-to-r from-[#04413D] to-[#04413D]/50 rounded-2xl flex items-center justify-center shadow-lg">
                  <Store className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-px w-8 bg-[#04413D]"></div>
                <p className="text-gray-800 text-sm">
                  Business Management Suite
                </p>
                <div className="h-px w-8 bg-[#04413D]"></div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold text-[#04413D] mb-3">Welcome Back</h2>
              <p className="text-gray-600">
                Sign in to access your dashboard and continue managing your business
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-900/10 border border-red-800/50 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-2 text-red-400">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm whitespace-pre-wrap">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </div>
                </label>

                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    required
                    className="w-full px-5 py-3 bg-gray-100/50 border border-gray-300 rounded-xl placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                  />
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </div>
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-5 py-3 bg-gray-100/50 border border-gray-300 rounded-xl placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all pr-12"
                  />

                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-600" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-white bg-[#04413D] font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}