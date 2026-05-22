import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { MetricPill } from "../components/MetricPill";
import { RootStackParamList } from "../navigation/types";
import { colors, spacing } from "../theme";
import { DropoffOption } from "../types/dropoff";

type Props = NativeStackScreenProps<RootStackParamList, "Results">;

export function ResultsScreen({ route, navigation }: Props) {
  const { request, response } = route.params;

  const renderOption = ({ item }: { item: DropoffOption }) => (
    <Pressable
      accessibilityRole="button"
      onPress={() => navigation.navigate("OptionDetail", { option: item, request })}
      style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.titleGroup}>
          <Text style={styles.optionTitle}>{item.title}</Text>
          <Text style={styles.address}>{item.dropoffAddress}</Text>
        </View>
        <View style={styles.score}>
          <Text style={styles.scoreValue}>{item.score}</Text>
          <Text style={styles.scoreLabel}>{item.scoreLabel ?? "score"}</Text>
        </View>
      </View>

      <View style={styles.metrics}>
        <MetricPill label="extra conductor" value={`${item.driverExtraMinutes} min`} />
        <MetricPill label="pasajero" value={`${item.passengerTotalMinutes} min`} />
        <MetricPill label="caminata" value={`${item.passengerWalkMinutes} min`} />
      </View>

      <View style={styles.footer}>
        {item.scoreBreakdown ? <Text style={styles.scoreBreakdown}>{item.scoreBreakdown}</Text> : null}
        <View style={styles.recommendation}>
          <Ionicons name="train" size={17} color={colors.primary} />
          <Text style={styles.recommendationText}>{item.transitRecommendation}</Text>
        </View>
        <Text style={styles.explanation}>{item.explanation}</Text>
        <View style={styles.transfers}>
          <Ionicons name="swap-horizontal" size={16} color={colors.muted} />
          <Text style={styles.transferText}>{item.passengerTransfers} transbordo(s)</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={response.options}
        renderItem={renderOption}
        keyExtractor={(item) => `${item.dropoffLat}-${item.dropoffLng}`}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.kicker}>{request.origin}</Text>
            <Text style={styles.heading}>Elegí dónde conviene bajar</Text>
            <Text style={styles.subtitle}>
              {response.message ?? "Ordenamos las opciones según tu prioridad, el recorrido compartido y la continuidad del pasajero."}
            </Text>
            {response.availabilityWarning ? (
              <View style={styles.warning}>
                <Ionicons name="alert-circle" size={18} color={colors.accent} />
                <Text style={styles.warningText}>{response.availabilityWarning}</Text>
              </View>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No encontramos opciones para mostrar.</Text>
            <Text style={styles.emptyText}>
              {response.availabilityWarning ?? response.message ?? "Probá ampliar el desvío del conductor o la caminata máxima."}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  list: {
    gap: spacing.lg,
    padding: spacing.lg
  },
  header: {
    gap: spacing.sm
  },
  kicker: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800"
  },
  heading: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "900"
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.lg,
    padding: spacing.lg
  },
  pressed: {
    opacity: 0.92
  },
  cardHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between"
  },
  titleGroup: {
    flex: 1,
    gap: spacing.xs
  },
  optionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 23
  },
  address: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20
  },
  score: {
    alignItems: "center",
    borderColor: colors.primary,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 66,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  scoreValue: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: "900"
  },
  scoreLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "800",
    textAlign: "center"
  },
  metrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  footer: {
    gap: spacing.sm
  },
  scoreBreakdown: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 19
  },
  recommendation: {
    alignItems: "flex-start",
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.md
  },
  recommendationText: {
    color: colors.text,
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19
  },
  explanation: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20
  },
  transfers: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs
  },
  transferText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700"
  },
  empty: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20
  },
  warning: {
    alignItems: "flex-start",
    backgroundColor: "#fff8e1",
    borderColor: "#ffe08a",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.md
  },
  warningText: {
    color: colors.text,
    flex: 1,
    fontSize: 13,
    lineHeight: 19
  }
});
