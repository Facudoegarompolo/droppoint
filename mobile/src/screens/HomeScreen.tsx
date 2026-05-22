import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { optimizeDropoff } from "../api/dropoff";
import { DepartureTimePicker, toLocalDateTime } from "../components/DepartureTimePicker";
import { LocationField } from "../components/LocationField";
import { PrimaryButton } from "../components/PrimaryButton";
import { RootStackParamList } from "../navigation/types";
import { colors, spacing } from "../theme";
import { DropoffOptimizationRequest, Priority } from "../types/dropoff";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

type FormErrors = Partial<Record<"origin" | "driverDestination" | "passengerDestination", string>>;

const SOFT_LIMIT_MINUTES = 999;

const priorityOptions: Array<{ label: string; value: Priority }> = [
  { label: "Equilibrado", value: "BALANCED" },
  { label: "Menor desvío", value: "DRIVER_DETOUR" },
  { label: "Menor tiempo", value: "PASSENGER_TIME" }
];

function defaultDepartureTime() {
  const now = new Date();
  now.setSeconds(0, 0);
  return now;
}

export function HomeScreen({ navigation }: Props) {
  const [origin, setOrigin] = useState("");
  const [driverDestination, setDriverDestination] = useState("");
  const [passengerDestination, setPassengerDestination] = useState("");
  const [departureTime, setDepartureTime] = useState(defaultDepartureTime);
  const [priority, setPriority] = useState<Priority>("BALANCED");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!origin.trim()) nextErrors.origin = "Ingresá el origen común.";
    if (!driverDestination.trim()) nextErrors.driverDestination = "Ingresá el destino del conductor.";
    if (!passengerDestination.trim()) nextErrors.passengerDestination = "Ingresá el destino del pasajero.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async () => {
    setSubmitError(null);
    if (!validate()) return;

    const request: DropoffOptimizationRequest = {
      origin: origin.trim(),
      driverDestination: driverDestination.trim(),
      passengerDestination: passengerDestination.trim(),
      departureTime: toLocalDateTime(departureTime),
      preferences: {
        maxDriverDetourMinutes: SOFT_LIMIT_MINUTES,
        maxPassengerWalkMinutes: SOFT_LIMIT_MINUTES,
        priority
      }
    };

    try {
      setLoading(true);
      const response = await optimizeDropoff(request);
      navigation.navigate("Results", { request, response });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Encontrá el punto justo para bajarte</Text>
          <Text style={styles.subtitle}>
            Cargá ambos destinos y DropPoint ordena las mejores alternativas para decidir rápido.
          </Text>
        </View>

        <View style={styles.form}>
          <LocationField
            label="Origen común"
            value={origin}
            onChangeText={setOrigin}
            error={errors.origin}
            placeholder="Ej: UADE, Retiro, Av. Corrientes 800..."
          />
          <LocationField
            label="Destino del conductor"
            value={driverDestination}
            onChangeText={setDriverDestination}
            error={errors.driverDestination}
            placeholder="Ej: San Miguel, Bella Vista, San Isidro..."
          />
          <LocationField
            label="Destino del pasajero"
            value={passengerDestination}
            onChangeText={setPassengerDestination}
            error={errors.passengerDestination}
            placeholder="Ej: Caballito, Villa Urquiza, La Plata..."
          />
          <DepartureTimePicker
            value={departureTime}
            onChange={setDepartureTime}
          />

          <View style={styles.priorityGroup}>
            <Text style={styles.priorityLabel}>Prioridad</Text>
            <View style={styles.segmented}>
              {priorityOptions.map((option) => {
                const selected = option.value === priority;
                return (
                  <Pressable
                    key={option.value}
                    accessibilityRole="button"
                    onPress={() => setPriority(option.value)}
                    style={[styles.segment, selected ? styles.segmentSelected : null]}
                  >
                    <Text style={[styles.segmentText, selected ? styles.segmentTextSelected : null]}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}

          <PrimaryButton
            icon="navigate"
            label={loading ? "Calculando..." : "Buscar puntos de bajada"}
            onPress={onSubmit}
            disabled={loading}
          />
          {loading ? <ActivityIndicator color={colors.primary} /> : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  content: {
    padding: spacing.lg,
    gap: spacing.xl
  },
  header: {
    gap: spacing.sm,
    paddingTop: spacing.md
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 36
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 23
  },
  form: {
    gap: spacing.lg
  },
  priorityGroup: {
    gap: spacing.sm
  },
  priorityLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700"
  },
  segmented: {
    backgroundColor: "#e9eef3",
    borderRadius: 8,
    flexDirection: "row",
    padding: 3
  },
  segment: {
    alignItems: "center",
    borderRadius: 6,
    flex: 1,
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: spacing.sm
  },
  segmentSelected: {
    backgroundColor: colors.surface
  },
  segmentText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center"
  },
  segmentTextSelected: {
    color: colors.primaryDark
  },
  submitError: {
    color: colors.danger,
    fontSize: 14,
    lineHeight: 20
  }
});
