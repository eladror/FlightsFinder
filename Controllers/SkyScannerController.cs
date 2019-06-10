using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
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
        private static readonly int CACHE_TIME = 5 * 60;
        private Place defaultOrigin;
        private Place[] defaultDestination;
        private Random rand;
        private TimedDictionary<string, List<Place>> placesCache;
        private TimedDictionary<GetFlightsArgs, List<Trip>> tripsCache;
        public SkyScannerController() : base()
        {
            placesCache = new TimedDictionary<string, List<Place>>(CACHE_TIME);
            tripsCache = new TimedDictionary<GetFlightsArgs, List<Trip>>(CACHE_TIME);
            rand = new Random();
            api = new SkyScannerApi(SKY_SCANNER_KEY);
            defaultOrigin = GetPlaces("Ben Gurion Intl").First();
            string[] airPorts = new string[] { "Paris Charles de Gaulle", "Madrid–Barajas", "Athens International", "Frankfurt am Main", "Milan Malpensa", "Concord Regional" };
            defaultDestination = airPorts.Select(airPort => GetPlaces(airPort).First()).ToArray();
        }
        [HttpGet("[action]")]
        [Route("places/{query}")]
        public List<Place> GetPlaces(string query)
        {
            if (query == null || query.Length < 2)
            {
                return new List<Place>();
            }
            else
            {
                List<Place> place;
                bool isInCache = placesCache.TryGetValue(query, out place);
                if (!isInCache)
                {
                    place = api.GetPlaces(DEFAULT_COUNTRY, query, SkyScannerApi.Currencies.Dollar).Result;
                    placesCache.Add(query, place);
                }
                return place;
            }
        }
        private static bool isGoodTrip(Trip trip)
        {
            return trip.outbound.flights.Count <= 4 && (trip.inbound == null || trip.inbound.flights.Count <= 4);
        }
        private class GetFlightsArgs
        {
            DateTime outboundDate;
            DateTime inboundDate;
            Place originPlace;
            Place destinationPlace;
            int people;
            public GetFlightsArgs(DateTime outboundDate, DateTime inboundDate, Place originPlace, Place destinationPlace, int people)
            {
                this.outboundDate = outboundDate;
                this.inboundDate = inboundDate;
                this.originPlace = originPlace;
                this.destinationPlace = destinationPlace;
                this.people = people;
            }
            public override bool Equals(object obj)
            {
                if (!(obj is GetFlightsArgs))
                {
                    return false;
                }
                GetFlightsArgs y = (GetFlightsArgs)obj;
                return outboundDate.Equals(y.outboundDate) && (inboundDate == null ? y.inboundDate == null : inboundDate.Equals(y.inboundDate)) && originPlace.Equals(y.originPlace) &&
                destinationPlace.Equals(y.destinationPlace) && people == y.people;
            }
            public override int GetHashCode()
            {
                int hash = 13;
                hash = (hash * 7) + outboundDate.GetHashCode();
                hash = (hash * 7) + (inboundDate == null ? 0 : inboundDate.GetHashCode());
                hash = (hash * 7) + originPlace.GetHashCode();
                hash = (hash * 7) + destinationPlace.GetHashCode();
                hash = (hash * 7) + people.GetHashCode();
                return hash;
            }
            public List<Trip> Do(SkyScannerApi api, TimedDictionary<GetFlightsArgs, List<Trip>> cache)
            {
                List<Trip> trips;
                bool isInCache = cache.TryGetValue(this, out trips);
                if (!isInCache)
                {
                    trips = api.getFlights(outboundDate, inboundDate, originPlace, destinationPlace, "Economy", DEFAULT_COUNTRY, people, 0, 0, SkyScannerApi.Currencies.Dollar).Result;
                    cache.Add(this, trips);
                }
                return trips;
            }
        }
        [HttpPost("[action]")]
        [Route("flights")]
        public ActionResult GetFlights(DateTime outboundDate, DateTime inboundDate, string originPlace,
         string destinationPlace, int people, bool oneWay)
        {
            if (outboundDate == null)
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
            else if (inboundDate == DateTime.MinValue)
            {
                inboundDate = outboundDate.AddDays(1);
            }
            if (oneWay)
            {
                inboundDate = SkyScannerApi.NONE_TIME;
            }
            Place OriginPlaceObject = JsonConvert.DeserializeObject<Place>(originPlace);
            Place destinationPlaceObject = JsonConvert.DeserializeObject<Place>(destinationPlace);
            if (OriginPlaceObject == null)
            {
                OriginPlaceObject = defaultOrigin;
            }
            bool retry = true;
            while (true)
            {
                try
                {
                    if (destinationPlaceObject == null)
                    {
                        List<Trip> trips = new List<Trip>();
                        foreach (var dest in defaultDestination)
                        {
                            trips.AddRange(new GetFlightsArgs(outboundDate, inboundDate, OriginPlaceObject, dest, people).Do(api, tripsCache).Where(isGoodTrip));
                        }
                        return Json(trips);
                    }
                    else
                    {
                        return Json(new GetFlightsArgs(outboundDate, inboundDate, OriginPlaceObject, destinationPlaceObject, people).Do(api, tripsCache).Where(isGoodTrip));
                    }
                }
                catch (AggregateException e)
                {
                    if (!retry)
                    {
                        Response.StatusCode = 500;
                        return Content(e.InnerException.ToString());
                    }
                }
                catch (Exception e)
                {
                    if (!retry)
                    {
                        Response.StatusCode = 500;
                        return Content(e.ToString());
                    }
                }
                retry = false;
            }
        }
    }
}
