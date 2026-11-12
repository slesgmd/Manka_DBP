import type { FormEvent } from "react";
import AuthShell from "../components/AuthShell";
import Button from "../components/ui/Button";
import FieldMessage from "../components/ui/FieldMessage";
import FormAlert from "../components/ui/FormAlert";
import TextField from "../components/ui/TextField";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "../hooks/useForm";
import { errorInfo, errorMessage, statusOf } from "../utils/http";
import { isValidEmail, passwordRules } from "../utils/validation";

interface RegisterValues {
  name: string;
  email: string;
  password: string;
}

const validate = ({ name, email, password }: RegisterValues) => ({
  name: !name.trim() ? "Escribe tu nombre." : name.length > 120 ? "Usa 120 caracteres como máximo." : undefined,
  email: !email ? "Escribe tu correo." : !isValidEmail(email) ? "Escribe un correo válido, por ejemplo tu@correo.com." : undefined,
  password: passwordRules(password).every(rule => rule.ok) ? undefined : "La contraseña aún no cumple todas las reglas.",
});

export default function RegisterPage() {
  const { register } = useAuth();
  const { values, error, sending, hasVisibleErrors, errorOf, setField, touch, start, fail } = useForm<RegisterValues>({ name: "", email: "", password: "" }, validate);
  const { name, email, password } = values;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!start()) return;
    try {
      await register({ name: name.trim(), email, password });
    } catch (err) {
      if (statusOf(err) === 409) {
        fail("Ya hay una cuenta con ese correo.", { email: "Este correo ya está registrado." });
      } else {
        fail(errorMessage(err, "No se pudo crear la cuenta."), errorInfo(err).fieldErrors);
      }
    }
  };

  return (
    <AuthShell title="Crea tu cuenta" onSubmit={handleSubmit}>
      <TextField
        label="Nombre"
        autoComplete="name"
        maxLength={120}
        placeholder="Tu nombre y apellido"
        value={name}
        error={errorOf("name")}
        help={`Así te veremos en Manka. ${name.length} de 120 caracteres.`}
        onChange={e => setField("name", e.target.value)}
        onBlur={() => touch("name")}
      />
      <TextField
        label="Correo"
        type="email"
        autoComplete="email"
        placeholder="tu@correo.com"
        value={email}
        error={errorOf("email")}
        help="Lo usarás para iniciar sesión."
        onChange={e => setField("email", e.target.value)}
        onBlur={() => touch("email")}
      />
      <TextField
        label="Contraseña"
        type="password"
        autoComplete="new-password"
        maxLength={72}
        placeholder="Mínimo 8 caracteres"
        value={password}
        error={errorOf("password")}
        onChange={e => setField("password", e.target.value)}
        onBlur={() => touch("password")}
        hint={passwordRules(password).map(rule => <FieldMessage key={rule.text} ok={rule.ok} text={rule.text} />)}
      />
      {error && <FormAlert message={error} />}
      <Button type="submit" kind="primary" disabled={hasVisibleErrors} loading={sending} loadingLabel="Creando cuenta…" className="mt-1 h-[58px]">
        Crear cuenta
      </Button>
    </AuthShell>
  );
}
