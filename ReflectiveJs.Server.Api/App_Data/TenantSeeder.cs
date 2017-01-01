using ReflectiveJs.Server.Logic.Common.Persistence;
using ReflectiveJs.Server.Model.Common;
using ReflectiveJs.Server.Model.Organizational;

namespace ReflectiveJs.Server.Api.App_Data
{
    public class TenantSeeder : IDbSeeder
    {
        public void Seed(ApplicationDbContext dbContext, User user)
        {
            var rootOrg = new Org()
            {
                Name = "Client"
            };

            dbContext.Orgs.Add(rootOrg);
            dbContext.SaveChanges();
        }
    }
}