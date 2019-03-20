using System;
using Newtonsoft.Json;

namespace FlightsFinder.Controllers.SkyScanner
{
    public partial class FlightResult
    {
        [JsonProperty("Query")]
        public Query Query { get; set; }

        [JsonProperty("Status")]
        public Status Status { get; set; }

        [JsonProperty("Itineraries")]
        public Itinerary[] Itineraries { get; set; }

        [JsonProperty("Legs")]
        public Leg[] Legs { get; set; }

        [JsonProperty("Segments")]
        public Segment[] Segments { get; set; }

        [JsonProperty("Carriers")]
        public ApiCarrier[] Carriers { get; set; }

        [JsonProperty("Agents")]
        public Agent[] Agents { get; set; }

        [JsonProperty("Places")]
        public ApiFlightPlace[] ApiFlightPlaces { get; set; }
    }
    public partial class ApiCarrier
    {
        [JsonProperty("Id")]
        public long Id { get; set; }

        [JsonProperty("Code")]
        public string Code { get; set; }

        [JsonProperty("Name")]
        public string Name { get; set; }

        [JsonProperty("ImageUrl")]
        public Uri ImageUrl { get; set; }

        [JsonProperty("DisplayCode")]
        public string DisplayCode { get; set; }
    }
    public partial class Itinerary
    {
        [JsonProperty("OutboundLegId")]
        public string OutboundLegId { get; set; }

        [JsonProperty("InboundLegId")]
        public string InboundLegId { get; set; }

        [JsonProperty("PricingOptions")]
        public PricingOption[] PricingOptions { get; set; }

        [JsonProperty("BookingDetailsLink")]
        public BookingDetailsLink BookingDetailsLink { get; set; }
    }

    public partial class BookingDetailsLink
    {
        [JsonProperty("Uri")]
        public string Uri { get; set; }

        [JsonProperty("Body")]
        public string Body { get; set; }

        [JsonProperty("Method")]
        public Method Method { get; set; }
    }

    public partial class PricingOption
    {
        [JsonProperty("Agents")]
        public long[] Agents { get; set; }

        [JsonProperty("QuoteAgeInMinutes")]
        public long QuoteAgeInMinutes { get; set; }

        [JsonProperty("Price")]
        public double Price { get; set; }

        [JsonProperty("DeeplinkUrl")]
        public Uri DeeplinkUrl { get; set; }
    }

    public partial class Leg
    {
        [JsonProperty("Id")]
        public string Id { get; set; }

        [JsonProperty("SegmentIds")]
        public long[] SegmentIds { get; set; }

        [JsonProperty("OriginStation")]
        public long OriginStation { get; set; }

        [JsonProperty("DestinationStation")]
        public long DestinationStation { get; set; }

        [JsonProperty("Departure")]
        public DateTimeOffset Departure { get; set; }

        [JsonProperty("Arrival")]
        public DateTimeOffset Arrival { get; set; }

        [JsonProperty("Duration")]
        public long Duration { get; set; }

        [JsonProperty("Stops")]
        public long[] Stops { get; set; }

        [JsonProperty("Carriers")]
        public long[] Carriers { get; set; }

        [JsonProperty("OperatingApiCarriers")]
        public long[] OperatingApiCarriers { get; set; }

        [JsonProperty("Directionality")]
        public Directionality Directionality { get; set; }

        [JsonProperty("FlightNumbers")]
        public FlightNumber[] FlightNumbers { get; set; }
    }

    public partial class FlightNumber
    {
        [JsonProperty("FlightNumber")]
        public long FlightNumberFlightNumber { get; set; }

        [JsonProperty("ApiCarrierId")]
        public long ApiCarrierId { get; set; }
    }

    public partial class ApiFlightPlace
    {
        [JsonProperty("Id")]
        public long Id { get; set; }

        [JsonProperty("ParentId", NullValueHandling = NullValueHandling.Ignore)]
        public long? ParentId { get; set; }

        [JsonProperty("Code")]
        public string Code { get; set; }

        [JsonProperty("Type")]
        public ApiFlightPlaceType Type { get; set; }

        [JsonProperty("Name")]
        public string Name { get; set; }
    }

    public partial class Query
    {
        [JsonProperty("Country")]
        public string Country { get; set; }

        [JsonProperty("Currency")]
        public string Currency { get; set; }

        [JsonProperty("Locale")]
        public string Locale { get; set; }

        [JsonProperty("Adults")]
        public long Adults { get; set; }

        [JsonProperty("Children")]
        public long Children { get; set; }

        [JsonProperty("Infants")]
        public long Infants { get; set; }

        [JsonProperty("OriginPlace")]
        public long OriginApiFlightPlace { get; set; }

        [JsonProperty("DestinationPlace")]
        public long DestinationApiFlightPlace { get; set; }

        [JsonProperty("OutboundDate")]
        public DateTimeOffset OutboundDate { get; set; }

        [JsonProperty("InboundDate")]
        public DateTimeOffset InboundDate { get; set; }

        [JsonProperty("LocationSchema")]
        public string LocationSchema { get; set; }

        [JsonProperty("CabinClass")]
        public string CabinClass { get; set; }

        [JsonProperty("GroupPricing")]
        public bool GroupPricing { get; set; }
    }

    public partial class Segment
    {
        [JsonProperty("Id")]
        public long Id { get; set; }

        [JsonProperty("OriginStation")]
        public long OriginStation { get; set; }

        [JsonProperty("DestinationStation")]
        public long DestinationStation { get; set; }

        [JsonProperty("DepartureDateTime")]
        public DateTimeOffset DepartureDateTime { get; set; }

        [JsonProperty("ArrivalDateTime")]
        public DateTimeOffset ArrivalDateTime { get; set; }

        [JsonProperty("ApiCarrier")]
        public long ApiCarrier { get; set; }

        [JsonProperty("OperatingApiCarrier")]
        public long OperatingApiCarrier { get; set; }

        [JsonProperty("Duration")]
        public long Duration { get; set; }

        [JsonProperty("FlightNumber")]
        public long FlightNumber { get; set; }

        [JsonProperty("Directionality")]
        public Directionality Directionality { get; set; }
    }
    public enum Status { UpdatesComplete };
    public enum Directionality { Inbound, Outbound };
    public enum ApiFlightPlaceType { Airport, City, Country };
    public enum Method { Put };
    public enum AgentType { Airline, TravelAgent };
}