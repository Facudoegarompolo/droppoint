import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { findLocationSuggestions } from "../data/locationSuggestions";
import { colors, spacing } from "../theme";

type LocationFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  placeholder?: string;
};

export function LocationField({ label, value, onChangeText, error, placeholder }: LocationFieldProps) {
  const [focused, setFocused] = useState(false);
  const options = useMemo(() => findLocationSuggestions(value), [value]);
  const showOptions = focused && options.length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, error ? styles.inputError : null]}>
        <Ionicons name="search" size={18} color={colors.muted} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 120)}
          placeholder={placeholder}
          placeholderTextColor="#98a2b3"
          autoCapitalize="words"
          style={styles.input}
        />
      </View>
      {showOptions ? (
        <View style={styles.options}>
          {options.map((option) => (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              onPress={() => {
                onChangeText(option.value);
                setFocused(false);
              }}
              style={({ pressed }) => [styles.option, pressed ? styles.optionPressed : null]}
            >
              <View style={styles.optionIcon}>
                <Ionicons name="location" size={15} color={colors.primary} />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
    zIndex: 2
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700"
  },
  inputWrap: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 48,
    paddingHorizontal: spacing.md
  },
  inputError: {
    borderColor: colors.danger
  },
  input: {
    color: colors.text,
    flex: 1,
    fontSize: 16,
    minHeight: 46,
    paddingVertical: 0
  },
  options: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden"
  },
  option: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 56,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  optionPressed: {
    backgroundColor: colors.surfaceAlt
  },
  optionIcon: {
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    height: 30,
    justifyContent: "center",
    width: 30
  },
  optionText: {
    flex: 1
  },
  optionTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800"
  },
  optionSubtitle: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2
  },
  error: {
    color: colors.danger,
    fontSize: 12
  }
});
