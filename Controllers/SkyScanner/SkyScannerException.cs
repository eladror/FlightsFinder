using System;
using System.Net.Http;

namespace FlightsFinder.Controllers.SkyScanner
{
    public enum DateType
    {
        outbound,
        inbound
    }
    public class DateInPastException : Exception
    {
        public DateType type { get; private set; }
        public DateInPastException(DateType type) => this.type = type;
    }
    public class OutboundDateAfterInboundDateException : Exception
    {
        public DateTime outbound { get; private set; }
        public DateTime inbound { get; private set; }
        public OutboundDateAfterInboundDateException(DateTime outbound, DateTime inbound)
        {
            this.outbound = outbound;
            this.inbound = inbound;
        }
    }
    public class SkyScannerServerError : Exception
    {
        public HttpResponseMessage responseMessage { get; private set; }
        public SkyScannerServerError(HttpResponseMessage responseMessage) => this.responseMessage = responseMessage;
    }
}