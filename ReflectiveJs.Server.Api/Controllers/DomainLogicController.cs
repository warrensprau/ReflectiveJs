using System.Web.Http;
using Breeze.ContextProvider;
using Breeze.WebApi2;
using Newtonsoft.Json.Linq;
using ReflectiveJs.Server.Api.Actions;

namespace ReflectiveJs.Server.Api.Controllers
{
    [BreezeController]
    public class DomainLogicController : NTierController
    {
        [Route("membercancel")]
        [HttpPost]
        public SaveResult MemberCancelSaveChanges(JObject saveBundle)
        {
            var logicDelegate = new CancelMemberAction(Caller);
            ContextProvider.BeforeSaveEntitiesDelegate = logicDelegate.CancelMemberSaveChanges;
            return ContextProvider.SaveChanges(saveBundle);
        }
    }
}