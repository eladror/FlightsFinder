using Newtonsoft.Json;

namespace FlightsFinder.Controllers.SkyScanner
{
    public class Carrier
    {
        [JsonProperty("CarrierId")]
        public long CarrierId { get; set; }

        [JsonProperty("Name")]
        public string Name { get; set; }
    }
}