using Newtonsoft.Json;

namespace FlightsFinder.Controllers.SkyScanner
{
    public class Place
    {
        public static Place CreatePlace(ApiFlightPlace place)
        {
            Place p = new Place();
            p.placeId = place.Code;
            p.placeName = place.Name;
            return p;
        }
        public string placeId { get; set; }
        public string placeName { get; set; }
        public string cityId { get; set; }
        public string countryName { get; set; }
        public string airportId
        {
            get
            {
                return placeId.Split("-")[0];
            }
        }
        public override string ToString()
        {
            return this.placeId;
        }
        public override bool Equals(object obj)
        {
            Place p = (Place)obj;
            if (obj is Place)
            {
                return placeId == null ? p.placeId == null : placeId.Equals(p.placeId) &&
                placeName == null ? p.placeName == null : placeName.Equals(p.placeName) &&
                cityId == null ? p.cityId == null : cityId.Equals(p.cityId) &&
                countryName == null ? p.countryName == null : countryName.Equals(p.countryName);
            }
            return false;
        }
        public override int GetHashCode()
        {
            int hash = 13;
            hash = (hash * 7) + (placeId == null ? 0 : placeId.GetHashCode());
            hash = (hash * 7) + (placeName == null ? 0 : placeName.GetHashCode());
            hash = (hash * 7) + (cityId == null ? 0 : cityId.GetHashCode());
            hash = (hash * 7) + (countryName == null ? 0 : countryName.GetHashCode());
            return hash;
        }
    }
    public class ApiPlace
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