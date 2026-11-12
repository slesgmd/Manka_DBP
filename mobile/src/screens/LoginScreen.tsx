import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import AuthShell from "../components/AuthShell";
import AuthSwitch from "../components/AuthSwitch";
import Button from "../components/Button";
import FormAlert from "../components/FormAlert";
import TextField from "../components/TextField";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "../hooks/useForm";
import type { RootStackParamList } from "../types/navigation";
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

export default function LoginScreen({ navigation }: NativeStackScreenProps<RootStackParamList, "Login">) {
  const { login, expired } = useAuth();
  const { values, error, sending, hasVisibleErrors, errorOf, setField, touch, start, fail } = useForm<LoginValues>({ email: "", password: "" }, validate);

  const handleSubmit = async () => {
    if (!start()) return;
    try {
      await login({ email: values.email.trim(), password: values.password });
    } catch (err) {
      fail(statusOf(err) === 401 ? "El correo o la contraseña no son correctos." : errorMessage(err, "No se pudo iniciar sesión."));
    }
  };

  return (
    <AuthShell
      title="Hola de nuevo"
      footer={<AuthSwitch question="¿Aún no tienes cuenta?" action="Crear cuenta" onPress={() => navigation.replace("Register")} />}
    >
      {expired && !error && <FormAlert message="Tu sesión expiró. Vuelve a iniciar sesión para continuar donde estabas." />}
      <TextField
        label="Correo"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        placeholder="tu@correo.com"
        value={values.email}
        error={errorOf("email")}
        help="El correo con el que te registraste."
        onChangeText={value => setField("email", value)}
        onBlur={() => touch("email")}
      />
      <TextField
        label="Contraseña"
        secureTextEntry
        autoCapitalize="none"
        autoComplete="current-password"
        placeholder="Tu contraseña"
        value={values.password}
        error={errorOf("password")}
        help="Distingue mayúsculas y minúsculas."
        onChangeText={value => setField("password", value)}
        onBlur={() => touch("password")}
        onSubmitEditing={handleSubmit}
      />
      {error && <FormAlert message={error} />}
      <Button
        label="Iniciar sesión"
        kind="primary"
        size="lg"
        disabled={hasVisibleErrors}
        loading={sending}
        loadingLabel="Entrando…"
        onPress={handleSubmit}
      />
    </AuthShell>
  );
}
