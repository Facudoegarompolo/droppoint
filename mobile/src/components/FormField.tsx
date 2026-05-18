import { StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from "react-native";

import { colors, spacing } from "../theme";

type FormFieldProps = TextInputProps & {
  label: string;
  error?: string;
  helper?: string;
  containerStyle?: ViewStyle;
};

export function FormField({ label, error, helper, containerStyle, ...inputProps }: FormFieldProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...inputProps}
        placeholderTextColor="#98a2b3"
        style={[styles.input, error ? styles.inputError : null, inputProps.style]}
      />
      {helper ? <Text style={styles.helper}>{helper}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700"
  },
  input: {
    minHeight: 48,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface
  },
  inputError: {
    borderColor: colors.danger
  },
  helper: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17
  },
  error: {
    color: colors.danger,
    fontSize: 12
  }
});
