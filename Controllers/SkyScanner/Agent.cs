using System;
using Newtonsoft.Json;

namespace FlightsFinder.Controllers.SkyScanner
{
    public partial class Agent
    {
        [JsonProperty("Id")]
        public long Id { get; set; }
        [JsonProperty("BookingUrl")]
        public Uri BookingUrl { get; set; }
        [JsonProperty("Name")]
        public string Name { get; set; }
        public int price { get; set; }
        [JsonProperty("ImageUrl")]
        Uri ImageUrl { get; set; }

        [JsonProperty("Status")]
        Status Status { get; set; }

        [JsonProperty("OptimisedForMobile")]
        bool OptimisedForMobile { get; set; }

        [JsonProperty("Type")]
        AgentType Type { get; set; }
    }

}