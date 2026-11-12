import { useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import AuthShell from "../components/AuthShell";
import Button from "../components/ui/Button";
import FieldMessage from "../components/ui/FieldMessage";
import FormAlert from "../components/ui/FormAlert";
import TextField from "../components/ui/TextField";
import { useAuth } from "../hooks/useAuth";
import { isValidEmail } from "../utils/validation";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const emailOk = isValidEmail(email);
  const emailBad = email.length > 0 && !emailOk;
  const valid = emailOk && password.length > 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!valid || sending) return;
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
    <AuthShell title="Hola de nuevo" onSubmit={handleSubmit}>
      <TextField
        label="Correo"
        type="email"
        autoComplete="email"
        value={email}
        invalid={emailBad}
        onChange={e => { setEmail(e.target.value); setError(null); }}
        hint={emailOk
          ? <FieldMessage ok text="Correo válido" />
          : emailBad && <FieldMessage ok={false} text="Escribe un correo válido, por ejemplo nombre@dominio.com" />}
      />
      <TextField
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={e => { setPassword(e.target.value); setError(null); }}
      />
      {error && <FormAlert message={error} />}
      <Button type="submit" kind="primary" disabled={!valid} loading={sending} loadingLabel="Entrando…" className="mt-1 h-[58px]">
        Iniciar sesión
      </Button>
    </AuthShell>
  );
}
