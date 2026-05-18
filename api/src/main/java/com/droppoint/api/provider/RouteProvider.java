package com.droppoint.api.provider;

import com.droppoint.api.dto.DropoffOptimizationRequest;

import java.util.List;

public interface RouteProvider {
    List<RouteCandidate> findDropoffCandidates(DropoffOptimizationRequest request);
}
