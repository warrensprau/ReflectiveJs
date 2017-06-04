using System;
using System.Data.SqlClient;
using System.Web;
using System.Web.Http;
using ReflectiveJs.Server.Api.App_Data;
using ReflectiveJs.Server.Api.Models;
using ReflectiveJs.Server.Logic.Common.Persistence;

namespace ReflectiveJs.Server.Api
{
    public class WebApiApplication : HttpApplication
    {
        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);

            InitializeSharding();
        }

        public void InitializeSharding()
        {
            var connStrBldr = new SqlConnectionStringBuilder
            {
                UserID = "landlord",
                Password = "Landl0rd.",
                ApplicationName = "reflective"
            };

            // Bootstrap the shard map manager, register shards, and store mappings of tenants to shards 
            // Note that you can keep working with existing shard maps. There is no need to  
            // re-create and populate the shard map from scratch every time. 
            Console.WriteLine("Checking for existing shard map and creating new shard map if necessary.");

            var shardMgr = new ShardManager(
                "tcp:reflective.database.windows.net,1433",
                "reflective_shardmanager",
                connStrBldr.ConnectionString,
                new LandlordModelInitializer(new LandlordSeeder()),
                new TenantModelInitializer(new TenantSeeder()));

            shardMgr.RegisterNewShard(
                "tcp:reflective.database.windows.net,1433",
                "reflective_landlord",
                connStrBldr.ConnectionString, 0, true);

            shardMgr.RegisterNewShard(
                "tcp:reflective.database.windows.net,1433",
                "reflective_client1",
                connStrBldr.ConnectionString, 1, false);

            AppGlobals.ShardManager = shardMgr;
        }
    }
}