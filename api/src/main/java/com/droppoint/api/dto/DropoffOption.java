package com.droppoint.api.dto;

public record DropoffOption(
        String title,
        String dropoffAddress,
        double dropoffLat,
        double dropoffLng,
        int driverExtraMinutes,
        int passengerTotalMinutes,
        int passengerWalkMinutes,
        int passengerTransfers,
        int score,
        String transitRecommendation,
        String explanation
) {
}
