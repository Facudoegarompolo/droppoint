package com.droppoint.api.dto;

import java.util.List;

public record DropoffOptimizationResponse(
        List<DropoffOption> options
) {
}
