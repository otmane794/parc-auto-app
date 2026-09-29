export default function Card({ children, className = "" }) {
  return (
    <div className={`rounded-[28px] border border-slate-100 bg-white shadow-[0_2px_20px_-4px_rgba(15,23,42,0.06)] ${className}`}>
      {children}
    </div>
  );
}
