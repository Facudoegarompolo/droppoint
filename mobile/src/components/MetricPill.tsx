import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../theme";

type MetricPillProps = {
  label: string;
  value: string;
};

export function MetricPill({ label, value }: MetricPillProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minWidth: 96,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  value: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800"
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2
  }
});
