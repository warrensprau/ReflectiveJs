using System.Linq;
using ReflectiveJs.Server.Logic.Common.Persistence;
using ReflectiveJs.Server.Model.Common;
using ReflectiveJs.Server.Model.UI;
using ReflectiveJs.Server.Utility;
using ReflectiveJs.Server.Utility.Common;

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
                        uiView.UiViewActions.Add(new UiViewAction {UiAction = saveAction, Label = saveActionLabel});
                        uiView.UiViewActions.Add(new UiViewAction
                        {
                            UiAction = saveAndCloseAction,
                            Label = saveAndCloseActionLabel
                        });
                        uiView.UiViewActions.Add(new UiViewAction {UiAction = cancelAction, Label = cancelActionLabel});
                    }

                    if (uiView.UiViewModeId == UiViewMode.Read)
                    {
                        uiView.UiViewActions.Add(new UiViewAction {UiAction = editAction, Label = editActionLabel});
                        uiView.UiViewActions.Add(new UiViewAction {UiAction = deleteAction, Label = deleteActionLabel});

                        var modelName = uiModel.Name;
                        var modelActionTypes = typeof(OrgEntity).Assembly.GetTypes().Where(type => type.IsSubclassOf(typeof(BaseActionEntity)) && type.Name.StartsWith(modelName) && type.Name.Length > modelName.Length);

                        foreach (var modelActionType in modelActionTypes)
                        {
                            uiView.UiViewActions.Add(
                                new UiViewAction()
                                {
                                    UiAction = new UiAction()
                                    {
                                        Name = modelActionType.Name,
                                        Route = modelActionType.Name.ToLower() + "savechanges",
                                        ActionModel = modelActionType.Name
                                    },
                                    Label = ResourceHelper.Message("ActionName_MemberCancel", typeof(CommonText))
                                });
                        }
                    }
                }
            }
        }
    }
}




