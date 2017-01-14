using System.Linq;
using System.Web.Http;
using Breeze.WebApi2;
using ReflectiveJs.Server.Model.Common;
using ReflectiveJs.Server.Model.Organizational;
using ReflectiveJs.Server.Utility;
using ReflectiveJs.Server.Utility.Common;

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

        [Route("EnumTypes")]
        [HttpGet]
        public IQueryable<EnumType> EnumTypes()
        {
            foreach (var enumItem in ContextProvider.Context.EnumTypes)
            {
                enumItem.Description = ResourceHelper.EnumMessage(enumItem.Name, typeof(CommonText));
            }
            return ContextProvider.Context.EnumTypes;
        }

    }
}





