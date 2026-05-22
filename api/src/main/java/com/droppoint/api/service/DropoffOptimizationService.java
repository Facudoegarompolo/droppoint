package com.droppoint.api.service;

import com.droppoint.api.dto.DropoffOption;
import com.droppoint.api.dto.DropoffOptimizationRequest;
import com.droppoint.api.dto.DropoffOptimizationResponse;
import com.droppoint.api.dto.Priority;
import com.droppoint.api.provider.RouteCandidate;
import com.droppoint.api.provider.RouteProvider;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
public class DropoffOptimizationService {

    private static final int MAX_OPTIONS = 5;
    private static final LocalTime TRANSIT_SERVICE_START = LocalTime.of(5, 0);
    private static final LocalTime TRANSIT_SERVICE_END = LocalTime.of(23, 30);

    private final RouteProvider routeProvider;

    public DropoffOptimizationService(RouteProvider routeProvider) {
        this.routeProvider = routeProvider;
    }

    public DropoffOptimizationResponse optimize(DropoffOptimizationRequest request) {
        if (!hasRegularTransitCoverage(request.departureTime().toLocalTime())) {
            return new DropoffOptimizationResponse(
                    List.of(),
                    "No hay opciones confiables de transporte público para ese horario.",
                    "Para el MVP usamos cobertura regular de Buenos Aires entre 05:00 y 23:30. Probá otro horario o resolvé ese tramo fuera de DropPoint."
            );
        }

        Priority priority = request.preferences().priority();

        List<DropoffOption> options = routeProvider.findDropoffCandidates(request).stream()
                .map(candidate -> toOption(candidate, priority))
                .sorted(optionComparator(priority))
                .limit(MAX_OPTIONS)
                .toList();

        String message = options.isEmpty()
                ? "No encontramos opciones para ese trayecto y horario."
                : buildResponseMessage(priority);

        return new DropoffOptimizationResponse(options, message, null);
    }

    private DropoffOption toOption(RouteCandidate candidate, Priority priority) {
        int score = calculateScore(candidate, priority);
        String scoreLabel = buildScoreLabel(score);

        return new DropoffOption(
                candidate.title(),
                candidate.address(),
                candidate.lat(),
                candidate.lng(),
                candidate.driverExtraMinutes(),
                candidate.passengerTotalMinutes(),
                candidate.passengerWalkMinutes(),
                candidate.passengerTransfers(),
                score,
                scoreLabel,
                buildScoreBreakdown(candidate, priority, score, scoreLabel),
                candidate.routeFitComment(),
                candidate.transitRecommendation(),
                buildExplanation(candidate, priority, scoreLabel)
        );
    }

    private Comparator<DropoffOption> optionComparator(Priority priority) {
        return switch (priority) {
            case DRIVER_DETOUR -> Comparator
                    .comparingInt(DropoffOption::driverExtraMinutes)
                    .thenComparingInt(DropoffOption::passengerWalkMinutes)
                    .thenComparingInt(DropoffOption::passengerTotalMinutes)
                    .thenComparing(Comparator.comparingInt(DropoffOption::score).reversed());
            case PASSENGER_TIME -> Comparator
                    .comparingInt(DropoffOption::passengerTotalMinutes)
                    .thenComparingInt(DropoffOption::passengerWalkMinutes)
                    .thenComparingInt(DropoffOption::driverExtraMinutes)
                    .thenComparing(Comparator.comparingInt(DropoffOption::score).reversed());
            case BALANCED -> Comparator
                    .comparingInt(DropoffOption::score)
                    .reversed()
                    .thenComparingInt(DropoffOption::driverExtraMinutes)
                    .thenComparingInt(DropoffOption::passengerWalkMinutes);
        };
    }

    private String buildResponseMessage(Priority priority) {
        return switch (priority) {
            case DRIVER_DETOUR -> "Ordenamos priorizando el menor desvío del conductor y, entre opciones parecidas, menor caminata y tiempo del pasajero.";
            case PASSENGER_TIME -> "Ordenamos priorizando el menor tiempo del pasajero y, entre opciones parecidas, menor caminata y desvío.";
            case BALANCED -> "Ordenamos equilibrando desvío del conductor, tiempo del pasajero, caminata y encaje con la ruta.";
        };
    }

