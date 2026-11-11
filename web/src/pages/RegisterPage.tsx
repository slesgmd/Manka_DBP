import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../routes";
import type { ApiError } from "../types/common";

const inputClass = "w-full border rounded px-3 py-2";

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      await register({ name, email, password });
    } catch (err) {
      if (axios.isAxiosError<ApiError>(err) && err.response?.status === 409) {
        setError("Ya hay una cuenta con ese correo.");
      } else if (axios.isAxiosError<ApiError>(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("No se pudo crear la cuenta. Inténtalo otra vez.");
      }
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-3">
        <h1 className="text-2xl font-bold">Crear cuenta</h1>
        <label>
          Nombre
          <input required maxLength={120} value={name} onChange={e => setName(e.target.value)} className={inputClass} />
        </label>
        <label>
          Correo
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
        </label>
        <label>
          Contraseña
          <input type="password" required minLength={8} maxLength={72} value={password} onChange={e => setPassword(e.target.value)} className={inputClass} />
        </label>
        {error && <p role="alert" className="text-red-600">{error}</p>}
        <button type="submit" disabled={sending} className="bg-slate-800 text-white rounded px-3 py-2 disabled:opacity-50">
          {sending ? "Creando cuenta..." : "Crear cuenta"}
        </button>
        <p className="text-sm">
          ¿Ya tienes cuenta? <Link to={ROUTES.login} className="underline">Iniciar sesión</Link>
        </p>
      </form>
    </main>
  );
}
