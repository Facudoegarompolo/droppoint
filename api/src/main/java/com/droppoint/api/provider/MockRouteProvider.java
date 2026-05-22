package com.droppoint.api.provider;

import com.droppoint.api.dto.DropoffOptimizationRequest;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;

@Component
@ConditionalOnProperty(name = "droppoint.route-provider", havingValue = "mock", matchIfMissing = true)
public class MockRouteProvider implements RouteProvider {

    @Override
    public List<RouteCandidate> findDropoffCandidates(DropoffOptimizationRequest request) {
        String driverDestination = normalize(request.driverDestination());
        String passengerDestination = normalize(request.passengerDestination());
        String fullRoute = normalize(String.join(" ", request.origin(), request.driverDestination(), request.passengerDestination()));

        if (isNorthwestCorridor(driverDestination) && isNorthwestCorridor(passengerDestination)) {
            return sharedNorthwestDestinationCandidates(request);
        }

        if (isNorthwestCorridor(driverDestination)) {
            return northwestCorridorCandidates(request);
        }

        if (isWestCorridor(fullRoute)) {
            return westCorridorCandidates(request);
        }

        if (isPalermoCorridor(fullRoute)) {
            return palermoCorridorCandidates(request);
        }

        return centralBuenosAiresCandidates(request);
    }

    private List<RouteCandidate> sharedNorthwestDestinationCandidates(DropoffOptimizationRequest request) {
        String target = destinationLabel(request.passengerDestination());
        String passengerDestination = normalize(request.passengerDestination());

        if (containsAny(passengerDestination, "bella vista")) {
            return List.of(
                    candidate(
                            "Bajarse cerca de Bella Vista",
                            "Estación Bella Vista, San Miguel, Buenos Aires",
                            -34.5631,
                            -58.6908,
                            2,
                            5,
                            3,
                            0,
                            100,
                            "Conductor y pasajero comparten casi todo el recorrido; la bajada queda en el tramo final hacia Bella Vista.",
                            "Bajar en Bella Vista y completar el último tramo caminando o con un viaje local corto hacia " + target + "."
                    ),
                    candidate(
                            "Bajarse en San Miguel centro",
                            "Av. Presidente Perón y Balbín, San Miguel, Buenos Aires",
                            -34.5412,
                            -58.7146,
                            1,
                            12,
                            6,
                            0,
                            94,
                            "Aprovecha casi todo el viaje compartido y deja al pasajero a pocos minutos de Bella Vista.",
                            "Desde San Miguel centro, seguir en colectivo local, tren corto o auto de apoyo hacia " + target + "."
                    ),
                    candidate(
                            "Bajarse en Muñiz",
                            "Estación Muñiz, San Miguel, Buenos Aires",
                            -34.5553,
                            -58.7058,
                            2,
                            9,
                            5,
                            0,
                            95,
                            "Es un punto intermedio del tramo final San Miguel/Bella Vista, sin cortar el viaje antes de tiempo.",
                            "Bajar en Muñiz y continuar un tramo local corto hacia " + target + "."
                    )
            );
        }

        return List.of(
                candidate(
                        "Bajarse en San Miguel centro",
                        "Av. Presidente Perón y Balbín, San Miguel, Buenos Aires",
                        -34.5412,
                        -58.7146,
                        1,
                        6,
                        4,
                        0,
                        98,
                        "Conductor y pasajero comparten casi todo el recorrido; la bajada queda en el tramo final de San Miguel.",
                        "Bajar en San Miguel centro y completar el último tramo caminando o con un viaje local corto hacia " + target + "."
                ),
                candidate(
                        "Bajarse en Muñiz",
                        "Estación Muñiz, San Miguel, Buenos Aires",
                        -34.5553,
                        -58.7058,
                        2,
                        10,
                        5,
                        0,
                        95,
                        "Mantiene al pasajero dentro del mismo corredor final, sin bajarlo en CABA.",
                        "Desde Muñiz, continuar en tren corto, colectivo local o caminata según el punto exacto de " + target + "."
                ),
                candidate(
                        "Bajarse cerca de Bella Vista",
                        "Estación Bella Vista, San Miguel, Buenos Aires",
                        -34.5631,
                        -58.6908,
                        4,
                        14,
                        7,
                        0,
                        91,
                        "Tiene sentido solo si el punto exacto queda más cerca de Bella Vista que de San Miguel centro.",
                        "Bajar en Bella Vista y volver por conexión local si el destino final queda hacia San Miguel."
                )
        );
    }

