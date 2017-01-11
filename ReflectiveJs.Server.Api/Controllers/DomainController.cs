using System.Linq;
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
            var currentUserId = Caller.UserId();
            return ContextProvider.Context.SetOwnable<Member>(currentUserId);
        }

        [Route("OrgMembers")]
        [HttpGet]
        public IQueryable<OrgMember> OrgMembers()
        {
            var currentUserId = Caller.UserId();
            return ContextProvider.Context.SetOwnable<OrgMember>(currentUserId);
        }

    }
}