import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import AuthShell from "../components/AuthShell";
import AuthSwitch from "../components/AuthSwitch";
import Button from "../components/Button";
import FieldMessage from "../components/FieldMessage";
import FormAlert from "../components/FormAlert";
import TextField from "../components/TextField";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "../hooks/useForm";
import type { RootStackParamList } from "../types/navigation";
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

export default function RegisterScreen({ navigation }: NativeStackScreenProps<RootStackParamList, "Register">) {
  const { register } = useAuth();
  const { values, error, sending, hasVisibleErrors, errorOf, setField, touch, start, fail } = useForm<RegisterValues>({ name: "", email: "", password: "" }, validate);
  const { name, email, password } = values;

  const handleSubmit = async () => {
    if (!start()) return;
    try {
      await register({ name: name.trim(), email: email.trim(), password });
    } catch (err) {
      if (statusOf(err) === 409) {
        fail("Ya hay una cuenta con ese correo.", { email: "Este correo ya está registrado." });
      } else {
        fail(errorMessage(err, "No se pudo crear la cuenta."), errorInfo(err).fieldErrors);
      }
    }
  };

  return (
    <AuthShell
      title="Crea tu cuenta"
      footer={<AuthSwitch question="¿Ya tienes cuenta?" action="Iniciar sesión" onPress={() => navigation.replace("Login")} />}
    >
      <TextField
        label="Nombre"
        autoComplete="name"
        maxLength={120}
        placeholder="Tu nombre y apellido"
        value={name}
        error={errorOf("name")}
        help={`Así te veremos en Manka. ${name.length} de 120 caracteres.`}
        onChangeText={value => setField("name", value)}
        onBlur={() => touch("name")}
      />
      <TextField
        label="Correo"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        placeholder="tu@correo.com"
        value={email}
        error={errorOf("email")}
        help="Lo usarás para iniciar sesión."
        onChangeText={value => setField("email", value)}
        onBlur={() => touch("email")}
      />
      <TextField
        label="Contraseña"
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        maxLength={72}
        placeholder="Mínimo 8 caracteres"
        value={password}
        error={errorOf("password")}
        onChangeText={value => setField("password", value)}
        onBlur={() => touch("password")}
        hint={passwordRules(password).map(rule => <FieldMessage key={rule.text} ok={rule.ok} message={rule.text} />)}
      />
      {error && <FormAlert message={error} />}
      <Button
        label="Crear cuenta"
        kind="primary"
        size="lg"
        disabled={hasVisibleErrors}
        loading={sending}
        loadingLabel="Creando cuenta…"
        onPress={handleSubmit}
      />
    </AuthShell>
  );
}
