using System;
using System.Collections.Generic;

namespace FlightsFinder.Controllers.SkyScanner
{
    public class FlightOption
    {
        public DateTime departure { get; set; }
        public DateTime arrive { get; set; }
        public int duration { get; set; }
        public List<Flight> flights { get; set; }
    }
}