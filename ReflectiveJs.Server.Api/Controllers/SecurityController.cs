using System.Data;
using System.Text.RegularExpressions;
using System.Web.Http;
using Microsoft.Azure.SqlDatabase.ElasticScale.Query;
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
            var shardMap = AppGlobals.ShardManager.ShardMap;
            var connectionString = AppGlobals.ShardManager.ConnectionString;

            var clientIdsString = "";

            using (var conn = new MultiShardConnection(shardMap.GetShards(), connectionString))
            {
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = "SELECT UserName FROM AspNetUsers";
                    cmd.CommandType = CommandType.Text;
                    cmd.ExecutionOptions = MultiShardExecutionOptions.IncludeShardNameColumn;
                    cmd.ExecutionPolicy = MultiShardExecutionPolicy.PartialResults;

                    var clientIdRegex = new Regex("client(?<clientid>\\d+)");

                    using (var sdr = cmd.ExecuteReader())
                    {
                        while (sdr.Read())
                        {
                            if (clientIdsString.Length > 0)
                            {
                                clientIdsString += ",";
                            }
                            clientIdsString += clientIdRegex.Match(sdr.GetString(1)).Result("${clientid}");
                        }
                    }
                }
            }

            return clientIdsString.Split(',');
        }
    }
}