using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Web.Http;
using Breeze.ContextProvider;
using Breeze.WebApi2;
using Microsoft.AspNet.Identity.Owin;
using Newtonsoft.Json.Linq;
using ReflectiveJs.Server.Api.Providers;

namespace ReflectiveJs.Server.Api.Controllers
{
    [BreezeController]
    public class NTierController : ResourceController
    {
        private ApplicationContextProvider _contextProvider;

        public NTierController()
            : base()
        {
        }

        protected ApplicationContextProvider ContextProvider
        {
            get
            {
                return _contextProvider ??
                       (_contextProvider = Request.GetOwinContext().Get<ApplicationContextProvider>());
            }
            private set { _contextProvider = value; }
        }

        [Route("metadata")]
        [HttpGet]
        public string Metadata()
        {
            return ContextProvider.Metadata(); // delegate to the ContextProvider
        }

        [Route("savechanges")]
        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            SaveResult saveResult;

            try
            {
                saveResult = ContextProvider.SaveChanges(saveBundle);
            }
            catch (Exception e)
            {
                var message = "Save failed : " + e.Message;
                throw new EntityErrorsException(message, new List<EntityError>());
            }
            return saveResult;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _contextProvider?.Dispose();
            }

            base.Dispose(disposing);
        }
    }
}