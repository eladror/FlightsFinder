using Newtonsoft.Json;

namespace FlightsFinder.Controllers.SkyScanner
{
    public class Place
    {
        public string placeId { get; set; }
        public string placeName { get; set; }
        public string countryId { get; set; }
        public string cityId { get; set; }
        public string countryName { get; set; }
        public override string ToString()
        {
            return this.placeId;
        }
    }
    class ApiPlace
    {
        [JsonProperty("PlaceId")]
        public long PlaceId { get; set; }

        [JsonProperty("IataCode")]
        public string IataCode { get; set; }

        [JsonProperty("Name")]
        public string Name { get; set; }

        [JsonProperty("Type")]
        public string Type { get; set; }

        [JsonProperty("SkyscannerCode")]
        public string SkyscannerCode { get; set; }

        [JsonProperty("CityName")]
        public string CityName { get; set; }

        [JsonProperty("CityId")]
        public string CityId { get; set; }

        [JsonProperty("CountryName")]
        public string CountryName { get; set; }
    }
}