using System.Collections.Generic;

namespace ReflectiveJs.Server.Logic.Common.Persistence
{
    internal static class ModelVisibilityManager
    {
        public static int[] VisibleOrgs(string userId, ApplicationDbContext dbContext)
        {
            var visibleOrgs = new List<int>();
            var user = dbContext.Users.Find(userId);
            var org = dbContext.Orgs.Find(user.OwnerId);
            visibleOrgs.Add(org.Id);

            return visibleOrgs.ToArray();
        }
    }
}