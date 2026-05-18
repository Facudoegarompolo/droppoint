package com.droppoint.api.provider;

import com.droppoint.api.dto.DropoffOptimizationRequest;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConditionalOnProperty(name = "droppoint.route-provider", havingValue = "mock", matchIfMissing = true)
public class MockRouteProvider implements RouteProvider {

    @Override
    public List<RouteCandidate> findDropoffCandidates(DropoffOptimizationRequest request) {
        return List.of(
                new RouteCandidate(
                        "Bajarse cerca de Estación Palermo",
                        "Av. Santa Fe y Juan B. Justo, CABA",
                        -34.5800,
                        -58.4260,
                        4,
                        31,
                        5,
                        1,
                        "Caminar hasta Estación Palermo y tomar el Tren San Martín o combinar con Subte D según destino."
                ),
                new RouteCandidate(
                        "Bajarse en Plaza Italia",
                        "Av. Santa Fe y Thames, CABA",
                        -34.5814,
                        -58.4216,
                        3,
                        35,
                        8,
                        1,
                        "Tomar Subte D desde Plaza Italia; si vas hacia el oeste, combinar con Subte A o colectivos sobre Av. Santa Fe."
                ),
                new RouteCandidate(
                        "Bajarse cerca de Alto Palermo",
                        "Av. Santa Fe y Coronel Diaz, CABA",
                        -34.5887,
                        -58.4100,
                        6,
                        28,
                        6,
                        1,
                        "Tomar Subte D en Bulnes o colectivos por Av. Santa Fe; buena conexión para cruzar hacia el centro."
                ),
                new RouteCandidate(
                        "Bajarse en Scalabrini Ortiz",
                        "Av. Santa Fe y Scalabrini Ortiz, CABA",
                        -34.5855,
                        -58.4150,
                        2,
                        40,
                        10,
                        2,
                        "Tomar Subte D en Scalabrini Ortiz y combinar si hace falta con Subte B o colectivos hacia el destino final."
                ),
                new RouteCandidate(
                        "Bajarse cerca de Medrano",
                        "Av. Corrientes y Medrano, CABA",
                        -34.6042,
                        -58.4218,
                        11,
                        24,
                        4,
                        0,
                        "Tomar Subte B en Medrano o colectivos por Av. Corrientes; opción directa y con poca caminata."
                ),
                new RouteCandidate(
                        "Bajarse en Pueyrredón y Santa Fe",
                        "Av. Pueyrredon y Av. Santa Fe, CABA",
                        -34.5947,
                        -58.4037,
                        8,
                        32,
                        7,
                        1,
                        "Combinar Subte D y H desde Santa Fe/Pueyrredón; buen nodo si el destino queda hacia Once, Recoleta o sur de CABA."
                )
        );
    }
}
