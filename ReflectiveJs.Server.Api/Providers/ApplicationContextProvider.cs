using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Breeze.ContextProvider.EF6;
using ReflectiveJs.Server.Logic.Common.Persistence;

namespace ReflectiveJs.Server.Api.Providers
{
    public class ApplicationContextProvider : EFContextProvider<ApplicationDbContext>, IDisposable
    {
        public void Dispose()
        {
            this.Context.Dispose();
        }
    }
}