using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using ReflectiveJs.Server.Logic.Common.Persistence;
using ReflectiveJs.Server.Model.Common;
using ReflectiveJs.Server.Model.Organizational;
using ReflectiveJs.Server.Model.UI;

namespace ReflectiveJs.Server.Api.App_Data.UI
{
    public class ActionSeeder : IDbSeeder
    {
        public virtual void Seed(ApplicationDbContext dbContext, User user)
        {
            var editAction =
                new UiAction
                {
                    IsStandard = true,
                    Name = "Edit",
                    Command = "Edit",
                    IsActive = true
                };

            var deleteAction =
                new UiAction
                {
                    IsStandard = true,
                    Name = "Delete",
                    Command = "Delete",
                    IsActive = true
                };

            var saveAction =
                new UiAction
                {
                    IsStandard = true,
                    Name = "Save",
                    Command = "SaveChanges",
                    IsActive = true
                };

            var saveAndCloseAction =
                new UiAction
                {
                    IsStandard = true,
                    Name = "SaveAndClose",
                    Command = "SaveChangesAndClose",
                    IsActive = true
                };

            var cancelAction =
                new UiAction
                {
                    IsStandard = true,
                    Name = "Cancel",
                    Command = "CancelChanges",
                    IsActive = true
                };

            var saveActionLabel = "Save"; //ResourceMessageHelper.Message("ActionName_Save");
            var saveAndCloseActionLabel = "Save And Close";
            var cancelActionLabel = "Cancel";
            var editActionLabel = "Edit";
            var deleteActionLabel = "Delete";

            foreach (var uiModel in dbContext.UiModels)
            {
                foreach (var uiView in uiModel.Views.Where(v => v.IsDefault))
                {
                    if (uiView.UiViewModeId == UiViewMode.Create || uiView.UiViewModeId == UiViewMode.Update)
                    {
                        uiView.UiViewActions.Add(new UiViewAction() {UiAction = saveAction, Label = saveActionLabel});
                        uiView.UiViewActions.Add(new UiViewAction()
                        {
                            UiAction = saveAndCloseAction,
                            Label = saveAndCloseActionLabel
                        });
                        uiView.UiViewActions.Add(new UiViewAction() {UiAction = cancelAction, Label = cancelActionLabel});
                    }

                    if (uiView.UiViewModeId == UiViewMode.Read)
                    {
                        uiView.UiViewActions.Add(new UiViewAction() {UiAction = editAction, Label = editActionLabel});
                        uiView.UiViewActions.Add(new UiViewAction() {UiAction = deleteAction, Label = deleteActionLabel});
                    }
                }
            }
        }
    }
}