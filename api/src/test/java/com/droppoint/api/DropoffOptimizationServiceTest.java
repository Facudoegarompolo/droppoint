package com.droppoint.api;

import com.droppoint.api.dto.DropoffOptimizationRequest;
import com.droppoint.api.dto.Priority;
import com.droppoint.api.dto.UserPreferences;
import com.droppoint.api.provider.MockRouteProvider;
import com.droppoint.api.service.DropoffOptimizationService;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class DropoffOptimizationServiceTest {

    @Test
    void returnsBalancedOptionsWithoutHardLimitFiltering() {
        DropoffOptimizationService service = new DropoffOptimizationService(new MockRouteProvider());

        var response = service.optimize(new DropoffOptimizationRequest(
                "Universidad de Palermo, CABA",
                "Recoleta, CABA",
                "Caballito, CABA",
                LocalDateTime.parse("2026-05-16T18:00:00"),
                new UserPreferences(1, 1, Priority.BALANCED)
        ));

        assertThat(response.options()).isNotEmpty();
        assertThat(response.options())
                .anySatisfy(option -> assertThat(option.passengerWalkMinutes()).isGreaterThan(1));
        assertThat(response.options())
                .isSortedAccordingTo((left, right) -> Integer.compare(right.score(), left.score()));
    }

    @Test
    void driverDetourPrioritySortsBySmallestDriverImpactFirst() {
        DropoffOptimizationService service = new DropoffOptimizationService(new MockRouteProvider());

        var response = service.optimize(new DropoffOptimizationRequest(
                "UADE, Lima 775, CABA",
                "San Miguel, Buenos Aires",
                "Caballito, CABA",
                LocalDateTime.parse("2026-05-16T18:00:00"),
                new UserPreferences(1, 1, Priority.DRIVER_DETOUR)
        ));

        assertThat(response.options()).isNotEmpty();
        assertThat(response.options())
                .isSortedAccordingTo((left, right) -> Integer.compare(left.driverExtraMinutes(), right.driverExtraMinutes()));
    }

    @Test
    void avoidsPalermoWhenDriverRouteGoesToSanMiguelOrBellaVista() {
        DropoffOptimizationService service = new DropoffOptimizationService(new MockRouteProvider());

        var response = service.optimize(new DropoffOptimizationRequest(
                "UADE, Lima 775, CABA",
                "San Miguel / Bella Vista, Buenos Aires",
                "Caballito, CABA",
                LocalDateTime.parse("2026-05-16T18:00:00"),
                new UserPreferences(10, 12, Priority.BALANCED)
        ));

        assertThat(response.options()).isNotEmpty();
        assertThat(response.options())
                .extracting(option -> (option.title() + " " + option.dropoffAddress()).toLowerCase())
                .noneMatch(text -> text.contains("palermo"));
        assertThat(response.options().get(0).routeFitComment()).contains("noroeste");
    }

    @Test
    void keepsPassengerInCarWhenBothDestinationsAreNorthwest() {
        DropoffOptimizationService service = new DropoffOptimizationService(new MockRouteProvider());

        var response = service.optimize(new DropoffOptimizationRequest(
                "UADE, Lima 775, CABA",
                "San Miguel, Buenos Aires",
                "Bella Vista, Buenos Aires",
                LocalDateTime.parse("2026-05-16T18:00:00"),
                new UserPreferences(10, 12, Priority.BALANCED)
        ));

        assertThat(response.options()).isNotEmpty();
        assertThat(response.options().get(0).title()).contains("Bella Vista");
        assertThat(response.options().get(0).driverExtraMinutes()).isLessThanOrEqualTo(3);
        assertThat(response.options().get(0).passengerTotalMinutes()).isLessThanOrEqualTo(10);
        assertThat(response.options().get(0).routeFitComment()).contains("comparten casi todo");
        assertThat(response.options())
                .extracting(option -> (option.title() + " " + option.dropoffAddress()).toLowerCase())
                .noneMatch(text -> text.contains("palermo") || text.contains("retiro") || text.contains("chacarita"));
    }

    @Test
    void returnsNoOptionsWhenTransitCoverageIsUnavailable() {
        DropoffOptimizationService service = new DropoffOptimizationService(new MockRouteProvider());

        var response = service.optimize(new DropoffOptimizationRequest(
                "UADE, Lima 775, CABA",
                "San Miguel, Buenos Aires",
                "Bella Vista, Buenos Aires",
                LocalDateTime.parse("2026-05-16T02:30:00"),
                new UserPreferences(10, 12, Priority.BALANCED)
        ));

        assertThat(response.options()).isEmpty();
        assertThat(response.message()).contains("No hay opciones confiables");
        assertThat(response.availabilityWarning()).contains("05:00").contains("23:30");
    }
}
