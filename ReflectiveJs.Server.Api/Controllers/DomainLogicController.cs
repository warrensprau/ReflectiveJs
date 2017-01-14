using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using Breeze.ContextProvider;
using Breeze.WebApi2;
using Newtonsoft.Json.Linq;

namespace ReflectiveJs.Server.Api.Controllers
{
    [BreezeController]
    public class DomainLogicController : NTierController
    {
        [Route("addaccountcommentsavechanges")]
        [HttpPost]
        public SaveResult AddAccountCommentSaveChanges(JObject saveBundle)
        {
            var logicDelegate = new AddAccountCommentAction(Caller);
            ContextProvider.BeforeSaveEntitiesDelegate = logicDelegate.AddAccountCommentSaveChanges;
            return ContextProvider.SaveChanges(saveBundle);
        }
    }
}