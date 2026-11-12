import type { FormEvent } from "react";
import AuthShell from "../components/AuthShell";
import Button from "../components/ui/Button";
import FormAlert from "../components/ui/FormAlert";
import TextField from "../components/ui/TextField";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "../hooks/useForm";
import { errorMessage, statusOf } from "../utils/http";
import { isValidEmail } from "../utils/validation";

interface LoginValues {
  email: string;
  password: string;
}

const validate = ({ email, password }: LoginValues) => ({
  email: !email ? "Escribe tu correo." : !isValidEmail(email) ? "Escribe un correo válido, por ejemplo tu@correo.com." : undefined,
  password: !password ? "Escribe tu contraseña." : undefined,
});

export default function LoginPage() {
  const { login, expired } = useAuth();
  const { values, error, sending, hasVisibleErrors, errorOf, setField, touch, start, fail } = useForm<LoginValues>({ email: "", password: "" }, validate);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!start()) return;
    try {
      await login(values);
    } catch (err) {
      fail(statusOf(err) === 401 ? "El correo o la contraseña no son correctos." : errorMessage(err, "No se pudo iniciar sesión."));
    }
  };

  return (
    <AuthShell title="Hola de nuevo" onSubmit={handleSubmit}>
      {expired && !error && <FormAlert message="Tu sesión expiró. Vuelve a iniciar sesión para continuar donde estabas." />}
      <TextField
        label="Correo"
        type="email"
        autoComplete="email"
        placeholder="tu@correo.com"
        value={values.email}
        error={errorOf("email")}
        help="El correo con el que te registraste."
        onChange={e => setField("email", e.target.value)}
        onBlur={() => touch("email")}
      />
      <TextField
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        placeholder="Tu contraseña"
        value={values.password}
        error={errorOf("password")}
        help="Distingue mayúsculas y minúsculas."
        onChange={e => setField("password", e.target.value)}
        onBlur={() => touch("password")}
      />
      {error && <FormAlert message={error} />}
      <Button type="submit" kind="primary" disabled={hasVisibleErrors} loading={sending} loadingLabel="Entrando…" className="mt-1 h-[58px]">
        Iniciar sesión
      </Button>
    </AuthShell>
  );
}
