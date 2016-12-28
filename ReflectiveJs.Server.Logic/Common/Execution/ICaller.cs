using System;

namespace ReflectiveJs.Server.Logic.Common.Execution
{
    public interface ICaller
    {
        string UserId();
        int? MemberId();
        TimeZoneInfo DefaultTimeZone();
    }
}