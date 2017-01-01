using ReflectiveJs.Server.Logic.Common.Persistence;

namespace ReflectiveJs.Server.Api.App_Data
{
    public class TenantModelInitializer : System.Data.Entity.CreateDatabaseIfNotExists<ApplicationDbContext>
    {
        private readonly IDbSeeder _dbSeeder;

        public TenantModelInitializer(IDbSeeder dbSeeder)
        {
            _dbSeeder = dbSeeder;
        }

        protected override void Seed(ApplicationDbContext dbContext)
        {
            base.Seed(dbContext);
            _dbSeeder.Seed(dbContext, null);
        }
    }

}