using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using FlightsFinder.Controllers.SkyScanner;
namespace FlightsFinder.Controllers
{
    [Route("api/[controller]")]
    public class SkyScannerController : Controller
    {
        private SkyScannerApi api { get; set; }
        private static readonly string SKY_SCANNER_KEY = "a782b8720fmsh4ac99c302e7bd93p1396a3jsn094060809649";
        private static readonly string DEFAULT_COUNTRY = "IL";
        private Place defaultOrigin;
        private Place[] defaultDestination;
        private Random rand;
        public SkyScannerController() : base()
        {
            rand = new Random();
            api = new SkyScannerApi(SKY_SCANNER_KEY);
            defaultOrigin = GetPlaces("Ben Gurion Intl").First();
            string[] airPorts = new string[] { "Paris Charles de Gaulle", "Madrid–Barajas", "Athens International", "Frankfurt am Main", "Milan Malpensa", "Concord Regional" };
            defaultDestination = airPorts.Select(airPort => GetPlaces(airPort).First()).ToArray();
        }
        [HttpGet("[action]")]
        [Route("places/{query}")]
        public IEnumerable<Place> GetPlaces(string query)
        {
            if (query == null || query.Length < 2)
            {
                return new List<Place>();
            }
            else
            {
                return api.GetPlaces(DEFAULT_COUNTRY, query, SkyScannerApi.Currencies.Dollar).Result;
            }
        }
        [HttpPost("[action]")]
        [Route("flights")]
        public IEnumerable<Trip> GetFlights(DateTime outboundDate, DateTime inboundDate, Place originPlace, Place destinationPlace, int people)
        {
            if (inboundDate == null)
            {
                inboundDate = DateTime.Now.AddDays(5);
                outboundDate = inboundDate.AddDays(5);
            }
            if (originPlace == null)
            {
                originPlace = defaultOrigin;
            }
            if (destinationPlace == null)
            {
                destinationPlace = defaultDestination[rand.Next(defaultDestination.Length)];
            }
            return api.getFlights(outboundDate, inboundDate, originPlace, destinationPlace, "Economy", DEFAULT_COUNTRY, people, 0, 0, SkyScannerApi.Currencies.Dollar).Result;
        }
    }
}
