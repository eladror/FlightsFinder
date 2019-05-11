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
        public SkyScannerController() : base()
        {
            api = new SkyScannerApi(SKY_SCANNER_KEY);
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
            return api.getFlights(outboundDate, inboundDate, originPlace, destinationPlace, "Economy", DEFAULT_COUNTRY, people, 0, 0, SkyScannerApi.Currencies.Dollar).Result;
        }
    }
}
