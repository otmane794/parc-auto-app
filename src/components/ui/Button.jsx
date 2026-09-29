export default function Button({ children, variant = "primary", className = "", ...rest }) {
  const base = "inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors active:scale-[0.98]";
  const variants = {
    primary: "bg-slate-900 text-white shadow-sm hover:bg-slate-800",
    ghost: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
