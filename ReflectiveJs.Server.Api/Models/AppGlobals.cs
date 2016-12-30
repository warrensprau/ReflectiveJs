using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ReflectiveJs.Server.Api.Providers;

namespace ReflectiveJs.Server.Api.Models
{
    public static class AppGlobals
    {
        public static ShardManager ShardManager { get; set; }
    }
}