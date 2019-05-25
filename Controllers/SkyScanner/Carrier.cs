using Newtonsoft.Json;

namespace FlightsFinder.Controllers.SkyScanner
{
    public class Carrier
    {
        public Carrier(ApiCarrier api)
        {
            CarrierId = api.Id;
            Name = api.Name;
        }
        [JsonProperty("CarrierId")]
        public long CarrierId { get; set; }

        [JsonProperty("Name")]
        public string Name { get; set; }
    }
}