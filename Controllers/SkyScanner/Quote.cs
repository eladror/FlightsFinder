using System;
using Newtonsoft.Json;

namespace FlightsFinder.Controllers.SkyScanner
{
    public class Quote
    {
        internal Quote(ApiQuote quote, GetResult result)
        {
            quoteId = quote.QuoteId;
            MinPrice = quote.MinPrice;
            Direct = quote.Direct;
            carrier = Array.FindAll(result.Carriers, carrier => Array.IndexOf(quote.OutboundLeg.CarrierIds, carrier.CarrierId) != -1);
            DepartureDate = quote.OutboundLeg.DepartureDate.DateTime;
        }
        public long quoteId { get; set; }
        public long MinPrice { get; set; }
        public bool Direct { get; set; }
        public Carrier[] carrier { get; set; }
        public DateTime DepartureDate { get; set; }
    }
    class ApiQuote
    {
        [JsonProperty("QuoteId")]
        public long QuoteId { get; set; }

        [JsonProperty("MinPrice")]
        public long MinPrice { get; set; }

        [JsonProperty("Direct")]
        public bool Direct { get; set; }

        [JsonProperty("OutboundLeg")]
        public OutboundLeg OutboundLeg { get; set; }

        [JsonProperty("QuoteDateTime")]
        public DateTimeOffset QuoteDateTime { get; set; }
    }
    public class OutboundLeg
    {
        [JsonProperty("CarrierIds")]
        public long[] CarrierIds { get; set; }

        [JsonProperty("OriginId")]
        public long OriginId { get; set; }

        [JsonProperty("DestinationId")]
        public long DestinationId { get; set; }

        [JsonProperty("DepartureDate")]
        public DateTimeOffset DepartureDate { get; set; }
    }
}