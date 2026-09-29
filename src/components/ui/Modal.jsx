import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({ title, subtitle, onClose, children, maxWidth = "max-w-lg" }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    // empêche la page derrière de défiler pendant que la modale est ouverte
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return createPortal(
    // Conteneur scrollable : si le contenu est plus haut que l'écran, on peut
    // toujours défiler pour voir le haut ET le bas (le piège classique du
    // centrage flex sans overflow rendait le haut du formulaire inatteignable).
    <div className="fixed inset-0 z-30 overflow-y-auto bg-slate-900/40 animate-fade-in" onClick={onClose}>
      <div className="flex min-h-full items-center justify-center p-4 py-10">
        <div
          className={`w-full ${maxWidth} animate-pop-in rounded-[28px] bg-white p-7 shadow-2xl`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{title}</h2>
              {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
            </div>
            <button onClick={onClose} className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
              <X size={18} />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
