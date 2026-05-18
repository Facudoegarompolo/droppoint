package com.droppoint.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record DropoffOptimizationRequest(
        @NotBlank(message = "origin is required")
        String origin,

        @NotBlank(message = "driverDestination is required")
        String driverDestination,

        @NotBlank(message = "passengerDestination is required")
        String passengerDestination,

        @NotNull(message = "departureTime is required")
        LocalDateTime departureTime,

        @Valid
        @NotNull(message = "preferences are required")
        UserPreferences preferences
) {
}
