using System;
using System.Collections.Generic;
using System.Linq;
using Breeze.ContextProvider;
using ReflectiveJs.Server.Logic.Common.Execution;
using ReflectiveJs.Server.Utility;
using ReflectiveJs.Server.Utility.Common;

namespace ReflectiveJs.Server.Api.Actions
{
    public abstract class BaseBreezeAction
    {
        protected ICaller Caller;

        protected BaseBreezeAction(ICaller caller)
        {
            Caller = caller;
        }

        protected void HandleServerErrors(List<Error> errors)
        {
            var entityErrors =
                errors.Select(error => new EntityError {ErrorMessage = ResourceHelper.ErrorMessage(error)}).ToList();

            throw new EntityErrorsException(entityErrors);
        }

        protected void HandleServerException(Exception e)
        {
            var entityErrors = new List<EntityError>();

            entityErrors.Add(
                new EntityError
                {
                    ErrorMessage = ResourceHelper.Message("Error_Fatal: " + e.Message, typeof(CommonText))
                });

            throw new EntityErrorsException(entityErrors);
        }
    }
}