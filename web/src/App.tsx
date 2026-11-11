import { useEffect, useState } from "react";
import axios from "axios";
import { getStatus } from "./services/statusService";

function App() {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    getStatus(controller.signal)
      .then(data => setStatus(data.status))
      .catch(err => {
        if (!axios.isCancel(err)) setError("No se pudo conectar con la API");
      });
    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white rounded-xl shadow p-6 text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Manka</h1>
        <p className="text-sm text-slate-500 mb-4">{import.meta.env.VITE_API_URL}</p>
        {!status && !error && <p className="text-slate-600">Conectando...</p>}
        {status && <p className="text-green-700 font-semibold">API: {status}</p>}
        {error && <p className="text-red-600 font-semibold">{error}</p>}
      </div>
    </main>
  );
}

export default App;
