import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";

import { MetricPill } from "../components/MetricPill";
import { PrimaryButton } from "../components/PrimaryButton";
import { RootStackParamList } from "../navigation/types";
import { colors, spacing } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "OptionDetail">;

function mapsSearchUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function mapsDirectionsUrl(origin: string, destination: string, travelMode: "driving" | "transit" | "walking", waypoint?: string) {
  const params = new URLSearchParams({
    api: "1",
    origin,
    destination,
    travelmode: travelMode
  });

  if (waypoint) {
    params.set("waypoints", waypoint);
  }

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export function OptionDetailScreen({ route }: Props) {
  const { option, request } = route.params;
  const pointQuery = `${option.dropoffLat},${option.dropoffLng}`;

  const openPoint = () => Linking.openURL(mapsSearchUrl(pointQuery));
  const openDriverRoute = () =>
    Linking.openURL(
      mapsDirectionsUrl(request.origin, request.driverDestination, "driving", pointQuery)
    );
  const openPassengerRoute = () =>
    Linking.openURL(mapsDirectionsUrl(pointQuery, request.passengerDestination, "transit"));

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>{option.title}</Text>
        <Text style={styles.address}>{option.dropoffAddress}</Text>
      </View>

      <View style={styles.scoreBand}>
        <View>
          <Text style={styles.scoreLabel}>Score DropPoint</Text>
          <Text style={styles.scoreValue}>{option.score}/100</Text>
        </View>
        <Text style={styles.scoreText}>{option.explanation}</Text>
      </View>

      <View style={styles.metrics}>
        <MetricPill label="extra conductor" value={`${option.driverExtraMinutes} min`} />
        <MetricPill label="tiempo pasajero" value={`${option.passengerTotalMinutes} min`} />
        <MetricPill label="caminata" value={`${option.passengerWalkMinutes} min`} />
        <MetricPill label="transbordos" value={`${option.passengerTransfers}`} />
      </View>

      <View style={styles.transitBox}>
        <Text style={styles.sectionTitle}>Recomendación para seguir</Text>
        <Text style={styles.body}>{option.transitRecommendation}</Text>
      </View>

      <View style={styles.summary}>
        <Text style={styles.sectionTitle}>Resumen</Text>
        <Text style={styles.body}>
          El conductor pasa por este punto con un desvío estimado de {option.driverExtraMinutes} minutos.
          Desde ahí, el pasajero continúa hacia {request.passengerDestination} con una caminata aproximada de{" "}
          {option.passengerWalkMinutes} minutos.
        </Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton icon="location" label="Abrir punto en Google Maps" onPress={openPoint} />
        <PrimaryButton icon="car" label="Abrir ruta del conductor" onPress={openDriverRoute} variant="secondary" />
        <PrimaryButton icon="bus" label="Abrir ruta del pasajero" onPress={openPassengerRoute} variant="secondary" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
    padding: spacing.lg
  },
  header: {
    gap: spacing.sm
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 34
  },
  address: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 23
  },
  scoreBand: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    gap: spacing.md,
    padding: spacing.lg
  },
  scoreLabel: {
    color: "#d8f5e9",
    fontSize: 13,
    fontWeight: "800"
  },
  scoreValue: {
    color: colors.surface,
    fontSize: 34,
    fontWeight: "900"
  },
  scoreText: {
    color: colors.surface,
    fontSize: 15,
    lineHeight: 22
  },
  metrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  transitBox: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    gap: spacing.sm,
    padding: spacing.lg
  },
  summary: {
    gap: spacing.sm
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  body: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 23
  },
  actions: {
    gap: spacing.md
  }
});
