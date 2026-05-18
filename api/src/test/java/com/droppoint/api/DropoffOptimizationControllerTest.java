package com.droppoint.api;

import com.droppoint.api.controller.DropoffOptimizationController;
import com.droppoint.api.exception.GlobalExceptionHandler;
import com.droppoint.api.provider.MockRouteProvider;
import com.droppoint.api.service.DropoffOptimizationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.lessThanOrEqualTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class DropoffOptimizationControllerTest {

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        var service = new DropoffOptimizationService(new MockRouteProvider());
        var controller = new DropoffOptimizationController(service);
        var validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .setValidator(validator)
                .build();
    }

    @Test
    void optimizesDropoffOptions() throws Exception {
        mockMvc.perform(post("/api/dropoff/optimize")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "origin": "Universidad de Palermo, CABA",
                                  "driverDestination": "Recoleta, CABA",
                                  "passengerDestination": "Caballito, CABA",
                                  "departureTime": "2026-05-16T18:00:00",
                                  "preferences": {
                                    "maxDriverDetourMinutes": 10,
                                    "maxPassengerWalkMinutes": 12,
                                    "priority": "BALANCED"
                                  }
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.options.length()", greaterThan(0)))
                .andExpect(jsonPath("$.options[0].score", lessThanOrEqualTo(100)))
                .andExpect(jsonPath("$.options[0].title").isString())
                .andExpect(jsonPath("$.options[0].dropoffAddress").isString());
    }

    @Test
    void rejectsInvalidRequests() throws Exception {
        mockMvc.perform(post("/api/dropoff/optimize")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "origin": "",
                                  "driverDestination": "Recoleta, CABA",
                                  "passengerDestination": "Caballito, CABA",
                                  "departureTime": "2026-05-16T18:00:00",
                                  "preferences": {
                                    "maxDriverDetourMinutes": 0,
                                    "maxPassengerWalkMinutes": 12,
                                    "priority": "BALANCED"
                                  }
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.origin").isString())
                .andExpect(jsonPath("$.errors['preferences.maxDriverDetourMinutes']").isString());
    }
}
