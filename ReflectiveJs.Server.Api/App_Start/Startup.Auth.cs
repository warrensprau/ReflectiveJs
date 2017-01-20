using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web.WebPages;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.Google;
using Microsoft.Owin.Security.OAuth;
using Owin;
using ReflectiveJs.Server.Api.App_Data;
using ReflectiveJs.Server.Api.Providers;
using ReflectiveJs.Server.Api.Models;
using ReflectiveJs.Server.Logic.Common.Persistence;

namespace ReflectiveJs.Server.Api
{
    public partial class Startup
    {
        public static OAuthAuthorizationServerOptions OAuthOptions { get; private set; }

        public static string PublicClientId { get; private set; }

        // For more information on configuring authentication, please visit http://go.microsoft.com/fwlink/?LinkId=301864
        public void ConfigureAuth(IAppBuilder app)
        {
            // Configure the db context and user manager to use a single instance per request
            //app.CreatePerOwinContext(ApplicationDbContext.Create);
            //app.CreatePerOwinContext<ApplicationUserManager>(ApplicationUserManager.Create);
            app.CreatePerOwinContext<ApplicationDbContext>(CreateApplicationDbContext);
            app.CreatePerOwinContext<ApplicationUserManager>(ApplicationUserManager.Create);
            app.CreatePerOwinContext<ApplicationRoleManager>(ApplicationRoleManager.Create);

            // Enable the application to use a cookie to store information for the signed in user
            // and to use a cookie to temporarily store information about a user logging in with a third party login provider
            app.UseCookieAuthentication(new CookieAuthenticationOptions());
            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            // Configure the application for OAuth based flow
            PublicClientId = "self";
            OAuthOptions = new OAuthAuthorizationServerOptions
            {
                TokenEndpointPath = new PathString("/Token"),
                Provider = new ApplicationOAuthProvider(PublicClientId),
                AuthorizeEndpointPath = new PathString("/api/Account/ExternalLogin"),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(14),
                // In production mode set AllowInsecureHttp = false
                AllowInsecureHttp = true
            };

            // Enable the application to use bearer tokens to authenticate users
            app.UseOAuthBearerTokens(OAuthOptions);

            // Uncomment the following lines to enable logging in with third party login providers
            //app.UseMicrosoftAccountAuthentication(
            //    clientId: "",
            //    clientSecret: "");

            //app.UseTwitterAuthentication(
            //    consumerKey: "",
            //    consumerSecret: "");

            //app.UseFacebookAuthentication(
            //    appId: "",
            //    appSecret: "");

            //app.UseGoogleAuthentication(new GoogleOAuth2AuthenticationOptions()
            //{
            //    ClientId = "",
            //    ClientSecret = ""
            //});

            //InitializeSharding(app);
        }

        public static void InitializeSharding(IAppBuilder app)
        {
            var connStrBldr = new SqlConnectionStringBuilder
            {
                UserID = "landlord",
                Password = "Landl0rd.",
                ApplicationName = "reflective"
            };

            // Bootstrap the shard map manager, register shards, and store mappings of tenants to shards 
            // Note that you can keep working with existing shard maps. There is no need to  
            // re-create and populate the shard map from scratch every time. 
            Console.WriteLine("Checking for existing shard map and creating new shard map if necessary.");

            var shardMgr = new ShardManager("tcp:reflective.database.windows.net,1433", "reflective_landlord", connStrBldr.ConnectionString, new TenantModelInitializer(new TenantSeeder()));
            shardMgr.RegisterNewShard("tcp:reflective.database.windows.net,1433", "reflective_client1", connStrBldr.ConnectionString, 1);
            //shardMgr.RegisterNewShard("tcp:reflective.database.windows.net,1433", "reflective_client2", connStrBldr.ConnectionString, 2);

            AppGlobals.ShardManager = shardMgr;
        }

        public static ApplicationDbContext CreateApplicationDbContext(IdentityFactoryOptions<ApplicationDbContext> options, IOwinContext context)
        {
            //Sharding sharding = new Sharding();
            //string connString = "";

            var tenantIdString = context.Request.Query.Get("tenantId");

            if (String.IsNullOrEmpty(tenantIdString))
            {
                throw new Exception("Tenant Id missing.");
            }
            return new ApplicationDbContext(AppGlobals.ShardManager.ShardMap, tenantIdString.AsInt(), AppGlobals.ShardManager.ConnectionString);
        }
    }
}
