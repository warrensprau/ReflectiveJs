using System;
using System.Linq;
using System.Reflection;
using ReflectiveJs.Server.Logic.Common.Persistence;
using ReflectiveJs.Server.Model.Common;

namespace ReflectiveJs.Server.Api.App_Data
{
    public class ConstantAutoSeeder : IDbSeeder
    {
        public virtual void Seed(ApplicationDbContext dbContext, User user)
        {
            var enumTypes = typeof(EnumType).Assembly.GetTypes().Where(type => type.IsSubclassOf(typeof(EnumType)));
            foreach (var enumType in enumTypes)
            {
                var props = enumType.GetFields(BindingFlags.Static | BindingFlags.Public);
                foreach (var prop in props)
                {
                    var nextEnum = (EnumType) Activator.CreateInstance(
                        typeof(EnumType).Assembly.FullName,
                        enumType.FullName,
                        true,
                        0,
                        null,
                        new object[] {},
                        null,
                        new object[] {}).Unwrap();

                    nextEnum.Name = (string) prop.GetValue(null);
                    nextEnum.EnumTypeName = enumType.Name;

                    dbContext.Set(enumType).Add(nextEnum);
                }
            }

            dbContext.SaveChanges();
        }
    }
}