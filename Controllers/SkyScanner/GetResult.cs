using Newtonsoft.Json;

namespace FlightsFinder.Controllers.SkyScanner
{
    class GetResult
    {
        [JsonProperty("Quotes")]
        public ApiQuote[] Quotes { get; set; }

        [JsonProperty("Places")]
        public ApiPlace[] Places { get; set; }

        [JsonProperty("Carriers")]
        public Carrier[] Carriers { get; set; }
    }
}