    private int calculateScore(RouteCandidate candidate, Priority priority) {
        double driverWeight = priority == Priority.DRIVER_DETOUR ? 4.0 : 2.6;
        double passengerWeight = priority == Priority.PASSENGER_TIME ? 1.15 : 0.7;
        double balancedBonus = priority == Priority.BALANCED ? 4.0 : 0.0;
        double passengerMinutesAboveBase = Math.max(0, candidate.passengerTotalMinutes() - 12);
        double routeMismatchPenalty = Math.max(0, 100 - candidate.routeFitScore()) * 0.30;

        double rawScore = 100
                - candidate.driverExtraMinutes() * driverWeight
                - passengerMinutesAboveBase * passengerWeight
                - candidate.passengerWalkMinutes() * 1.1
                - candidate.passengerTransfers() * 6
                - routeMismatchPenalty
                + balancedBonus;

        return Math.max(0, Math.min(100, (int) Math.round(rawScore)));
    }

    private boolean hasRegularTransitCoverage(LocalTime departureTime) {
        return !departureTime.isBefore(TRANSIT_SERVICE_START) && !departureTime.isAfter(TRANSIT_SERVICE_END);
    }

    private String buildScoreLabel(int score) {
        if (score >= 80) return "Excelente";
        if (score >= 65) return "Buena";
        if (score >= 45) return "Aceptable";
        return "Cuidado";
    }

    private String buildScoreBreakdown(RouteCandidate candidate, Priority priority, int score, String scoreLabel) {
        String priorityText = switch (priority) {
            case DRIVER_DETOUR -> "priorizando que el conductor no se desvíe";
            case PASSENGER_TIME -> "priorizando que el pasajero llegue rápido";
            case BALANCED -> "equilibrando conductor y pasajero";
        };

        return "Score " + score + "/100 (" + scoreLabel.toLowerCase(Locale.ROOT) + "): " + priorityText
                + ", con " + candidate.driverExtraMinutes() + " min extra para el conductor, "
                + candidate.passengerTotalMinutes() + " min estimados para el pasajero, "
                + candidate.passengerWalkMinutes() + " min de caminata y "
                + candidate.passengerTransfers() + " transbordo(s). "
                + candidate.routeFitComment();
    }

    private String buildExplanation(RouteCandidate candidate, Priority priority, String scoreLabel) {
        String driverImpact = "El conductor suma " + candidate.driverExtraMinutes() + " min";
        String passengerImpact = "el pasajero sigue en unos " + candidate.passengerTotalMinutes() + " min";
        String walkImpact = "con " + candidate.passengerWalkMinutes() + " min de caminata";
        String transferImpact = candidate.passengerTransfers() == 0
                ? "sin transbordos"
                : "con " + candidate.passengerTransfers() + " transbordo(s)";
        String routeFit = candidate.routeFitComment();

        if (candidate.driverExtraMinutes() <= 4 && candidate.passengerWalkMinutes() <= 6) {
            return scoreLabel + ": " + routeFit + " " + driverImpact + " y " + passengerImpact + ", " + walkImpact + " y " + transferImpact + ". Recomendación: " + candidate.transitRecommendation();
        }

        if (priority == Priority.DRIVER_DETOUR) {
            return scoreLabel + " para cuidar al conductor: " + driverImpact + ". " + routeFit + " Para el pasajero queda un tramo razonable, " + walkImpact + " y " + transferImpact + ". Recomendación: " + candidate.transitRecommendation();
        }

        if (priority == Priority.PASSENGER_TIME) {
            return scoreLabel + " si el pasajero quiere llegar rápido: " + passengerImpact + ", " + walkImpact + " y " + transferImpact + ". " + routeFit + " Recomendación: " + candidate.transitRecommendation();
        }

        if (candidate.passengerTransfers() == 0) {
            return scoreLabel + " y cómoda para el pasajero: " + transferImpact + ", " + walkImpact + ". " + routeFit + " El conductor suma " + candidate.driverExtraMinutes() + " min. Recomendación: " + candidate.transitRecommendation();
        }

        return scoreLabel + " como alternativa equilibrada: " + driverImpact + ", " + passengerImpact + ", " + walkImpact + " y " + transferImpact + ". " + routeFit + " Recomendación: " + candidate.transitRecommendation();
    }
}
