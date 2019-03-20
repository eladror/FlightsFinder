using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using Newtonsoft.Json;
using System.Linq;
using Newtonsoft.Json.Linq;

namespace FlightsFinder.Controllers.SkyScanner
{
    public class SkyScannerApi
    {
        public enum FlightClass
        {
            business
        }
        public enum Currencies
        {
            NIS,
            Dollar
        }
        public enum ErrorLevel
        {
            None,
            Low,
            High,
            SoylentGreen
        }
        public static readonly DateTime ANY_TIME = DateTime.MinValue;
        private const string englishLocale = "en-US";
        private const string RequestUri = "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/";
        private const string dateFormat = "yyyy-MM-dd";
        private readonly HttpClient client = new HttpClient();
        public SkyScannerApi(string apiKey)
        {
            client.DefaultRequestHeaders.Add("X-RapidAPI-Key", apiKey);
        }
        private static void validateDates(DateTime outboundDate, DateTime inboundDate)
        {
            if (outboundDate < DateTime.Now)
            {
                throw new DateInPastException(DateType.outbound);
            }
            if (inboundDate != null)
            {
                if (inboundDate < DateTime.Now)
                {
                    throw new DateInPastException(DateType.inbound);
                }
                if (inboundDate < outboundDate)
                {
                    throw new OutboundDateAfterInboundDateException(outboundDate, inboundDate);
                }
            }
        }
        private static void validateResponse(HttpResponseMessage responseMessage)
        {
            if (!responseMessage.IsSuccessStatusCode)
            {
                throw new SkyScannerServerError(responseMessage);
            }
        }
        private static string readFromJsonObject(JObject jObject, string propertyName)
        {
            return jObject.GetValue(propertyName).Value<string>();
        }
        private static string removeNonJson(string json, string prefix)
        {
            return json.Replace(@"\", "").Remove(json.Length - "}".Length).Remove(0, ("\"{\"" + prefix + "\":").Length - 1);
        }
        public async Task<List<Place>> GetPlaces(string country, string query, Currencies currencies)
        {
            string placesUri = "autosuggest/v1.0/" + country + "/" + currencies.toApiString() + "/" + englishLocale + "/?query=" + HttpUtility.UrlEncode(query);
            var response = await client.GetAsync(RequestUri + placesUri);
            validateResponse(response);
            var responseString = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<List<Place>>(removeNonJson(responseString, "Places"));
        }
        private async Task<List<Quote>> flightPrices(string browseName, string country, Place originPlace, Place destinationPlace, DateTime outboundDate, DateTime inboundDate, Currencies currencies)
        {
            validateDates(outboundDate, inboundDate);
            string flightUri = browseName + "/v1.0/" + country + "/" + currencies.toApiString() + "/" + englishLocale + "/" + originPlace.placeId + "/" + destinationPlace.placeId + "/" +
                outboundDate.ToString(dateFormat);
            if (inboundDate != null)
            {
                flightUri += "?inboundpartialdate=";
                if (inboundDate.Equals(ANY_TIME))
                {
                    flightUri += "anytime";
                }
                else
                {
                    flightUri += inboundDate.ToString(dateFormat);
                }
            }
            var response = await client.GetAsync(RequestUri + flightUri);
            validateResponse(response);
            var responseString = await response.Content.ReadAsStringAsync();
            GetResult res = JsonConvert.DeserializeObject<GetResult>(responseString);
            return res.Quotes.Select(apiQuote => new Quote(apiQuote, res)).ToList();
        }
        public async Task<List<Quote>> getQuotes(string country, Place originPlace, Place destinationPlace, DateTime outboundDate, DateTime inboundDate, Currencies currencies) => await flightPrices("browsequotes", country, originPlace, destinationPlace, outboundDate, inboundDate, currencies);
        public async Task<List<Quote>> getRoutes(string country, Place originPlace, Place destinationPlace, DateTime outboundDate, DateTime inboundDate, Currencies currencies) => await flightPrices("browseroutes", country, originPlace, destinationPlace, outboundDate, inboundDate, currencies);
        public async Task<List<Quote>> getDates(string country, Place originPlace, Place destinationPlace, DateTime outboundDate, DateTime inboundDate, Currencies currencies) => await flightPrices("browsedates", country, originPlace, destinationPlace, outboundDate, inboundDate, currencies);
        public async Task<Dictionary<string, string>> getCountries()
        {
            const string countriesUri = "reference/v1.0/countries/" + englishLocale;
            var response = await client.GetAsync(RequestUri + countriesUri);
            validateResponse(response);
            var responseString = await response.Content.ReadAsStringAsync();
            Dictionary<string, string> countries = new Dictionary<string, string>();
            JArray listOfCountries = JArray.Parse(removeNonJson(responseString, "Countries"));
            foreach (JObject country in listOfCountries)
            {
                countries.Add(readFromJsonObject(country, "Name"), readFromJsonObject(country, "Code"));
            }
            return countries;
        }
        public async Task<List<Trip>> getFlights(DateTime outboundDate, DateTime inboundDate, Place originPlace, Place destinationPlace, string flightClass, string country, int adults, int children, int infants, Currencies currencies)
        {
            validateDates(outboundDate, inboundDate);
            const string flightsUri = "pricing/v1.0";
            var values = new Dictionary<string, string>
            {
                {"outboundDate", outboundDate.ToString(dateFormat)},
                {"inboundDate", inboundDate==null?"":inboundDate.ToString(dateFormat)},
                {"cabinClass", flightClass},
                {"adults", adults.ToString()},
                {"children", children.ToString()},
                {"infants", infants.ToString()},
                {"country", country},
                {"currency", currencies.toApiString()},
                {"locale", englishLocale},
                {"originPlace", originPlace.placeId},
                {"destinationPlace", destinationPlace.placeId},
                {"groupPricing", "true"},
            };
            var content = new FormUrlEncodedContent(values);
            var response = await client.PostAsync(RequestUri + flightsUri, content);
            validateResponse(response);
            var locations = response.Headers.GetValues("location").GetEnumerator();
            locations.MoveNext();
            const string getUri = "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/uk2/v1.0/";
            var sessionId = locations.Current.Substring(locations.Current.LastIndexOf('/') + 1);
            response = await client.GetAsync(getUri + sessionId);
            validateResponse(response);
            var responseString = await response.Content.ReadAsStringAsync();
            FlightResult res = JsonConvert.DeserializeObject<FlightResult>(responseString);
            var legs = res.Legs.ToDictionary(leg => leg.Id);
            var agents = res.Agents.ToDictionary(agent => agent.Id);
            var places = res.ApiFlightPlaces.ToDictionary(place => place.Id);
            var segments = res.Segments.ToDictionary(segment => segment.Id);
            var carriers = res.Carriers.ToDictionary(carrier => carrier.Id);
            return res.Itineraries.Select(itin =>
            {
                List<Agent> initAgents = itin.PricingOptions.Select(priceOption =>
                {
                    return new Agent();
                }).ToList();
                return new Trip();
            }).ToList();
            return null;
        }
    }
    internal static class CurrenciesExtensions
    {
        internal static string toApiString(this SkyScannerApi.Currencies currencies)
        {
            switch (currencies)
            {
                case SkyScannerApi.Currencies.NIS:
                    return "ILS";
                case SkyScannerApi.Currencies.Dollar:
                    return "USD";
                default:
                    return "";
            }
        }
    }
}