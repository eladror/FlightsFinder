using System;

namespace FlightsFinder.Controllers.SkyScanner
{
    public class Flight
    {
        public int flightNumber { get; set; }
        public DateTime departure { get; set; }
        public DateTime arrive { get; set; }
        public Carrier carrier { get; set; }
        public int duration { get; set; }
        public Place originPlace { get; set; }
        public Place destinationPlace { get; set; }
    }
}