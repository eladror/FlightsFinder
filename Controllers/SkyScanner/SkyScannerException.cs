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
        public override string ToString()
        {
            return string.Format("The {0} date is in the past.", type);
        }
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
        public override string ToString()
        {
            return string.Format("The {0} date is later then the {1} date.", DateType.outbound, DateType.inbound);
        }
    }
    public class SkyScannerServerError : Exception
    {
        public HttpResponseMessage responseMessage { get; private set; }
        public SkyScannerServerError(HttpResponseMessage responseMessage) => this.responseMessage = responseMessage;
        public override string Message { get { return responseMessage.Content.ReadAsStringAsync().Result; } }
        public override string ToString()
        {
            return Message;
        }
    }
}