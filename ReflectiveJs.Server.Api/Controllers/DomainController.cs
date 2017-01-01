using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using Breeze.WebApi2;
using ReflectiveJs.Server.Model.Organizational;

namespace ReflectiveJs.Server.Api.Controllers
{
    [BreezeController]
    public class DomainController : NTierController
    {
        [Route("Orgs")]
        [HttpGet]
        public IQueryable<Org> Orgs()
        {
            return ContextProvider.Context.Orgs;
        }

        [Route("Members")]
        [HttpGet]
        public IQueryable<Member> Members()
        {
            return ContextProvider.Context.Members;
        }
    }
}