using System;
using System.Threading.Tasks;
using ReflectiveJs.Server.Logic.Common.Persistence;

namespace ReflectiveJs.Server.Logic.Common.Execution
{
    public abstract class BaseAsyncModelLogic : BaseLogic
    {
        protected BaseAsyncModelLogic()
        {
            AutoSave = false;
        }

        public bool AutoSave { get; set; }
        public ApplicationDbContext DbContext { get; set; }

        public async Task<bool> ExecuteAsync()
        {
            Successful = true;

            if (!await CanExecute())
            {
                Valid = false;
                Successful = false;
                return Successful;
            }
            Valid = true;

            try
            {
                await BasicExecute();
                if (AutoSave)
                {
                    await Save();
                }
            }
            catch (Exception e)
            {
                HandleException(e, null);
            }

            return Successful;
        }

        protected async Task<bool> CanExecute()
        {
            if (Caller == null)
            {
                AddError("ErrorMessage_System", new[] {"Caller not set."});
                return false;
            }

            return await BasicValidate();
        }

        protected virtual async Task<bool> BasicValidate()
        {
            return await Task.FromResult(true);
        }

        protected abstract Task BasicExecute();

        protected async Task Save()
        {
            await DbContext.SaveChangesAsync();
        }
    }
}