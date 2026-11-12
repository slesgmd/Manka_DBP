import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import type { BarcodeScanningResult } from "expo-camera";
import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";
import GlassView from "../components/GlassView";
import IngredientSearch from "../components/IngredientSearch";
import ScreenBackground from "../components/ScreenBackground";
import TextField from "../components/TextField";
import { usePantry } from "../hooks/usePantry";
import { findIngredientTerm, getProductName, productErrorMessage } from "../services/openFoodFactsService";
import type { Ingredient } from "../types/catalog";
import { errorMessage } from "../utils/http";
import { colors, radius, text } from "../utils/theme";

type ScanState =
  | { status: "idle" }
  | { status: "loading"; code: string }
  | { status: "error"; code: string; message: string }
  | { status: "done"; code: string; productName: string; term: string | null };

const validateCode = (code: string) => (/^\d{8,14}$/.test(code) ? undefined : "El código tiene entre 8 y 14 números.");

export default function ScannerScreen() {
  const isFocused = useIsFocused();
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraFailed, setCameraFailed] = useState(false);
  const [scan, setScan] = useState<ScanState>({ status: "idle" });
  const [code, setCode] = useState("");
  const [codeTouched, setCodeTouched] = useState(false);
  const locked = useRef(false);
  const pantry = usePantry();
  const addToPantry = pantry.add;

  const lookUp = async (value: string) => {
    locked.current = true;
    setScan({ status: "loading", code: value });
    let productName: string;
    try {
      productName = await getProductName(value);
    } catch (err) {
      setScan({ status: "error", code: value, message: productErrorMessage(err) });
      return;
    }
    try {
      const term = await findIngredientTerm(productName);
      setScan({ status: "done", code: value, productName, term });
    } catch (err) {
      setScan({ status: "error", code: value, message: errorMessage(err, `Encontramos «${productName}», pero no pudimos buscarlo.`) });
    }
  };

  const handleScanned = ({ data }: BarcodeScanningResult) => {
    if (locked.current) return;
    lookUp(data);
  };

  const searchCode = () => {
    setCodeTouched(true);
    const value = code.trim();
    if (validateCode(value) || scan.status === "loading") return;
    lookUp(value);
  };

  const scanAgain = () => {
    locked.current = false;
    setScan({ status: "idle" });
  };

  const handleAdd = useCallback((ingredient: Ingredient) => addToPantry(ingredient.id, ingredient.name), [addToPantry]);

  const renderCamera = () => {
    if (cameraFailed) {
      return (
        <GlassView style={styles.panel}>
          <Ionicons name="camera-outline" size={28} color={colors.ink} />
          <Text style={[text.title3, styles.center]}>No pudimos abrir la cámara</Text>
          <Text style={[text.subhead, styles.center]}>Escribe el código de barras abajo o busca el ingrediente a mano.</Text>
        </GlassView>
      );
    }
    if (!permission) {
      return (
        <GlassView style={styles.panel}>
          <ActivityIndicator color={colors.ink} />
          <Text style={text.subhead}>Revisando el permiso de la cámara…</Text>
        </GlassView>
      );
    }
    if (!permission.granted) {
      return (
        <GlassView style={styles.panel}>
          <Ionicons name="camera-outline" size={28} color={colors.ink} />
          <Text style={[text.title3, styles.center]}>Necesitamos tu cámara</Text>
          <Text style={[text.subhead, styles.center]}>
            La usamos solo para leer el código de barras de tus productos. No tomamos ni guardamos fotos.
          </Text>
          <Text style={[text.footnote, styles.center]}>
            Si no la permites, puedes escribir el código o buscar el ingrediente a mano más abajo.
          </Text>
          {permission.canAskAgain ? (
            <Button label="Permitir cámara" kind="primary" icon="camera-outline" onPress={requestPermission} style={styles.stretch} />
          ) : (
            <Button label="Abrir ajustes" kind="primary" icon="settings-outline" onPress={() => Linking.openSettings()} style={styles.stretch} />
          )}
        </GlassView>
      );
    }
    return (
      <GlassView style={styles.cameraPanel}>
        <View style={styles.camera}>
          {isFocused && (
            <CameraView
              style={styles.fill}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"] }}
              onBarcodeScanned={scan.status === "idle" ? handleScanned : undefined}
              onMountError={() => setCameraFailed(true)}
            />
          )}
        </View>
        <Text style={[text.footnote, styles.center]}>Apunta al código de barras del producto.</Text>
      </GlassView>
    );
  };

  const renderResult = () => {
    if (scan.status === "idle") return null;
    if (scan.status === "loading") {
      return (
        <GlassView variant="dense" style={styles.panel}>
          <ActivityIndicator color={colors.ink} />
          <Text style={text.subhead}>Buscando el código {scan.code}…</Text>
        </GlassView>
      );
    }
    if (scan.status === "error") {
      return (
        <GlassView variant="dense" style={styles.panel}>
          <Ionicons name="alert-circle-outline" size={28} color={colors.danger} />
          <Text accessibilityRole="alert" style={[text.subhead, styles.center]}>{scan.message}</Text>
          <View style={styles.row}>
            <Button label="Reintentar" icon="refresh" onPress={() => lookUp(scan.code)} style={styles.flex} />
            <Button label="Escanear otro" icon="barcode-outline" onPress={scanAgain} style={styles.flex} />
          </View>
        </GlassView>
      );
    }
    return (
      <GlassView variant="dense" style={styles.card}>
        <Text style={text.footnote}>Código {scan.code}</Text>
        <Text style={text.title3}>{scan.productName}</Text>
        <Text style={text.subhead}>
          {scan.term ? "Estos ingredientes coinciden. Agrega el que corresponda:" : "No hay un ingrediente con ese nombre. Búscalo a mano:"}
        </Text>
        <IngredientSearch key={scan.code} addedIds={pantry.ids} onAdd={handleAdd} initialQuery={scan.term ?? scan.productName} />
        <Button label="Escanear otro" icon="barcode-outline" onPress={scanAgain} />
      </GlassView>
    );
  };

  return (
    <ScreenBackground edges={[]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {renderCamera()}
        {renderResult()}
        <GlassView style={styles.card}>
          <Text style={text.title3}>Escribir el código</Text>
          <TextField
            label="Código de barras"
            keyboardType="number-pad"
            placeholder="Por ejemplo 7750106002606"
            maxLength={14}
            value={code}
            error={codeTouched ? validateCode(code.trim()) : undefined}
            help="Los números que aparecen debajo de las barras."
            onChangeText={setCode}
            onBlur={() => setCodeTouched(true)}
            onSubmitEditing={searchCode}
          />
          <Button label="Buscar código" icon="search" loading={scan.status === "loading"} loadingLabel="Buscando…" onPress={searchCode} />
        </GlassView>
        <GlassView style={styles.card}>
          <Text style={text.title3}>Buscar el ingrediente</Text>
          <IngredientSearch addedIds={pantry.ids} onAdd={handleAdd} />
        </GlassView>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  panel: { alignItems: "center", gap: 10, paddingHorizontal: 22, paddingVertical: 24 },
  cameraPanel: { padding: 10, gap: 10 },
  camera: { width: "100%", aspectRatio: 1, borderRadius: radius.inner, overflow: "hidden", backgroundColor: colors.ink },
  fill: { flex: 1 },
  card: { padding: 18, gap: 12 },
  row: { flexDirection: "row", gap: 10, alignSelf: "stretch" },
  flex: { flex: 1 },
  center: { textAlign: "center" },
  stretch: { alignSelf: "stretch", marginTop: 6 },
});
