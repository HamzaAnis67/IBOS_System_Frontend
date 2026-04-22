import { useState, FormEvent, useCallback } from "react";
import { useNavigate } from "react-router-dom";

type Role = "client" | "employee" | "admin";

interface Toast {
  message: string;
  type: "success" | "error";
}

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );

const Spinner = () => (
  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

function getPasswordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const strengthLabels = ["Weak", "Weak", "Fair", "Good", "Strong"];
const strengthColors = ["#E24B4A", "#E24B4A", "#F59E0B", "#22C55E", "#1D9E75"];

export default function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordStrength = getPasswordStrength(password);
  const emailError = touched.email && !emailValid;
  const passwordError =
    touched.password && password.length > 0 && password.length < 8;

  const showToast = useCallback(
    (message: string, type: "success" | "error") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    },
    [],
  );

  // const handleSubmit = async (e: FormEvent) => {
  //   e.preventDefault();
  //   setTouched({ email: true, password: true });
  //   if (!emailValid) return showToast("Please enter a valid email", "error");
  //   if (password.length < 8)
  //     return showToast("Password must be at least 8 characters", "error");
  //   setLoading(true);
  //   await new Promise((r) => setTimeout(r, 1500));
  //   setLoading(false);
  //   showToast("Login successful! Redirecting...", "success");
  //   setTimeout(() => navigate(`/${role}/dashboard`), 800);
  // };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    // 1. Client-side validation (keep this!)
    if (!emailValid) return showToast("Please enter a valid email", "error");
    if (password.length < 8)
      return showToast("Password must be at least 8 characters", "error");

    setLoading(true);

    try {
      // 2. The API Call
      const response = await fetch("https://ibos-system-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // Send credentials
      });

      const data = await response.json();
      if (role != data.data.user.role) {
        showToast("You are trying to access in wrong role", "error");
        return;
      }
      // console.log(data.data.user.id)
      setRole(data.data.user.role);

      if (!response.ok) {
        // 3. Handle Backend Errors (e.g., 401 Unauthorized)
        throw new Error(data.message || "Login failed");
      }

      // 4. Handle Success
      // Save the token (JWT) to localStorage or a cookie
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      localStorage.setItem("id", data.data.user.id);

      showToast("Login successful!", "success");
      setTimeout(() => navigate(`/${role}/dashboard`), 800);
    } catch (error: any) {
      // 5. Handle Network or Server errors
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      showToast("Please enter a valid email", "error");
      return;
    }
    showToast("Reset link sent to your email", "success");
    setForgotOpen(false);
    setForgotEmail("");
  };

  const roles: { key: Role; label: string }[] = [
    { key: "client", label: "Client" },
    { key: "employee", label: "Employee" },
    { key: "admin", label: "Admin" },
  ];

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-10"
      style={{ background: "#0c0c12" }}
    >
      {/* Enhanced Ambient Orbs */}
      <div className="animate-float-1 orb-purple absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none" />
      <div className="animate-float-2 orb-teal absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none" />
      {/* Extra center glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(83,74,183,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Toast */}
      {toast && (
        <div
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-2xl whitespace-nowrap animate-fade-in-up"
          style={{
            background: toast.type === "success" ? "#1D9E75" : "#E24B4A",
            color: "#fff",
            boxShadow:
              toast.type === "success"
                ? "0 0 24px rgba(29,158,117,0.4)"
                : "0 0 24px rgba(226,75,74,0.4)",
          }}
        >
          {toast.message}
        </div>
      )}

      {/* Login Card */}
      <div
        className="animate-fade-in-up relative z-10 w-full max-w-md rounded-2xl p-8"
        style={{
          background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)",
          border: "1px solid rgba(127,119,221,0.25)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.04), 0 32px 64px rgba(0,0,0,0.5), 0 0 80px rgba(83,74,183,0.08)",
        }}
      >
        {/* Top border glow line */}
        <div
          className="absolute top-0 left-8 right-8 h-px rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(127,119,221,0.5), rgba(29,158,117,0.3), transparent)",
          }}
        />

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div
            className="relative w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #534AB7 0%, #1D9E75 100%)",
              boxShadow:
                "0 0 20px rgba(83,74,183,0.4), 0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="4" rx="1" />
              <rect x="3" y="10" width="18" height="4" rx="1" />
              <rect x="3" y="17" width="18" height="4" rx="1" />
            </svg>
            {/* Icon glow */}
            <div
              className="absolute inset-0 rounded-xl"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)" }}
            />
          </div>
          <span
            className="text-2xl font-bold tracking-tight text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            IBO<span style={{ color: "#7F77DD" }}>S</span>
          </span>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h1
            className="text-xl font-semibold text-white mb-1"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Welcome back
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            Sign in to your workspace
          </p>
        </div>

        {/* Role Selector */}
        <div
          className="flex gap-2 mb-6 p-1 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {roles.map((r) => (
            <button
              key={r.key}
              onClick={() => setRole(r.key)}
              type="button"
              className="flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200"
              style={
                role === r.key
                  ? {
                      background: "linear-gradient(135deg, #534AB7, #3d8c6e)",
                      color: "#fff",
                      boxShadow: "0 2px 12px rgba(83,74,183,0.35)",
                    }
                  : {
                      color: "rgba(255,255,255,0.4)",
                    }
              }
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Email address
            </label>
            <input
              type="email"
              value={email}
              placeholder="you@company.com"
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              className="w-full px-4 py-2.5 rounded-lg text-white text-sm outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: emailError
                  ? "1px solid #E24B4A"
                  : "1px solid rgba(255,255,255,0.1)",
              }}
            />
            {emailError && (
              <p className="text-xs mt-1.5" style={{ color: "#E24B4A" }}>
                Please enter a valid email address
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                className="w-full px-4 py-2.5 pr-12 rounded-lg text-white text-sm outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: passwordError
                    ? "1px solid #E24B4A"
                    : "1px solid rgba(255,255,255,0.1)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: "rgba(255,255,255,0.3)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.8)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.3)")
                }
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>

            {/* Strength Meter */}
            {password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{
                        background:
                          i < passwordStrength
                            ? strengthColors[passwordStrength]
                            : "rgba(255,255,255,0.08)",
                      }}
                    />
                  ))}
                </div>
                <p
                  className="text-xs mt-1 font-medium"
                  style={{ color: strengthColors[passwordStrength] }}
                >
                  {strengthLabels[passwordStrength]}
                </p>
              </div>
            )}
            {passwordError && (
              <p className="text-xs mt-1.5" style={{ color: "#E24B4A" }}>
                Password must be at least 8 characters
              </p>
            )}
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="custom-checkbox"
              />
              <span
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Remember me
              </span>
            </label>
            <button
              type="button"
              onClick={() => setForgotOpen(true)}
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "#7F77DD" }}
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #534AB7 0%, #1D9E75 100%)",
              boxShadow: loading
                ? "none"
                : "0 4px 20px rgba(83,74,183,0.35), 0 2px 8px rgba(0,0,0,0.3)",
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading)
                e.currentTarget.style.boxShadow =
                  "0 6px 28px rgba(83,74,183,0.5), 0 2px 8px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              if (!loading)
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(83,74,183,0.35), 0 2px 8px rgba(0,0,0,0.3)";
            }}
          >
            {loading ? (
              <>
                <Spinner /> Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(255,255,255,0.06)" }}
          />
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            New to IBOS?
          </span>
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(255,255,255,0.06)" }}
          />
        </div>

        <p className="text-center text-sm">
          <span style={{ color: "rgba(255,255,255,0.35)" }}>
            New client?{" "}
          </span>
          <button
            onClick={() => navigate("/signup")}
            className="font-medium transition-colors hover:opacity-80"
            style={{ color: "#7F77DD" }}
          >
            Create an account
          </button>
          <span style={{ color: "rgba(255,255,255,0.35)" }}>
            {" "}or contact your{" "}
          </span>
          <span
            className="font-medium"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            system admin
          </span>{" "}
          <span style={{ color: "rgba(255,255,255,0.35)" }}>
            for other roles.
          </span>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {forgotOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          onClick={() => setForgotOpen(false)}
        >
          <div
            className="animate-fade-in-up w-full max-w-sm mx-4 rounded-2xl p-6"
            style={{
              background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)",
              border: "1px solid rgba(127,119,221,0.25)",
              boxShadow:
                "0 32px 64px rgba(0,0,0,0.5), 0 0 40px rgba(83,74,183,0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top glow line */}
            <div
              className="absolute top-0 left-6 right-6 h-px rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(127,119,221,0.4), transparent)",
              }}
            />

            <h3
              className="text-lg font-semibold text-white mb-1"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Reset Password
            </h3>
            <p
              className="text-sm mb-4"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Enter your email to receive a reset link.
            </p>
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-2.5 rounded-lg text-white text-sm outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setForgotOpen(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white transition-all"
                  style={{
                    background: "linear-gradient(135deg, #534AB7, #1D9E75)",
                    boxShadow: "0 4px 12px rgba(83,74,183,0.3)",
                  }}
                >
                  Send link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
