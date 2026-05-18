import { DropoffOptimizationRequest, DropoffOptimizationResponse, DropoffOption } from "../types/dropoff";

export type RootStackParamList = {
  Home: undefined;
  Results: {
    request: DropoffOptimizationRequest;
    response: DropoffOptimizationResponse;
  };
  OptionDetail: {
    option: DropoffOption;
    request: DropoffOptimizationRequest;
  };
};
