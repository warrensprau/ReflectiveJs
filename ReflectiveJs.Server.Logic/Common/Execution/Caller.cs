using System;
using ReflectiveJs.Server.Model.Common;
using ReflectiveJs.Server.Model.Organizational;

namespace ReflectiveJs.Server.Logic.Common.Execution
{
    public class Caller : ICaller
    {
        private readonly TimeZoneInfo _defaultTimeZone;
        private readonly Member _member;
        private readonly User _user;

        public Caller(User user, Member member, TimeZoneInfo timeZoneInfo)
        {
            _user = user;
            _member = member;
            _defaultTimeZone = timeZoneInfo;
        }

        public string UserId()
        {
            return _user.Id;
        }

        public int? MemberId()
        {
            return _member?.Id;
        }

        public TimeZoneInfo DefaultTimeZone()
        {
            return _defaultTimeZone;
        }
    }
}