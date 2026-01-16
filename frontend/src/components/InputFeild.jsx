import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
const InputField = ({ label, type, placeholder, icon: Icon, register, error }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="space-y-1">
      <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
          <Icon size={18} />
        </div>
        <input
          type={isPassword && showPassword ? 'text' : type}
          placeholder={placeholder}
          {...register}
          className={`w-full bg-[#0d111a] border ${
            error ? 'border-rose-500/50' : 'border-[#2b2f37]'
          } text-[#e3e5f2] pl-12 pr-12 py-2.5 rounded-xl outline-none transition-all text-sm
             focus:border-[#f0f5fc]/40 focus:ring-4 focus:ring-[#f0f5fc]/5 placeholder:text-slate-600`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-rose-500 text-[10px] mt-1">{error.message}</p>}
    </div>
  );
};

export default InputField