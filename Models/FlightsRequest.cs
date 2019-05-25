using System;
using System.Collections.Generic;

namespace FlightsFinder.Controllers.SkyScanner
{
    public class FlightRequest
    {
        public string Ela { get; set; }
        public DateTime outboundDate { get; set; }
        public DateTime inboundDate { get; set; }
        public Place originPlace { get; set; }
        public Place destinationPlace { get; set; }
        public int people { get; set; }
    }
}