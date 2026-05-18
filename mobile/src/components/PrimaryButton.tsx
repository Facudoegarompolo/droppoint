import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

import { colors, spacing } from "../theme";

type PrimaryButtonProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  style?: ViewStyle;
};

export function PrimaryButton({
  label,
  icon,
  onPress,
  disabled,
  variant = "primary",
  style
}: PrimaryButtonProps) {
  const isSecondary = variant === "secondary";

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isSecondary ? styles.secondary : styles.primary,
        disabled ? styles.disabled : null,
        pressed ? styles.pressed : null,
        style
      ]}
    >
      <Ionicons name={icon} size={18} color={isSecondary ? colors.primary : colors.surface} />
      <Text style={[styles.label, isSecondary ? styles.secondaryLabel : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
    paddingHorizontal: spacing.lg
  },
  primary: {
    backgroundColor: colors.primary
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1
  },
  disabled: {
    opacity: 0.55
  },
  pressed: {
    transform: [{ scale: 0.99 }]
  },
  label: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "800"
  },
  secondaryLabel: {
    color: colors.primary
  }
});
