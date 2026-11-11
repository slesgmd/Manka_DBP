import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../routes";

const inputClass = "w-full border rounded px-3 py-2";

export default function LoginPage() {
  const { login } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      await login({ email, password });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError("El correo o la contraseña no son correctos.");
      } else {
        setError("No se pudo iniciar sesión. Inténtalo otra vez.");
      }
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-3">
        <h1 className="text-2xl font-bold">Iniciar sesión</h1>
        <label>
          Correo
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
        </label>
        <label>
          Contraseña
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className={inputClass} />
        </label>
        {error && <p role="alert" className="text-red-600">{error}</p>}
        <button type="submit" disabled={sending} className="bg-slate-800 text-white rounded px-3 py-2 disabled:opacity-50">
          {sending ? "Entrando..." : "Iniciar sesión"}
        </button>
        <p className="text-sm">
          ¿No tienes cuenta? <Link to={ROUTES.register} state={location.state} className="underline">Crear cuenta</Link>
        </p>
      </form>
    </main>
  );
}
