interface Trip {
  agents: Agent[];
  lowestPriceAgent: Agent;
  inbound: FlightOption;
  outbound: FlightOption;
  originPlace: Place;
  destinationPlace: Place;
  outboundDate: Date;
  inboundDate: Date;
}
