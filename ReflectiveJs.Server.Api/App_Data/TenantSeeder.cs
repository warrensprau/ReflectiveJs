using System.Collections.Generic;
using System.Collections.ObjectModel;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using ReflectiveJs.Server.Api.App_Data.UI;
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

            var rootOrg = new Org
            {
                Name = "Client"
            };

            dbContext.Orgs.Add(rootOrg);

            roleMgr.Create(new IdentityRole("admin"));
            roleMgr.Create(new IdentityRole("mgmt"));
            roleMgr.Create(new IdentityRole("ops"));

            dbContext.SaveChanges();

            var rootUser = CreateUser("admin@client1.com", "Admin123!", new Collection<string> {"admin"}, userMgr, rootOrg, dbContext);

            dbContext.SaveChanges();

            var adminMember = new Member
            {
                OwningOrg = rootOrg,
                User = rootUser,
                OrgMembers = new List<OrgMember>()
                {
                    new OrgMember()
                    {
                        OwningOrg = rootOrg,
                        Org = rootOrg
                    }
                },
                Profile = new Profile()
                {
                    OwningOrg = rootOrg
                }
            };

            dbContext.Members.Add(adminMember);

            dbContext.SaveChanges();

            // Common

            new ConstantAutoSeeder().Seed(dbContext, rootUser);

            new UiSeeder().Seed(dbContext, rootUser);
        }

        protected User CreateUser(
            string name, string password, ICollection<string> roleNames, ApplicationUserManager userMgr, Org owner,
            ApplicationDbContext dbContext)
        {
            var user = userMgr.FindByName(name);
            if (user != null) return user;

            user = new User {UserName = name, Email = name, OwningOrg = owner};
            //var identityResult = UserMgr.Create(user, password);
            userMgr.Create(user, password);
            foreach (var roleName in roleNames)
            {
                userMgr.AddToRole(user.Id, roleName);
            }

            userMgr.SetLockoutEnabled(user.Id, false);

            return user;
        }
    }
}