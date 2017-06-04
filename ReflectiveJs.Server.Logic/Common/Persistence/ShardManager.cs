using System.Data;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using System.Text.RegularExpressions;
using Microsoft.Azure.SqlDatabase.ElasticScale.Query;
using Microsoft.Azure.SqlDatabase.ElasticScale.ShardManagement;

namespace ReflectiveJs.Server.Logic.Common.Persistence
{
    public class ShardManager
    {
        // Bootstrap Elastic Scale by creating a new shard map manager and a shard map on  
        // the shard map manager database if necessary. 
        public ShardManager(string smmserver, string smmdatabase, string smmconnstr,
            IDatabaseInitializer<ApplicationDbContext> landlordShardInitializer,
            IDatabaseInitializer<ApplicationDbContext> shardInitializer)
        {
            ConnectionString = smmconnstr;
            LandlordShardInitializer = landlordShardInitializer;
            ShardInitializer = shardInitializer;

            // Connection string with administrative credentials for the root database 
            var connStrBldr = new SqlConnectionStringBuilder(smmconnstr);
            connStrBldr.DataSource = smmserver;
            connStrBldr.InitialCatalog = smmdatabase;

            // Deploy shard map manager. 
            ShardMapManager smm;
            if (
                !ShardMapManagerFactory.TryGetSqlShardMapManager(connStrBldr.ConnectionString,
                    ShardMapManagerLoadPolicy.Lazy, out smm))
            {
                ShardMapManager = ShardMapManagerFactory.CreateSqlShardMapManager(connStrBldr.ConnectionString);
            }
            else
            {
                ShardMapManager = smm;
            }

            ListShardMap<int> sm;
            if (!ShardMapManager.TryGetListShardMap("ElasticScaleWithEF", out sm))
            {
                ShardMap = ShardMapManager.CreateListShardMap<int>("ElasticScaleWithEF");
            }
            else
            {
                ShardMap = sm;
            }
        }

        public ShardMapManager ShardMapManager { get; }

        public ListShardMap<int> ShardMap { get; }

        public string ConnectionString { get; set; }

        public IDatabaseInitializer<ApplicationDbContext> LandlordShardInitializer { get; set; }
        public IDatabaseInitializer<ApplicationDbContext> ShardInitializer { get; set; }


        // Enter a new shard - i.e. an empty database - to the shard map, allocate a first tenant to it  
        // and kick off EF intialization of the database to deploy schema 
        // public void RegisterNewShard(string server, string database, string user, string pwd, string appname, int key) 
        public void RegisterNewShard(string server, string database, string connstr, int key, bool isLandlord)
        {
            Shard shard;
            var shardLocation = new ShardLocation(server, database);

            if (!ShardMap.TryGetShard(shardLocation, out shard))
            {
                shard = ShardMap.CreateShard(shardLocation);
            }

            var connStrBldr = new SqlConnectionStringBuilder(connstr);
            connStrBldr.DataSource = server;
            connStrBldr.InitialCatalog = database;

            // Go into a DbContext to trigger migrations and schema deployment for the new shard. 
            // This requires an un-opened connection. 
            using (var db = new ApplicationDbContext(connStrBldr.ConnectionString))
            {
                if (isLandlord)
                {
                    Database.SetInitializer(LandlordShardInitializer);
                }
                else
                {
                    Database.SetInitializer(ShardInitializer);
                }

                // Run a query to engage EF migrations 
                (from b in db.Members
                    select b).Count();
            }

            // Register the mapping of the tenant to the shard in the shard map. 
            // After this step, DDR on the shard map can be used 
            PointMapping<int> mapping;
            if (!ShardMap.TryGetMappingForKey(key, out mapping))
            {
                ShardMap.CreatePointMapping(key, shard);
            }
        }


        public string[] GetTenantIds(string userName)
        {
            var clientIdsString = "";

            using (var conn = new MultiShardConnection(ShardMap.GetShards(), ConnectionString))
            {
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = "SELECT UserName FROM AspNetUsers where UserName = '" + userName + "'";
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
                            var shardName = sdr.GetString(1);
                            clientIdsString += clientIdRegex.Match(shardName).Result("${clientid}");
                        }
                    }
                }
            }

            return clientIdsString.Split(',');
        }

    }
}