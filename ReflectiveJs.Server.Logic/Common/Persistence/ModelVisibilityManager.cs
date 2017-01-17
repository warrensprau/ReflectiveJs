using System.Collections.Generic;

namespace ReflectiveJs.Server.Logic.Common.Persistence
{
    public static class ModelVisibilityManager
    {
        public static List<int> VisibleOrgs(string userId, ApplicationDbContext dbContext)
        {
            var visibleOrgs = new List<int>();
            var user = dbContext.Users.Find(userId);
            var org = dbContext.Orgs.Find(user.OwningOrgId);
            visibleOrgs.Add(org.Id);

            return visibleOrgs;
        }
    }
}