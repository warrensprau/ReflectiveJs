using System;
using System.Data.Common;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Azure.SqlDatabase.ElasticScale.ShardManagement;
using ReflectiveJs.Server.Model.Common;
using ReflectiveJs.Server.Model.Organizational;

namespace ReflectiveJs.Server.Logic.Common.Persistence
{
    public class LandlordDbContext : DbContext
    {
        // C'tor to deploy schema and migrations to a new shard 
        public LandlordDbContext(string connectionString) 
            : base(SetInitializerForConnection(connectionString)) 
        {
        }

        // Only static methods are allowed in calls into base class c'tors 
        private static string SetInitializerForConnection(string connnectionString)
        {
            // We want existence checks so that the schema can get deployed 
            Database.SetInitializer<LandlordDbContext>(new CreateDatabaseIfNotExists<LandlordDbContext>());
            return connnectionString;
        }

        
    }
}