    private List<RouteCandidate> northwestCorridorCandidates(DropoffOptimizationRequest request) {
        String target = destinationLabel(request.passengerDestination());

        return List.of(
                candidate(
                        "Bajarse en Retiro para Tren San Martín",
                        "Av. Ramos Mejía y Padre Mugica, Retiro, CABA",
                        -34.5913,
                        -58.3742,
                        5,
                        estimatePassengerMinutes(request, 44, 24),
                        5,
                        0,
                        92,
                        "Queda alineado con el corredor noroeste hacia San Miguel/Bella Vista.",
                        "Caminar a Retiro y tomar el Tren San Martín; si " + target + " no queda sobre esa línea, usar Retiro para combinar."
                ),
                candidate(
                        "Bajarse en Chacarita",
                        "Av. Corrientes y Jorge Newbery, Chacarita, CABA",
                        -34.5872,
                        -58.4533,
                        7,
                        estimatePassengerMinutes(request, 38, 26),
                        4,
                        1,
                        90,
                        "Acompaña mejor la salida hacia el noroeste que un desvío por Palermo.",
                        "Conectar con Tren San Martín o Subte B; buena alternativa para seguir hacia " + target + "."
                ),
                candidate(
                        "Bajarse en Villa del Parque",
                        "Cuenca y Baigorria, Villa del Parque, CABA",
                        -34.5997,
                        -58.4947,
                        9,
                        estimatePassengerMinutes(request, 31, 34),
                        6,
                        0,
                        87,
                        "Está sobre una continuación razonable del corredor hacia San Miguel/Bella Vista.",
                        "Seguir en Tren San Martín o combinar con colectivos de la zona oeste/noroeste hacia " + target + "."
                ),
                candidate(
                        "Bajarse en San Martín y General Paz",
                        "Av. San Martín y Av. General Paz, CABA",
                        -34.5650,
                        -58.5031,
                        10,
                        estimatePassengerMinutes(request, 35, 38),
                        8,
                        1,
                        82,
                        "Es un borde de CABA útil para no mandar al conductor a un punto fuera de camino.",
                        "Usar colectivos sobre General Paz o conectar con estaciones cercanas del corredor noroeste hacia " + target + "."
                )
        );
    }

    private List<RouteCandidate> westCorridorCandidates(DropoffOptimizationRequest request) {
        String target = destinationLabel(request.passengerDestination());

        return List.of(
                candidate(
                        "Bajarse en Once",
                        "Av. Rivadavia y Pueyrredón, Balvanera, CABA",
                        -34.6099,
                        -58.4064,
                        4,
                        estimatePassengerMinutes(request, 34, 18),
                        5,
                        0,
                        91,
                        "Calza con un corredor oeste y evita rodeos innecesarios.",
                        "Tomar Subte A, Tren Sarmiento o colectivos por Rivadavia hacia " + target + "."
                ),
                candidate(
                        "Bajarse en Acoyte y Rivadavia",
                        "Av. Rivadavia y Acoyte, Caballito, CABA",
                        -34.6187,
                        -58.4352,
                        7,
                        estimatePassengerMinutes(request, 28, 12),
                        4,
                        0,
                        88,
                        "Mantiene al conductor sobre una traza oeste dentro de CABA.",
                        "Tomar Subte A o colectivos sobre Rivadavia; buen nodo si el pasajero sigue hacia " + target + "."
                ),
                candidate(
                        "Bajarse en Flores",
                        "Av. Rivadavia y Nazca, Flores, CABA",
                        -34.6261,
                        -58.4625,
                        9,
                        estimatePassengerMinutes(request, 24, 20),
                        6,
                        0,
                        84,
                        "Sirve para seguir hacia el oeste sin cruzar hacia Palermo.",
                        "Usar Subte A, Sarmiento desde Flores o colectivos por Rivadavia hacia " + target + "."
                ),
                candidate(
                        "Bajarse en Liniers",
                        "Av. Rivadavia y General Paz, Liniers, CABA",
                        -34.6383,
                        -58.5299,
                        11,
                        estimatePassengerMinutes(request, 20, 36),
                        7,
                        1,
                        78,
                        "Es útil solo si el conductor ya continúa hacia el oeste.",
                        "Combinar tren, colectivos o premetro del borde oeste hacia " + target + "."
                )
        );
    }

