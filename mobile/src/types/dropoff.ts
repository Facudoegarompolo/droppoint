export type Priority = "DRIVER_DETOUR" | "PASSENGER_TIME" | "BALANCED";

export type UserPreferences = {
  maxDriverDetourMinutes: number;
  maxPassengerWalkMinutes: number;
  priority: Priority;
};

export type DropoffOptimizationRequest = {
  origin: string;
  driverDestination: string;
  passengerDestination: string;
  departureTime: string;
  preferences: UserPreferences;
};

export type DropoffOption = {
  title: string;
  dropoffAddress: string;
  dropoffLat: number;
  dropoffLng: number;
  driverExtraMinutes: number;
  passengerTotalMinutes: number;
  passengerWalkMinutes: number;
  passengerTransfers: number;
  score: number;
  transitRecommendation: string;
  explanation: string;
};

export type DropoffOptimizationResponse = {
  options: DropoffOption[];
};
