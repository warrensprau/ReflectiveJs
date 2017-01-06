using System;
using System.Linq;
using System.Net.Http;
using System.Resources;
using System.Web.Http;
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
                    var appUser = UserManager.FindByName(userName);

                    var associate = DbContext.Members.SingleOrDefault(a => a.LoginId == appUser.Email);
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

        protected ApplicationDbContext DbContext
        {
            get { return _dbContext ?? (_dbContext = Request.GetOwinContext().Get<ApplicationDbContext>()); }
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