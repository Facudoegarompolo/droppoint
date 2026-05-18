package com.droppoint.api.provider;

public record RouteCandidate(
        String title,
        String address,
        double lat,
        double lng,
        int driverExtraMinutes,
        int passengerTotalMinutes,
        int passengerWalkMinutes,
        int passengerTransfers,
        String transitRecommendation
) {
}
