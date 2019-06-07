using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using FlightsFinder.Controllers.SkyScanner;
using Newtonsoft.Json;

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
        private static bool isGoodTrip(Trip trip)
        {
            return trip.inbound.flights.Count <= 4 && trip.outbound.flights.Count <= 4;
        }
        [HttpPost("[action]")]
        [Route("flights")]
        public ActionResult GetFlights(DateTime outboundDate, DateTime inboundDate, string originPlace,
         string destinationPlace, int people)
        {
            if (inboundDate == null)
            {
                outboundDate = DateTime.Now.AddDays(5);
                inboundDate = outboundDate.AddDays(5);
            }
            if (outboundDate.Date.Equals(DateTime.Now.Date))
            {
                outboundDate = outboundDate.AddHours(1);
            }
            if (inboundDate.Date.Equals(DateTime.Now.Date))
            {
                inboundDate = inboundDate.AddDays(1);
            }
            Place OriginPlaceObject = JsonConvert.DeserializeObject<Place>(originPlace);
            Place destinationPlaceObject = JsonConvert.DeserializeObject<Place>(destinationPlace);
            if (OriginPlaceObject == null)
            {
                OriginPlaceObject = defaultOrigin;
            }
            if (destinationPlaceObject == null)
            {
                List<Trip> trips = new List<Trip>();
                foreach (var dest in defaultDestination)
                {
                    trips.AddRange(api.getFlights(outboundDate, inboundDate, OriginPlaceObject, dest, "Economy", DEFAULT_COUNTRY, people, 0, 0, SkyScannerApi.Currencies.Dollar).Result.Where(isGoodTrip));
                }
                return Json(trips);
            }
            try
            {
                return Json(api.getFlights(outboundDate, inboundDate, OriginPlaceObject, destinationPlaceObject,
                 "Economy", DEFAULT_COUNTRY, people, 0, 0, SkyScannerApi.Currencies.Dollar).Result.Where(isGoodTrip));
            }
            catch (AggregateException e)
            {
                Response.StatusCode = 500;
                return Content(e.InnerException.ToString());
            }
        }
    }
}
