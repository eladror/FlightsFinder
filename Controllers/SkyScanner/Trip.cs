using System;
using System.Collections.Generic;

namespace FlightsFinder.Controllers.SkyScanner
{
    public class Trip
    {
        public FlightOption outbound { get; set; }
        public FlightOption inbound { get; set; }
        public List<Agent> agents { get; set; }
        public Place originPlace { get; set; }
        public Place destinationPlace { get; set; }
    }
}