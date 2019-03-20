using System;

namespace FlightsFinder.Controllers.SkyScanner
{
    public class Flight
    {
        public int flightNumber { get; private set; }
        public DateTime departure { get; private set; }
        public DateTime arrive { get; private set; }
        public Carrier carrier { get; private set; }
        public int duration { get; private set; }
        public Place originPlace { get; private set; }
        public Place destinationPlace { get; private set; }
    }
}