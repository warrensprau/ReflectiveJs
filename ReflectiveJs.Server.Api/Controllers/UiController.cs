using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using ReflectiveJs.Server.Model.UI;

namespace ReflectiveJs.Server.Api.Controllers
{
    public class UiController : ResourceController
    {
        [Route("uiview")]
        [HttpGet]
        public async Task<IHttpActionResult> UiViews()
        {
            var results = new List<UiViewModel>();

            var views = await DbContext.UiViews
                .Include(uiv => uiv.UiModel)
                .Include(uiv => uiv.UiViewFields.Select(uivf => uivf.UiField))
                .Include(uiv => uiv.UiViewActions.Select(uivf => uivf.UiAction))
                .ToListAsync();

            foreach (var view in views)
            {
                var viewModel = new UiViewModel
                {
                    ModelName = view.UiModel.Name,
                    IsCreateMode = view.UiViewModeId == UiViewMode.Create,
                    IsReadMode = view.UiViewModeId == UiViewMode.Read,
                    IsUpdateMode = view.UiViewModeId == UiViewMode.Update,
                    IsDefault = view.IsDefault,
                    Directive = view.Directive
                };

                foreach (var viewAction in view.UiViewActions)
                {
                    var actionModel = new UiActionModel
                    {
                        Name = viewAction.UiAction.Name,
                        Label = viewAction.Label,
                        Route = viewAction.UiAction.Route,
                        Command = viewAction.UiAction.Command,
                        ActionModel = viewAction.UiAction.ActionModel,
                        EntityType = viewAction.UiAction.EntityType,
                        IsCustom = viewAction.UiAction.IsCustom,
                        IsStandard = viewAction.UiAction.IsStandard
                    };
                    viewModel.Actions.Add(actionModel);
                }

                foreach (var viewField in view.UiViewFields)
                {
                    var fieldModel = new UiFieldModel
                    {
                        Name = viewField.UiField.Name,
                        Label = viewField.Label,
                        InputType = viewField.UiField.InputType,
                        IsRelationship = viewField.UiField.IsRelationship,
                        IsEnum = viewField.UiField.IsEnum,
                        EnumType = viewField.UiField.EnumType,
                        IsReadonly = viewField.IsReadOnly,
                        IsCollection = viewField.UiField.IsCollection,
                        IsExpanded = viewField.IsExpanded,
                        IsUnused = viewField.UiField.IsUnused,
                        IsHidden = viewField.IsHidden,
                        DisplayOrder = viewField.DisplayOrder,
                        CollectionDetailRoute = viewField.CollectionDetailRoute,
                        CollectionAddAction = viewField.CollectionAddAction,
                        CollectionOptionConstraint = viewField.CollectionOptionConstraint
                    };
                    viewModel.Fields.Add(fieldModel);
                }

                results.Add(viewModel);
            }
            return Ok(results);
        }
    }

    public class UiViewModel
    {
        public UiViewModel()
        {
            Fields = new List<UiFieldModel>();
            Actions = new List<UiActionModel>();
        }

        public string ModelName { get; set; }
        public bool IsCreateMode { get; set; }
        public bool IsReadMode { get; set; }
        public bool IsUpdateMode { get; set; }
        public bool IsDefault { get; set; }
        public string Directive { get; set; }

        public virtual ICollection<UiFieldModel> Fields { get; set; }
        public virtual ICollection<UiActionModel> Actions { get; set; }
    }

    public class UiActionModel
    {
        public string Name { get; set; }
        public string Label { get; set; }
        public string Route { get; set; } //the method to call when it's activated
        public string Command { get; set; }
        public string ActionModel { get; set; }
        public string EntityType { get; set; }
        public bool IsCustom { get; set; }
        public bool IsStandard { get; set; }
    }

    public class UiFieldModel
    {
        public string Name { get; set; }
        public string Label { get; set; }
        public string InputType { get; set; }
        public bool IsRelationship { get; set; }
        public bool IsEnum { get; set; }
        public string EnumType { get; set; }
        public bool IsReadonly { get; set; }
        public bool IsCollection { get; set; }
        public bool IsExpanded { get; set; }
        public bool IsHidden { get; set; }
        public bool IsUnused { get; set; }
        public int DisplayOrder { get; set; }
        public string CollectionDetailRoute { get; set; }
        public string CollectionAddAction { get; set; }
        public string CollectionOptionConstraint { get; set; }
    }
}