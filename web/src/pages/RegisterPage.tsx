import { useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import AuthShell from "../components/AuthShell";
import Button from "../components/ui/Button";
import FieldMessage from "../components/ui/FieldMessage";
import FormAlert from "../components/ui/FormAlert";
import TextField from "../components/ui/TextField";
import { useAuth } from "../hooks/useAuth";
import type { ApiError } from "../types/common";
import { isValidEmail, passwordRules } from "../utils/validation";

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const emailOk = isValidEmail(email);
  const emailBad = email.length > 0 && !emailOk;
  const rules = passwordRules(password);
  const nameOk = name.trim().length > 0 && name.length <= 120;
  const valid = nameOk && emailOk && rules.every(rule => rule.ok);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!valid || sending) return;
    setError(null);
    setSending(true);
    try {
      await register({ name: name.trim(), email, password });
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
    <AuthShell title="Crea tu cuenta" onSubmit={handleSubmit}>
      <TextField
        label="Nombre"
        autoComplete="name"
        maxLength={120}
        value={name}
        onChange={e => setName(e.target.value)}
        hint={<span className="font-normal text-ink-2">{name.length} de 120 caracteres</span>}
      />
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
        autoComplete="new-password"
        maxLength={72}
        value={password}
        onChange={e => setPassword(e.target.value)}
        hint={rules.map(rule => <FieldMessage key={rule.text} ok={rule.ok} text={rule.text} />)}
      />
      {error && <FormAlert message={error} />}
      <Button type="submit" kind="primary" disabled={!valid} loading={sending} loadingLabel="Creando cuenta…" className="mt-1 h-[58px]">
        Crear cuenta
      </Button>
    </AuthShell>
  );
}
