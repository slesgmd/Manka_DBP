import type { FormEvent } from "react";
import axios from "axios";
import AuthShell from "../components/AuthShell";
import Button from "../components/ui/Button";
import FieldMessage from "../components/ui/FieldMessage";
import FormAlert from "../components/ui/FormAlert";
import TextField from "../components/ui/TextField";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "../hooks/useForm";
import type { ApiError } from "../types/common";
import { isValidEmail, passwordRules } from "../utils/validation";

export default function RegisterPage() {
  const { register } = useAuth();
  const { values, error, sending, setField, start, fail } = useForm({ name: "", email: "", password: "" });
  const { name, email, password } = values;

  const emailOk = isValidEmail(email);
  const emailBad = email.length > 0 && !emailOk;
  const rules = passwordRules(password);
  const nameOk = name.trim().length > 0 && name.length <= 120;
  const valid = nameOk && emailOk && rules.every(rule => rule.ok);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!valid || sending) return;
    start();
    try {
      await register({ name: name.trim(), email, password });
    } catch (err) {
      if (axios.isAxiosError<ApiError>(err) && err.response?.status === 409) {
        fail("Ya hay una cuenta con ese correo.");
      } else if (axios.isAxiosError<ApiError>(err) && err.response?.data?.message) {
        fail(err.response.data.message);
      } else {
        fail("No se pudo crear la cuenta. Inténtalo otra vez.");
      }
    }
  };

  return (
    <AuthShell title="Crea tu cuenta" onSubmit={handleSubmit}>
      <TextField
        label="Nombre"
        autoComplete="name"
        maxLength={120}
        value={name}
        onChange={e => setField("name", e.target.value)}
        hint={<span className="font-normal text-ink-2">{name.length} de 120 caracteres</span>}
      />
      <TextField
        label="Correo"
        type="email"
        autoComplete="email"
        value={email}
        invalid={emailBad}
        onChange={e => setField("email", e.target.value)}
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
        onChange={e => setField("password", e.target.value)}
        hint={rules.map(rule => <FieldMessage key={rule.text} ok={rule.ok} text={rule.text} />)}
      />
      {error && <FormAlert message={error} />}
      <Button type="submit" kind="primary" disabled={!valid} loading={sending} loadingLabel="Creando cuenta…" className="mt-1 h-[58px]">
        Crear cuenta
      </Button>
    </AuthShell>
  );
}
