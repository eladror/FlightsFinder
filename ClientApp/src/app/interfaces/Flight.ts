interface Flight {
    flightNumber: number;
    departure: Date;
    arrive: Date;
    carrier: Carrier;
    duration: number;
    originPlace: Place;
    destinationPlace: Place;
}
