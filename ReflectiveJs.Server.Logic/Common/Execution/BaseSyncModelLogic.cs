using System;
using ReflectiveJs.Server.Logic.Common.Persistence;

namespace ReflectiveJs.Server.Logic.Common.Execution
{
    public abstract class BaseSyncModelLogic : BaseLogic
    {
        public bool AutoSave { get; set; }
        public ApplicationDbContext DbContext { get; set; }

        public bool Execute()
        {
            Successful = true;

            if (!CanExecute())
            {
                Valid = false;
                Successful = false;
                return Successful;
            }
            Valid = true;

            try
            {
                BasicExecute();
                if (AutoSave)
                {
                    Save();
                }
            }
            catch (Exception e)
            {
                HandleException(e, null);
            }

            return Successful;
        }

        protected bool CanExecute()
        {
            if (Caller == null)
            {
                AddError("ErrorMessage_System", new[] {"Caller not set."});
                return false;
            }

            return BasicValidate();
        }

        protected virtual bool BasicValidate()
        {
            return true;
        }

        protected abstract void BasicExecute();

        protected void Save()
        {
            DbContext.SaveChanges();
        }
    }
}