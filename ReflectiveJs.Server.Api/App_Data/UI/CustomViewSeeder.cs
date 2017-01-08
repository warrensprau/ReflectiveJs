using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using ReflectiveJs.Server.Logic.Common.Persistence;
using ReflectiveJs.Server.Model.Common;
using ReflectiveJs.Server.Model.Organizational;

namespace ReflectiveJs.Server.Api.App_Data.UI
{
    public class CustomViewSeeder : IDbSeeder
    {
        public virtual void Seed(ApplicationDbContext dbContext, User user)
        {
            //var viewSeederTypes = typeof(CampaignViewSeeder).Assembly.GetTypes().Where(type => type.IsSubclassOf(typeof(BaseViewSeeder)));
            //foreach (var viewSeederType in viewSeederTypes)
            //{
            //    var viewSeeder = (IDbSeeder)Activator.CreateInstance(
            //                                null,
            //                                viewSeederType.FullName,
            //                                true,
            //                                0,
            //                                null,
            //                                new Object[] { },
            //                                null,
            //                                new Object[] { }).Unwrap();
            //    viewSeeder.Seed(dbContext, user);
            //}

            //dbContext.SaveChanges();
        }
    }
}