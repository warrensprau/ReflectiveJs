using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using ReflectiveJs.Server.Api.Actions;
using ReflectiveJs.Server.Logic.Common.Execution;
using ReflectiveJs.Server.Logic.Common.Persistence;
using ReflectiveJs.Server.Logic.Domain;
using ReflectiveJs.Server.Model.Organizational;

namespace ReflectiveJs.Server.Api.Actions
{
    public class CancelMemberAction : BaseBreezeAction
    {
        public Dictionary<Type, List<EntityInfo>> CancelSubscriptionSaveChanges(Dictionary<Type, List<EntityInfo>> saveMap)
        {
            var actionEntityInfos = saveMap[typeof(MemberCancel)];
            var actionEntityInfo = actionEntityInfos.SingleOrDefault();

            if (actionEntityInfo == null)
            {
                return saveMap;
            }

            var actionModel = actionEntityInfo.Entity as MemberCancel;
            var contextProvider = (EFContextProvider<ApplicationDbContext>)actionEntityInfo.ContextProvider;
            var dbContext = contextProvider.Context;

            var action = new CancelMember()
            {
                MemberId = actionModel.MemberId,
                Comment = actionModel.Comment,
                SendNotifications = actionModel.SendNotifications,
                DbContext = dbContext,
                Caller = Caller
            };

            if (!action.Execute())
            {
                HandleServerErrors(action.Errors.ToList());
            }

            return saveMap;
        }

        public CancelMemberAction(ICaller caller)
            : base(caller)
        {
        }
    }
}