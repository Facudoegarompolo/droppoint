package com.droppoint.api.service;

import com.droppoint.api.dto.DropoffOption;
import com.droppoint.api.dto.DropoffOptimizationRequest;
import com.droppoint.api.dto.DropoffOptimizationResponse;
import com.droppoint.api.dto.Priority;
import com.droppoint.api.dto.UserPreferences;
import com.droppoint.api.provider.RouteCandidate;
import com.droppoint.api.provider.RouteProvider;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class DropoffOptimizationService {

    private static final int MAX_OPTIONS = 5;

    private final RouteProvider routeProvider;

    public DropoffOptimizationService(RouteProvider routeProvider) {
        this.routeProvider = routeProvider;
    }

    public DropoffOptimizationResponse optimize(DropoffOptimizationRequest request) {
        UserPreferences preferences = request.preferences();

        List<DropoffOption> options = routeProvider.findDropoffCandidates(request).stream()
                .filter(candidate -> candidate.driverExtraMinutes() <= preferences.maxDriverDetourMinutes())
                .filter(candidate -> candidate.passengerWalkMinutes() <= preferences.maxPassengerWalkMinutes())
                .map(candidate -> toOption(candidate, preferences.priority()))
                .sorted(Comparator.comparingInt(DropoffOption::score).reversed())
                .limit(MAX_OPTIONS)
                .toList();

        return new DropoffOptimizationResponse(options);
    }

    private DropoffOption toOption(RouteCandidate candidate, Priority priority) {
        int score = calculateScore(candidate, priority);

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
                candidate.transitRecommendation(),
                buildExplanation(candidate, priority)
        );
    }

    private int calculateScore(RouteCandidate candidate, Priority priority) {
        double driverWeight = priority == Priority.DRIVER_DETOUR ? 4.2 : 3.0;
        double passengerWeight = priority == Priority.PASSENGER_TIME ? 1.35 : 1.0;
        double balancedBonus = priority == Priority.BALANCED ? 6.0 : 0.0;

        double rawScore = 100
                - candidate.driverExtraMinutes() * driverWeight
                - candidate.passengerTotalMinutes() * passengerWeight
                - candidate.passengerWalkMinutes() * 1.5
                - candidate.passengerTransfers() * 5
                + balancedBonus;

        return Math.max(0, Math.min(100, (int) Math.round(rawScore)));
    }

    private String buildExplanation(RouteCandidate candidate, Priority priority) {
        String driverImpact = "El conductor suma " + candidate.driverExtraMinutes() + " min";
        String passengerImpact = "el pasajero sigue en unos " + candidate.passengerTotalMinutes() + " min";
        String walkImpact = "con " + candidate.passengerWalkMinutes() + " min de caminata";
        String transferImpact = candidate.passengerTransfers() == 0
                ? "sin transbordos"
                : "con " + candidate.passengerTransfers() + " transbordo(s)";

        if (candidate.driverExtraMinutes() <= 4 && candidate.passengerWalkMinutes() <= 6) {
            return "Muy buena opción: " + driverImpact + " y " + passengerImpact + ", " + walkImpact + " y " + transferImpact + ". Recomendación: " + candidate.transitRecommendation();
        }

        if (priority == Priority.DRIVER_DETOUR) {
            return "Conviene si querés cuidar al conductor: " + driverImpact + ". Para el pasajero queda un tramo razonable, " + walkImpact + " y " + transferImpact + ". Recomendación: " + candidate.transitRecommendation();
        }

        if (priority == Priority.PASSENGER_TIME) {
            return "Conviene si el pasajero quiere llegar rápido: " + passengerImpact + ", " + walkImpact + " y " + transferImpact + ". Recomendación: " + candidate.transitRecommendation();
        }

        if (candidate.passengerTransfers() == 0) {
            return "Opción cómoda para el pasajero: " + transferImpact + ", " + walkImpact + ". El conductor suma " + candidate.driverExtraMinutes() + " min. Recomendación: " + candidate.transitRecommendation();
        }

        return "Alternativa equilibrada: " + driverImpact + ", " + passengerImpact + ", " + walkImpact + " y " + transferImpact + ". Recomendación: " + candidate.transitRecommendation();
    }
}
