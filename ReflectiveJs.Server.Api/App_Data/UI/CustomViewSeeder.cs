using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Web;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using ReflectiveJs.Server.Logic.Common.Persistence;
using ReflectiveJs.Server.Model.Common;
using ReflectiveJs.Server.Model.Organizational;

namespace ReflectiveJs.Server.Api.App_Data
{
    public class UiSeeder : IDbSeeder
    {
        public virtual void Seed(ApplicationDbContext dbContext, User user)
        {
            new ModelAndDefaultViewSeeder().Seed(dbContext, user);
            new ActionSeeder().Seed(dbContext, user);
            new CustomViewSeeder().Seed(dbContext, user);

            dbContext.SaveChanges();
        }
    }
}