using System;
using System.Data.Entity;
using System.Linq;
using System.Net.Http;
using System.Resources;
using System.Threading.Tasks;
using System.Web.Http;
using EntityFramework.DynamicFilters;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using ReflectiveJs.Server.Logic.Common.Execution;
using ReflectiveJs.Server.Logic.Common.Persistence;
using ReflectiveJs.Server.Utility;

namespace ReflectiveJs.Server.Api.Controllers
{
    public class ResourceController : ApiController
    {
        private static readonly ResourceManager ResourceManager = new ResourceManager(typeof(CommonText));
        private ICaller _caller;

        private ApplicationDbContext _dbContext;

        private ApplicationUserManager _userManager;

        protected ICaller Caller
        {
            get
            {
                if (_caller == null)
                {
                    var userName = User.Identity.GetUserName();
                    if (userName == null)
                    {
                        userName = "admin@client1.com";
                    }
                    var appUser = UserManager.FindByName(userName);

                    var associate = DbContext.Members.SingleOrDefault(m => m.User.UserName == appUser.Email);
                    var associateTimeZone = TimeZoneInfo.Local;

                    var associateProfile = associate?.Profile;

                    if (!string.IsNullOrEmpty(associateProfile?.DefaultTimeZone))
                    {
                        try
                        {
                            associateTimeZone = TimeZoneInfo.FindSystemTimeZoneById(associateProfile.DefaultTimeZone);
                        }
                        catch (Exception e)
                        {
                        }
                    }

                    _caller = new Caller(appUser, associate, associateTimeZone);
                }

                return _caller;
            }
        }

        protected async Task<ICaller> CallerAsync()
        {
            if (_caller == null)
            {
                var userName = User.Identity.GetUserName();
                if (userName == null)
                {
                    userName = "admin@client1.com";
                }
                var appUser = await UserManager.FindByNameAsync(userName);

                var associate = await DbContext.Members.SingleOrDefaultAsync(m => m.User.UserName == appUser.Email);
                var associateTimeZone = TimeZoneInfo.Local;

                var associateProfile = associate?.Profile;

                if (!string.IsNullOrEmpty(associateProfile?.DefaultTimeZone))
                {
                    try
                    {
                        associateTimeZone = TimeZoneInfo.FindSystemTimeZoneById(associateProfile.DefaultTimeZone);
                    }
                    catch (Exception e)
                    {
                    }
                }

                _caller = new Caller(appUser, associate, associateTimeZone);
            }

            return _caller;
        }

        protected ApplicationDbContext DbContext
        {
            get
            {
                if (_dbContext != null)
                {
                    return _dbContext;
                }

                var requestDbContext = Request.GetOwinContext().Get<ApplicationDbContext>();

                var userName = User.Identity.GetUserName();
                if (userName == null)
                {
                    userName = "admin@client1.com";
                }
                var appUser = UserManager.FindByName(userName);
                
                requestDbContext.CurrentUserId = appUser.Id;
                var visibleOrgs = ModelVisibilityManager.VisibleOrgs(appUser.Id, requestDbContext);
                requestDbContext.EnableFilter("IsVisible");
                requestDbContext.SetFilterScopedParameterValue("IsVisible", "visibleOrgsList", visibleOrgs);

                return _dbContext = requestDbContext;
            }
            private set { _dbContext = value; }
        }

        protected ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? (_userManager = Request.GetOwinContext().GetUserManager<ApplicationUserManager>());
            }
            private set { _userManager = value; }
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                DbContext.Dispose();
                _userManager?.Dispose();
            }

            base.Dispose(disposing);
        }
    }
}