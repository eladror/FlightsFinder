interface Flight {
    flightNumber: number;
    departure: Date;
    arrive: Date;
    daysDiff: number;
    carrier: Carrier;
    duration: number;
    originPlace: Place;
    destinationPlace: Place;
}
