package com.droppoint.api.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record UserPreferences(
        @Positive(message = "maxDriverDetourMinutes must be positive")
        int maxDriverDetourMinutes,

        @Positive(message = "maxPassengerWalkMinutes must be positive")
        int maxPassengerWalkMinutes,

        @NotNull(message = "priority is required")
        Priority priority
) {
}
