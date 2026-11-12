import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";
import ErrorState from "../components/ErrorState";
import GlassView from "../components/GlassView";
import LoadingView from "../components/LoadingView";
import ScreenBackground from "../components/ScreenBackground";
import ScreenHeader from "../components/ScreenHeader";
import { useAuth } from "../hooks/useAuth";
import { useFetch } from "../hooks/useFetch";
import { getCurrentUser } from "../services/userService";
import { formatDate } from "../utils/format";
import { colors, text } from "../utils/theme";
import { initials, mainRoleLabel } from "../utils/user";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { logout } = useAuth();
  const { data: user, loading, error, retry } = useFetch(getCurrentUser);
  const [leaving, setLeaving] = useState(false);

  const confirmLogout = () => {
    Alert.alert("¿Cerrar sesión?", "Tendrás que volver a iniciar sesión para usar Manka.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          setLeaving(true);
          await logout();
        },
      },
    ]);
  };

  const renderAccount = () => {
    if (error) return <ErrorState title="No pudimos cargar tu perfil" error={error} onRetry={retry} />;
    if (loading || !user) return <LoadingView label="Cargando tu perfil…" />;

    const rows = [
      { label: "Nombre", value: user.name },
      { label: "Correo", value: user.email },
      { label: "Rol", value: mainRoleLabel(user) },
      { label: "Estado", value: user.enabled ? "Cuenta activa" : "Cuenta desactivada" },
    ];

    return (
      <>
        <GlassView style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials(user.name)}</Text>
          </View>
          <View style={styles.flex}>
            <Text style={text.title3}>{user.name}</Text>
            <Text style={text.subhead}>{mainRoleLabel(user)}</Text>
            <Text style={text.footnote}>En Manka desde el {formatDate(user.createdAt)}</Text>
          </View>
        </GlassView>

        <GlassView variant="dense" style={styles.data}>
          <View style={styles.dataHeader}>
            <Text style={text.title3}>Datos de la cuenta</Text>
            <Text style={text.footnote}>Solo lectura</Text>
          </View>
          {rows.map(row => (
            <View key={row.label} style={styles.row}>
              <Text style={text.subhead}>{row.label}</Text>
              <Text style={styles.value}>{row.value}</Text>
            </View>
          ))}
          <View style={styles.note}>
            <Ionicons name="information-circle-outline" size={18} color={colors.ink2} />
            <Text style={[text.footnote, styles.flex]}>Por ahora no puedes editar tus datos desde la app.</Text>
          </View>
        </GlassView>
      </>
    );
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Perfil" subtitle="Tu cuenta en Manka" />
        {renderAccount()}
        <Button label="Ver historial" icon="time-outline" size="lg" onPress={() => navigation.navigate("History")} />
        <Button
          label="Cerrar sesión"
          kind="destructive"
          size="lg"
          icon="log-out-outline"
          loading={leaving}
          loadingLabel="Cerrando sesión…"
          onPress={confirmLogout}
        />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  card: { flexDirection: "row", alignItems: "center", gap: 16, padding: 18 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.graphite,
  },
  avatarText: { fontSize: 22, fontWeight: "500", color: colors.graphiteInk },
  flex: { flex: 1, gap: 2 },
  data: { paddingVertical: 8 },
  dataHeader: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", paddingHorizontal: 18, paddingVertical: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.sep,
  },
  value: { flexShrink: 1, textAlign: "right", fontSize: 15, fontWeight: "500", color: colors.ink },
  note: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 18, paddingTop: 12, paddingBottom: 8 },
});
