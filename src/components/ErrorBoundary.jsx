import { Component } from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
   
    console.error("FleetOps error boundary:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-[#f3f4f8] px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
            <AlertOctagon size={26} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Une erreur inattendue est survenue</h1>
            <p className="mt-1 max-w-md text-sm text-slate-500">
              L'application a rencontré un probleme et n'a pas pu continuer. Vous pouvez essayer de recharger la page.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
          >
            <RotateCcw size={15} /> Recharger l'application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
