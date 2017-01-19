using System;
using System.Collections.Generic;
using System.Data;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Azure.SqlDatabase.ElasticScale.Query;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using ReflectiveJs.Server.Api.Models;
using ReflectiveJs.Server.Api.Providers;
using ReflectiveJs.Server.Api.Results;
using ReflectiveJs.Server.Model.Common;

namespace ReflectiveJs.Server.Api.Controllers
{

    [RoutePrefix("api/Security")]
    public class SecurityController : ApiController
    {
        private const string LocalLoginProvider = "Local";
        private ApplicationUserManager _userManager;

        public SecurityController()
        {
        }

        // GET api/Account/UserInfo
        [Route("TenantId")]
        public string GetTenantId(string userName)
        {
            var tenantId = "-1";

            var shardMap = AppGlobals.ShardManager.ShardMap;
            var connectionString = AppGlobals.ShardManager.ConnectionString;

            using (MultiShardConnection conn = new MultiShardConnection(shardMap.GetShards(), connectionString))
            {
                using (MultiShardCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandText = "SELECT UserName FROM AspNetUsers";
                    cmd.CommandType = CommandType.Text;
                    cmd.ExecutionOptions = MultiShardExecutionOptions.IncludeShardNameColumn;
                    cmd.ExecutionPolicy = MultiShardExecutionPolicy.PartialResults;

                    using (MultiShardDataReader sdr = cmd.ExecuteReader())
                    {
                        while (sdr.Read())
                        {
                            var c1Field = sdr.GetString(0);
                            tenantId = sdr.GetString(1);
                        }
                    }
                }
            }

            return tenantId;
        }
    }
}