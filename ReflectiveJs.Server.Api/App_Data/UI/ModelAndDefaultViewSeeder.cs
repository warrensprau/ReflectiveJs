using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Reflection;
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
    public class ModelAndDefaultViewSeeder : IDbSeeder
    {
        public virtual void Seed(ApplicationDbContext dbContext, User user)
        {
            var entityTypes = typeof(AuditedEntity).Assembly.GetTypes().Where(type => type.IsSubclassOf(typeof(AuditedEntity)));

            foreach (var entityType in entityTypes)
            {
                CreateModel(entityType, dbContext);
            }

            dbContext.SaveChanges();
        }

        protected void CreateModel(Type type, ApplicationDbContext dbContext)
        {
            var model = new UiModel();

            var typeName = type.FullName.Substring(type.FullName.LastIndexOf(".") + 1,
                type.FullName.Length - type.FullName.LastIndexOf(".") - 1);

            model.Name = typeName;

            var defaultCreateView = new UiView() { UiViewModeId = UiViewMode.Create, IsDefault = true };
            var defaultReadView = new UiView() { UiViewModeId = UiViewMode.Read, IsDefault = true };
            var defaultUpdateView = new UiView() { UiViewModeId = UiViewMode.Update, IsDefault = true };

            Array props = type.GetProperties();

            foreach (PropertyInfo pinfo in props)
            {
                //if (Attribute.IsDefined(pinfo, typeof(UnusedLocalizedAttribute))) { continue; }

                var field = CreateField(pinfo, model, type);
                if (field.InputType == "unknown") { continue; }

                model.UiFields.Add(field);
                CreateViewFields(field, pinfo, new UiView[] { defaultCreateView, defaultReadView, defaultUpdateView });
            }

            model.Views.Add(defaultCreateView);
            model.Views.Add(defaultReadView);
            model.Views.Add(defaultUpdateView);

            dbContext.UiModels.Add(model);
        }

        protected UiField CreateField(PropertyInfo pinfo, UiModel model, Type type)
        {
            var field = new UiField
            {
                Name = pinfo.Name,
                IsActive = true,
            };

            if (Attribute.IsDefined(pinfo, typeof(ForeignKeyAttribute)))
            {
                var custAttr =
                    (ForeignKeyAttribute)pinfo.GetCustomAttributes(typeof(ForeignKeyAttribute), false).Single();

                field.IsRelationship = true;
                field.InputType = "select";
                if (pinfo.PropertyType == typeof(string))
                {
                    var relField = type.GetProperty(custAttr.Name);
                    if (relField != null)
                    {
                        if (relField.PropertyType.BaseType == typeof(EnumType))
                        {
                            field.IsEnum = true;
                            field.EnumType = relField.PropertyType.Name;
                        }
                    }
                }
            }
            else
            {
                if (pinfo.PropertyType == typeof(int))
                {
                    field.InputType = "number";
                }
                else if (pinfo.PropertyType == typeof(bool))
                {
                    field.InputType = "checkbox";
                }
                else if (pinfo.PropertyType == typeof(DateTime?) || pinfo.PropertyType == typeof(DateTime))
                {
                    field.InputType = "date";
                }
                else if (pinfo.PropertyType.Name.Contains("ICollection"))
                {
                    field.InputType = "collection";
                    field.IsCollection = true;
                }
                else if (pinfo.PropertyType == typeof(string))
                {
                    field.InputType = "text";
                }
                else
                {
                    field.InputType = "unknown";
                }
            }

            return field;
        }

        protected void CreateViewFields(UiField field, PropertyInfo pinfo, UiView[] uiViews)
        {
            foreach (var uiView in uiViews)
            {
                var viewField = new UiViewField
                {
                    UiField = field,
                    DefaultValue = null,
                    IsActive = true,
                    ShownIf = null
                };

                //ApplyCustomAttributesToField(pinfo, viewField, uiView);

                uiView.UiViewFields.Add(viewField);
            }
        }
    }
}