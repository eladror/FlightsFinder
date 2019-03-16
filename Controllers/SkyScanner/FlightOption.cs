using System;
using System.Collections.Generic;

namespace FlightsFinder.Controllers.SkyScanner
{
    public class FlightOption
    {
        public DateTime departure { get; private set; }
        public DateTime arrive { get; private set; }
        public int duration { get; private set; }
        public List<Flight> flights { get; private set; }
    }
}