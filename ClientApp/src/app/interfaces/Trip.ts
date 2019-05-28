interface Trip {
    agents: Agent[];
    lowestPriceAgent: Agent;
    inbound: FlightOption;
    outbound: FlightOption;
    whereFrom: string;
    whereTo: string;
  }
