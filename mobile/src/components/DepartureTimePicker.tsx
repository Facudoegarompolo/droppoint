import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { colors, spacing } from "../theme";

type DepartureTimePickerProps = {
  value: Date;
  onChange: (value: Date) => void;
};

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  weekday: "short",
  day: "2-digit",
  month: "short"
});

const timeFormatter = new Intl.DateTimeFormat("es-AR", {
  hour: "2-digit",
  minute: "2-digit"
});

function roundedNow() {
  const date = new Date();
  date.setSeconds(0, 0);
  return date;
}

function addMinutes(date: Date, minutes: number) {
  const next = new Date(date);
  next.setMinutes(next.getMinutes() + minutes);
  return clampToNow(next);
}

function clampToNow(date: Date) {
  const now = roundedNow();
  return date.getTime() < now.getTime() ? now : date;
}

function keepUpcoming(date: Date) {
  const now = roundedNow();
  if (date.getTime() >= now.getTime()) return date;

  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
}

function setTimePart(date: Date, part: "hour" | "minute", rawValue: string) {
  const digits = rawValue.replace(/\D/g, "");
  if (!digits) return date;

  const numericValue = Number(digits);
  const next = new Date(date);
  const limit = part === "hour" ? 23 : 59;
  const safeValue = Number.isFinite(numericValue) ? Math.max(0, Math.min(limit, numericValue)) : 0;

  if (part === "hour") {
    next.setHours(safeValue);
  } else {
    next.setMinutes(safeValue);
  }

  next.setSeconds(0, 0);
  return keepUpcoming(next);
}

function pad(part: number) {
  return part.toString().padStart(2, "0");
}

export function DepartureTimePicker({ value, onChange }: DepartureTimePickerProps) {
  const [hourText, setHourText] = useState(pad(value.getHours()));
  const [minuteText, setMinuteText] = useState(pad(value.getMinutes()));
  const [editingPart, setEditingPart] = useState<"hour" | "minute" | null>(null);

  const syncTextFromDate = (date: Date) => {
    setHourText(pad(date.getHours()));
    setMinuteText(pad(date.getMinutes()));
  };

  useEffect(() => {
    if (!editingPart) {
      syncTextFromDate(value);
    }
  }, [editingPart, value]);

  const changeByMinutes = (minutes: number) => {
    const next = addMinutes(value, minutes);
    setEditingPart(null);
    syncTextFromDate(next);
    onChange(next);
  };

  const changeToNow = () => {
    const next = roundedNow();
    setEditingPart(null);
    syncTextFromDate(next);
    onChange(next);
  };

  const changeManualText = (part: "hour" | "minute", text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, 2);
    const setter = part === "hour" ? setHourText : setMinuteText;
    setter(digits);

    if (digits.length === 2) {
      const next = setTimePart(value, part, digits);
      syncTextFromDate(next);
      onChange(next);
    }
  };

  const commitManualText = (part: "hour" | "minute", text: string) => {
    const next = setTimePart(value, part, text);
    setEditingPart(null);
    syncTextFromDate(next);
    onChange(next);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Horario de salida</Text>
      <View style={styles.card}>
        <View style={styles.summary}>
          <View style={styles.clockIcon}>
            <Ionicons name="time" size={20} color={colors.primary} />
          </View>
          <View style={styles.summaryText}>
            <Text style={styles.time}>{timeFormatter.format(value)}</Text>
            <Text style={styles.date}>{dateFormatter.format(value)}</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Usar hora actual" onPress={changeToNow} style={styles.nowButton}>
            <Text style={styles.nowText}>Ahora</Text>
          </Pressable>
        </View>

        <View style={styles.manual}>
          <Text style={styles.manualLabel}>Editar hora manualmente</Text>
          <View style={styles.manualInputs}>
            <TextInput
              accessibilityLabel="Hora"
              value={hourText}
              onChangeText={(text) => changeManualText("hour", text)}
              onFocus={() => setEditingPart("hour")}
              onBlur={() => commitManualText("hour", hourText)}
              keyboardType="number-pad"
              maxLength={2}
              placeholder="HH"
              selectTextOnFocus
              style={styles.timeInput}
            />
            <Text style={styles.separator}>:</Text>
            <TextInput
              accessibilityLabel="Minutos"
              value={minuteText}
              onChangeText={(text) => changeManualText("minute", text)}
              onFocus={() => setEditingPart("minute")}
              onBlur={() => commitManualText("minute", minuteText)}
              keyboardType="number-pad"
              maxLength={2}
              placeholder="MM"
              selectTextOnFocus
              style={styles.timeInput}
            />
          </View>
        </View>

        <View style={styles.stepper}>
          <Pressable accessibilityRole="button" accessibilityLabel="Restar 15 minutos" onPress={() => changeByMinutes(-15)} style={styles.stepButton}>
            <Ionicons name="remove" size={18} color={colors.primary} />
            <Text style={styles.stepText}>15 min</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Sumar 15 minutos" onPress={() => changeByMinutes(15)} style={styles.stepButton}>
            <Ionicons name="add" size={18} color={colors.primary} />
            <Text style={styles.stepText}>15 min</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export function toLocalDateTime(value: Date) {
  return [
    value.getFullYear(),
    "-",
    pad(value.getMonth() + 1),
    "-",
    pad(value.getDate()),
    "T",
    pad(value.getHours()),
    ":",
    pad(value.getMinutes()),
    ":00"
  ].join("");
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
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.md
  },
  summary: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md
  },
  clockIcon: {
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  summaryText: {
    flex: 1
  },
  time: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900"
  },
  date: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 2,
    textTransform: "capitalize"
  },
  nowButton: {
    borderColor: colors.primary,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  nowText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800"
  },
  manual: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    gap: spacing.sm,
    padding: spacing.md
  },
  manualLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800"
  },
  manualInputs: {
    alignItems: "center",
    flexDirection: "row"
  },
  timeInput: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
    height: 48,
    textAlign: "center",
    width: 64
  },
  separator: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    paddingHorizontal: spacing.sm
  },
  stepper: {
    flexDirection: "row",
    gap: spacing.sm
  },
  stepButton: {
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    flex: 1,
    flexDirection: "row",
    gap: spacing.xs,
    justifyContent: "center",
    minHeight: 42
  },
  stepText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800"
  }
});
