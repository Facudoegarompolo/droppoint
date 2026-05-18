package com.droppoint.api.controller;

import com.droppoint.api.dto.DropoffOptimizationRequest;
import com.droppoint.api.dto.DropoffOptimizationResponse;
import com.droppoint.api.service.DropoffOptimizationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dropoff")
public class DropoffOptimizationController {

    private final DropoffOptimizationService optimizationService;

    public DropoffOptimizationController(DropoffOptimizationService optimizationService) {
        this.optimizationService = optimizationService;
    }

    @PostMapping("/optimize")
    public ResponseEntity<DropoffOptimizationResponse> optimize(
            @Valid @RequestBody DropoffOptimizationRequest request
    ) {
        return ResponseEntity.ok(optimizationService.optimize(request));
    }
}
