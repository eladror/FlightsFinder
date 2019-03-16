using System;
using System.Collections.Generic;

namespace FlightsFinder.Controllers.SkyScanner
{
    public class Trip
    {
        public DateTime departure { get; private set; }
        public DateTime arrive { get; private set; }
        public FlightOption outbound { get; private set; }
        public FlightOption inbound { get; private set; }
        public List<Agent> agents { get; private set; }
    }
}