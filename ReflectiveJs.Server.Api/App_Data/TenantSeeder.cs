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
    public class TenantSeeder : IDbSeeder
    {
        public void Seed(ApplicationDbContext dbContext, User user)
        {
            var roleMgr = new ApplicationRoleManager(new RoleStore<IdentityRole>(dbContext));
            var userMgr = new ApplicationUserManager(new UserStore<User>(dbContext));

            var rootOrg = new Org()
            {
                Name = "Client"
            };

            dbContext.Orgs.Add(rootOrg);

            roleMgr.Create(new IdentityRole("admin"));
            roleMgr.Create(new IdentityRole("mgmt"));
            roleMgr.Create(new IdentityRole("ops"));

            CreateUser("admin@client1.com", "Admin123!", new Collection<string> { "admin" }, userMgr, dbContext);

            dbContext.SaveChanges();
        }

        protected User CreateUser(
            string name, string password, ICollection<string> roleNames, ApplicationUserManager userMgr, ApplicationDbContext dbContext)
        {
            var user = userMgr.FindByName(name);
            if (user != null) return user;

            user = new User { UserName = name, Email = name };
            //var identityResult = UserMgr.Create(user, password);
            userMgr.Create(user, password);
            foreach (var roleName in roleNames)
            {
                userMgr.AddToRole(user.Id, roleName);
            }

            userMgr.SetLockoutEnabled(user.Id, false);

            dbContext.SaveChanges();
            return user;
        }
    }
}