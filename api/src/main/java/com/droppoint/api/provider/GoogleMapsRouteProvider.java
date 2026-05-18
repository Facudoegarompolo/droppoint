package com.droppoint.api.provider;

import com.droppoint.api.dto.DropoffOptimizationRequest;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConditionalOnProperty(name = "droppoint.route-provider", havingValue = "google")
public class GoogleMapsRouteProvider implements RouteProvider {

    private final String apiKey;

    public GoogleMapsRouteProvider(@Value("${droppoint.google-maps.api-key:}") String apiKey) {
        this.apiKey = apiKey;
    }

    @Override
    public List<RouteCandidate> findDropoffCandidates(DropoffOptimizationRequest request) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("Google Maps provider requires GOOGLE_MAPS_API_KEY");
        }

        // TODO: Use Google Directions, Roads/Routes and Transit APIs to build real candidates.
        throw new IllegalStateException("Google Maps provider is prepared but not implemented yet");
    }
}
