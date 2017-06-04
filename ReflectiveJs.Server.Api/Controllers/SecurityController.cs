using System.Web.Http;
using ReflectiveJs.Server.Api.Models;

namespace ReflectiveJs.Server.Api.Controllers
{
    [RoutePrefix("api/Security")]
    public class SecurityController : ApiController
    {
        // GET api/Account/UserInfo
        [Route("ClientId")]
        public string[] GetTenantId(string userName)
        {
            return AppGlobals.ShardManager.GetTenantIds(userName);
        }
    }
}