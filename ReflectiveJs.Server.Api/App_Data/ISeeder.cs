using ReflectiveJs.Server.Logic.Common.Persistence;
using ReflectiveJs.Server.Model.Common;

namespace ReflectiveJs.Server.Api.App_Data
{
    public interface IDbSeeder
    {
        void Seed(ApplicationDbContext dbContext, User user);
    }
}