    private List<RouteCandidate> palermoCorridorCandidates(DropoffOptimizationRequest request) {
        String target = destinationLabel(request.passengerDestination());

        return List.of(
                candidate(
                        "Bajarse cerca de Estación Palermo",
                        "Av. Santa Fe y Juan B. Justo, CABA",
                        -34.5800,
                        -58.4260,
                        4,
                        estimatePassengerMinutes(request, 31, 22),
                        5,
                        1,
                        86,
                        "Tiene sentido porque la ruta o el destino ya pasan por Palermo/Belgrano.",
                        "Caminar hasta Estación Palermo y tomar Tren San Martín, Subte D o colectivos hacia " + target + "."
                ),
                candidate(
                        "Bajarse en Plaza Italia",
                        "Av. Santa Fe y Thames, CABA",
                        -34.5814,
                        -58.4216,
                        3,
                        estimatePassengerMinutes(request, 35, 20),
                        8,
                        1,
                        84,
                        "Funciona como nodo de Palermo sin alejar demasiado al conductor.",
                        "Tomar Subte D desde Plaza Italia o colectivos sobre Santa Fe hacia " + target + "."
                ),
                candidate(
                        "Bajarse cerca de Alto Palermo",
                        "Av. Santa Fe y Coronel Díaz, CABA",
                        -34.5887,
                        -58.4100,
                        6,
                        estimatePassengerMinutes(request, 28, 18),
                        6,
                        1,
                        79,
                        "Es razonable para rutas por Santa Fe, aunque menos directo que Plaza Italia.",
                        "Tomar Subte D en Bulnes o colectivos por Santa Fe hacia " + target + "."
                ),
                candidate(
                        "Bajarse en Scalabrini Ortiz",
                        "Av. Santa Fe y Scalabrini Ortiz, CABA",
                        -34.5855,
                        -58.4150,
                        2,
                        estimatePassengerMinutes(request, 40, 22),
                        10,
                        2,
                        76,
                        "Prioriza poco desvío del conductor, con más fricción para el pasajero.",
                        "Tomar Subte D en Scalabrini Ortiz y combinar con subte o colectivos hacia " + target + "."
                )
        );
    }

