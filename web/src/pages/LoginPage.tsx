import type { FormEvent } from "react";
import AuthShell from "../components/AuthShell";
import Button from "../components/ui/Button";
import FieldMessage from "../components/ui/FieldMessage";
import FormAlert from "../components/ui/FormAlert";
import TextField from "../components/ui/TextField";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "../hooks/useForm";
import { statusOf } from "../utils/http";
import { isValidEmail } from "../utils/validation";

export default function LoginPage() {
  const { login } = useAuth();
  const { values, error, sending, setField, start, fail } = useForm({ email: "", password: "" });

  const emailOk = isValidEmail(values.email);
  const emailBad = values.email.length > 0 && !emailOk;
  const valid = emailOk && values.password.length > 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!valid || sending) return;
    start();
    try {
      await login(values);
    } catch (err) {
      fail(statusOf(err) === 401 ? "El correo o la contraseña no son correctos." : "No se pudo iniciar sesión. Inténtalo otra vez.");
    }
  };

  return (
    <AuthShell title="Hola de nuevo" onSubmit={handleSubmit}>
      <TextField
        label="Correo"
        type="email"
        autoComplete="email"
        value={values.email}
        invalid={emailBad}
        onChange={e => setField("email", e.target.value)}
        hint={emailOk
          ? <FieldMessage ok text="Correo válido" />
          : emailBad && <FieldMessage ok={false} text="Escribe un correo válido, por ejemplo nombre@dominio.com" />}
      />
      <TextField
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        value={values.password}
        onChange={e => setField("password", e.target.value)}
      />
      {error && <FormAlert message={error} />}
      <Button type="submit" kind="primary" disabled={!valid} loading={sending} loadingLabel="Entrando…" className="mt-1 h-[58px]">
        Iniciar sesión
      </Button>
    </AuthShell>
  );
}
