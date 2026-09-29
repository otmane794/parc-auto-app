import { createContext, useCallback, useContext, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const ICONS = { success: CheckCircle2, error: XCircle, info: Info };
const RING = {
  success: "border-emerald-200 text-emerald-600 bg-emerald-50",
  error: "border-rose-200 text-rose-600 bg-rose-50",
  info: "border-blue-200 text-blue-600 bg-blue-50",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((message, type = "success", description) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type, description }]);
    setTimeout(() => dismiss(id), 4000);
  }, [dismiss]);

  const api = {
    success: (message, description) => push(message, "success", description),
    error: (message, description) => push(message, "error", description),
    info: (message, description) => push(message, "info", description),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex w-full max-w-sm flex-col gap-2">
          {toasts.map((t) => {
            const Icon = ICONS[t.type];
            return (
              <div
                key={t.id}
                className={`pointer-events-auto flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-xl animate-pop-in ${RING[t.type]}`}
              >
                <Icon size={18} className="mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">{t.message}</p>
                  {t.description && <p className="mt-0.5 text-xs text-slate-500">{t.description}</p>}
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  className="shrink-0 rounded-full p-1 text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-500"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
