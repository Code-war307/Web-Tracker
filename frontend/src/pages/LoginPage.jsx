import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Github,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

// Zod validation schema
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

// InputField remains visually same but now works with RHF
const InputField = ({
  label,
  type,
  placeholder,
  register,
  error,
  icon: Icon,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
          <Icon size={18} />
        </div>
        <input
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          {...register}
          className={`w-full bg-[#0d111a] border ${
            error ? "border-rose-500/50" : "border-[#2b2f37]"
          } 
                     text-[#e3e5f2] pl-12 pr-12 py-3 rounded-xl outline-none transition-all text-sm
                     focus:border-[#f0f5fc]/40 focus:ring-4 focus:ring-[#f0f5fc]/5 placeholder:text-slate-600`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-rose-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
};

export const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { username: "", password: "", rememberMe: false },
  });

  const onSubmit = (data) => {
    setIsLoading(true);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 2000);
  };

  return (
    <div className="h-screen w-full bg-[#06080d] p-4 md:p-10 lg:p-16 flex items-center justify-center font-sans overflow-hidden relative">
      {/* Background Grid */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 w-full max-w-5xl h-full max-h-[660px] flex flex-col md:flex-row bg-[#080a0f] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        {/* Left Section (Visuals) */}
        <div className="hidden md:flex md:w-[42%] relative items-center justify-center overflow-hidden border-r border-white/5 bg-gradient-to-br from-[#0a0c12] to-[#080a0f]">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] rounded-full bg-emerald-500/[0.02] blur-[100px]"
          />
          <div className="relative z-10 p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-2xl">
                <ShieldCheck size={22} className="text-[#0a0c12]" />
              </div>
              <span className="text-lg font-bold text-white tracking-tighter uppercase">
                SENTINEL
              </span>
            </div>
            <h1 className="text-3xl font-black text-white leading-tight tracking-tight mb-4">
              Precision <br />
              <span className="text-emerald-400 italic">Monitoring.</span>
            </h1>
            <p className="text-slate-500 text-sm max-w-[220px] leading-relaxed">
              Real-time telemetry and advanced analytics for modern
              infrastructure.
            </p>
          </div>
        </div>

        {/* Right Section (Form) */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-10 bg-[#0a0c12]/60 backdrop-blur-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-[340px] space-y-5">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Login
              </h2>
              <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
                Authorized Access
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <InputField
                label="Username or Email"
                type="text"
                placeholder="operator@sentinel.io"
                icon={User}
                register={register("username")}
                error={errors.username}
              />

              <InputField
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                register={register("password")}
                error={errors.password}
              />

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      {...register("rememberMe")}
                      className="peer sr-only"
                    />
                    <div className="w-4 h-4 border-2 border-[#2b2f37] rounded peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all" />
                    <div
                      className={`absolute inset-0 flex items-center justify-center text-white pointer-events-none transition-opacity ${
                        !!errors.rememberMe ? "opacity-100" : "opacity-0"
                      }`}>
                      <svg
                        size="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="w-2.5 h-2.5">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-300 transition-colors uppercase tracking-wider">
                    Remember me
                  </span>
                </label>
                <a
                  href="#"
                  className="text-[10px] font-bold text-slate-500 hover:text-emerald-400 transition-colors uppercase tracking-wider">
                  Forgot Password?
                </a>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={!isValid || isLoading}
                className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all
                          ${
                            isValid && !isLoading
                              ? "bg-[#f0f5fc] text-[#1c2030]"
                              : "bg-slate-800/40 text-slate-600 cursor-not-allowed"
                          }`}>
                {isLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  "AUTHORIZE SESSION"
                )}
              </motion.button>
            </form>
            <div className="relative flex items-center justify-center py-1">
              <div className="absolute w-full h-[1px] bg-white/5" />
              <span className="relative bg-[#0a0c12] px-3 text-[8px] uppercase tracking-[0.3em] text-slate-700 font-black">
                Direct Sync
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* GitHub Button */}
              <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/5 bg-white/[0.02] text-slate-400 hover:text-emerald-400 hover:border-emerald-500/20 hover:bg-emerald-500/[0.02] transition-all duration-300 text-[10px] font-bold uppercase group">
                <Github
                  size={16}
                  className="group-hover:text-emerald-400 transition-colors"
                />
                GITHUB
              </button>

              {/* Fixed Google Button */}
              <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/5 bg-white/[0.02] text-slate-400 hover:text-emerald-400 hover:border-emerald-500/20 hover:bg-emerald-500/[0.02] transition-all duration-300 text-[10px] font-bold uppercase group">
                <svg
                  className="w-4 h-4 transition-all duration-300"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg">
                  {/* The paths now use 'currentColor' on hover via the group-hover utility if you prefer monochrome, 
                but here I've kept the brand colors with a slight opacity shift on hover for a premium feel. */}
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                GOOGLE
              </button>
            </div>
            <p className="text-center text-[12px] text-slate-600 font-medium">
              Don't have account
              <Link
                to="/signup"
                className="relative ml-1 text-emerald-500 hover:text-emerald-400 font-bold uppercase transition-colors group">
                Sign up
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
