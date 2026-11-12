import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import type { TextInputProps } from "react-native";
import { colors, TARGET, text } from "../utils/theme";

interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string;
  help?: string;
  hint?: ReactNode;
}

export default function TextField({ label, error, help, hint, style, ...inputProps }: TextFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.ink2}
        style={[styles.input, error ? styles.inputError : null, style]}
        {...inputProps}
      />
      {hint}
      {error ? (
        <View style={styles.row}>
          <Ionicons name="alert-circle" size={15} color={colors.danger} />
          <Text style={[text.footnote, styles.error]}>{error}</Text>
        </View>
      ) : help ? (
        <Text style={[text.footnote, styles.help]}>{help}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 6 },
  label: { fontSize: 15, fontWeight: "500", color: colors.ink, paddingLeft: 4 },
  input: {
    minHeight: TARGET + 6,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.rim,
    backgroundColor: colors.thin,
    paddingHorizontal: 18,
    fontSize: 16,
    color: colors.ink,
  },
  inputError: { borderColor: colors.danger },
  row: { flexDirection: "row", alignItems: "center", gap: 6, paddingLeft: 4 },
  error: { color: colors.danger, flex: 1 },
  help: { paddingLeft: 4 },
});
