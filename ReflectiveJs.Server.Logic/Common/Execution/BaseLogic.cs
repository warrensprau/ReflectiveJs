using System;
using System.Collections.Generic;
using System.Diagnostics;
using ReflectiveJs.Server.Utility.Common;

namespace ReflectiveJs.Server.Logic.Common.Execution
{
    public abstract class BaseLogic
    {
        public ICaller Caller { get; set; }
        public bool Valid { get; internal set; }
        public bool Successful { get; protected set; }
        public bool Retry { get; set; }
        public bool RetryLimit { get; set; }

        public ICollection<Error> Errors { get; internal set; } = new List<Error>();

        // Logging

        protected virtual void LogErrorMessage(string message)
        {
            Trace.TraceError(message);
        }

        protected virtual void LogInfoMessage(string message)
        {
            Trace.TraceInformation(message);
        }

        protected virtual void LogWarningMessage(string message)
        {
            Trace.TraceWarning(message);
        }

        // Error handling

        protected void AddNonlocalizedError(string message)
        {
            AddError(new Error(null, null, ErrorSeverity.Error, message));
        }

        protected void AddError(string template, string[] parameters = null,
            ErrorSeverity severity = ErrorSeverity.Error, string defaultText = null)
        {
            AddError(new Error(template, parameters, severity, defaultText));
        }

        protected void AddError(Error error)
        {
            if (error.Severity == ErrorSeverity.Error) Successful = false;
            LogErrorMessage(ResourceHelper.ErrorMessage(error));
            Errors.Add(error);
        }

        protected void AddErrors(ICollection<Error> errors)
        {
            foreach (var error in errors)
            {
                AddError(error);
            }
        }

        // Exception handling

        protected virtual void HandleException(Exception e)
        {
            HandleException(e, "Fatal error, see logs for details.");
        }

        protected virtual void HandleException(Exception e, string message)
        {
            var innerMostException = e;
            while (innerMostException.InnerException != null)
            {
                innerMostException = innerMostException.InnerException;
            }
            var traceMessage = "Error within " + GetType().FullName + ", message: " + innerMostException.Message +
                               " : stack trace is as follows \n" +
                               innerMostException.StackTrace;

            LogErrorMessage(traceMessage);

            AddError(message ?? "Fatal error, see logs for details.");
        }

        protected void RaiseErrorsException(ICollection<Error> errors)
        {
            AddErrors(errors);

            var errorsString = "";
            foreach (var error in Errors)
            {
                errorsString += error.ToString();
            }
            throw new Exception(errorsString);
        }
    }
}