export function Field({ label, children }) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-xs font-semibold text-slate-500">{label}</label>
      {children}
    </div>
  );
}

const inputBase =
  "w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-slate-400 focus:ring-4 focus:ring-slate-100";

export function Input(props) {
  return <input {...props} className={`${inputBase} ${props.className ?? ""}`} />;
}

export function Select({ children, ...props }) {
  return (
    <select {...props} className={`${inputBase} bg-white ${props.className ?? ""}`}>
      {children}
    </select>
  );
}