    private List<RouteCandidate> centralBuenosAiresCandidates(DropoffOptimizationRequest request) {
        String target = destinationLabel(request.passengerDestination());

        return List.of(
                candidate(
                        "Bajarse en 9 de Julio y Corrientes",
                        "Av. 9 de Julio y Av. Corrientes, San Nicolás, CABA",
                        -34.6037,
                        -58.3816,
                        3,
                        estimatePassengerMinutes(request, 32, 18),
                        4,
                        1,
                        88,
                        "Es un nodo céntrico flexible cuando todavía no hay un corredor dominante.",
                        "Combinar Subte B, C o D y colectivos del centro hacia " + target + "."
                ),
                candidate(
                        "Bajarse en Once",
                        "Av. Rivadavia y Pueyrredón, Balvanera, CABA",
                        -34.6099,
                        -58.4064,
                        6,
                        estimatePassengerMinutes(request, 34, 20),
                        5,
                        0,
                        84,
                        "Da buena continuidad si el viaje se abre hacia oeste o centro.",
                        "Tomar Subte A, Tren Sarmiento o colectivos por Rivadavia hacia " + target + "."
                ),
                candidate(
                        "Bajarse en Pueyrredón y Santa Fe",
                        "Av. Pueyrredón y Av. Santa Fe, CABA",
                        -34.5947,
                        -58.4037,
                        8,
                        estimatePassengerMinutes(request, 32, 21),
                        7,
                        1,
                        76,
                        "Sirve como nodo de combinación, pero exige algo más de desvío.",
                        "Combinar Subte D y H o colectivos hacia " + target + "."
                ),
                candidate(
                        "Bajarse cerca de Medrano",
                        "Av. Corrientes y Medrano, CABA",
                        -34.6042,
                        -58.4218,
                        10,
                        estimatePassengerMinutes(request, 26, 17),
                        4,
                        0,
                        74,
                        "Conviene cuando Corrientes queda cerca del camino real del conductor.",
                        "Tomar Subte B en Medrano o colectivos por Corrientes hacia " + target + "."
                )
        );
    }

    private RouteCandidate candidate(
            String title,
            String address,
            double lat,
            double lng,
            int driverExtraMinutes,
            int passengerTotalMinutes,
            int passengerWalkMinutes,
            int passengerTransfers,
            int routeFitScore,
            String routeFitComment,
            String transitRecommendation
    ) {
        return new RouteCandidate(
                title,
                address,
                lat,
                lng,
                driverExtraMinutes,
                passengerTotalMinutes,
                passengerWalkMinutes,
                passengerTransfers,
                routeFitScore,
                routeFitComment,
                transitRecommendation
        );
    }

    private int estimatePassengerMinutes(DropoffOptimizationRequest request, int corridorMinutes, int cabaMinutes) {
        String passengerDestination = normalize(request.passengerDestination());
        if (isOuterBuenosAiresDestination(passengerDestination)) {
            return corridorMinutes;
        }
        if (containsAny(passengerDestination, "caba", "capital", "caballito", "flores", "almagro", "palermo", "recoleta", "retiro", "belgrano", "monserrat", "villa urquiza")) {
            return cabaMinutes;
        }
        return Math.max(corridorMinutes, cabaMinutes);
    }

    private String destinationLabel(String destination) {
        return destination == null || destination.isBlank() ? "el destino final" : destination.trim();
    }

    private boolean isNorthwestCorridor(String text) {
        return containsAny(text, "san miguel", "bella vista", "jose c paz", "jose c. paz", "malvinas", "pilar", "muniz", "hurlingham", "campo de mayo");
    }

    private boolean isWestCorridor(String text) {
        return containsAny(text, "caballito", "flores", "floresta", "liniers", "ramos mejia", "moron", "ituzaingo", "merlo", "castelar", "haedo", "parque chacabuco");
    }

    private boolean isPalermoCorridor(String text) {
        return containsAny(text, "palermo", "belgrano", "colegiales", "nunez", "chacarita", "villa crespo");
    }

    private boolean isOuterBuenosAiresDestination(String text) {
        return containsAny(text, "san miguel", "bella vista", "jose c paz", "jose c. paz", "malvinas", "pilar", "muniz", "hurlingham", "campo de mayo", "ramos mejia", "moron", "ituzaingo", "merlo", "castelar", "haedo", "liniers");
    }

    private boolean containsAny(String text, String... terms) {
        for (String term : terms) {
            if (text.contains(term)) {
                return true;
            }
        }
        return false;
    }

    private String normalize(String value) {
        String withoutAccents = Normalizer.normalize(value == null ? "" : value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        return withoutAccents.toLowerCase(Locale.ROOT).trim();
    }
}
