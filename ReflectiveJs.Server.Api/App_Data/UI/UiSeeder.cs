using ReflectiveJs.Server.Logic.Common.Persistence;
using ReflectiveJs.Server.Model.Common;

namespace ReflectiveJs.Server.Api.App_Data.UI
{
    public class UiSeeder : IDbSeeder
    {
        public virtual void Seed(ApplicationDbContext dbContext, User user)
        {
            new ModelAndDefaultViewSeeder().Seed(dbContext, user);
            new ActionSeeder().Seed(dbContext, user);
            //new CustomViewSeeder().Seed(dbContext, user);

            dbContext.SaveChanges();
        }
    }
}