using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using ReflectiveJs.Server.Logic.Common.Execution;
using ReflectiveJs.Server.Logic.Common.Persistence;
using ReflectiveJs.Server.Model.Common;
using ReflectiveJs.Server.Utility;
using ReflectiveJs.Server.Utility.Common;

namespace ReflectiveJs.Server.Api.Actions
{
    public class GetSearchSetAsync : BaseAsyncModelLogic
    {
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public string Sort { get; set; }

        public List<DashEntityModel> Result { get; internal set; }

        public static async Task<List<DashEntityModel>> With(DateTime from, DateTime to, string sort,
            ApplicationDbContext dbContext, ICaller caller)
        {
            var surveyOrgHealth = new GetSearchSetAsync
            {
                From = from,
                To = to,
                Sort = sort,
                DbContext = dbContext,
                Caller = caller
            };
            await surveyOrgHealth.ExecuteAsync();

            return surveyOrgHealth.Result;
        }

        protected override async Task BasicExecute()
        {
            var results = new List<DashEntityModel>();

            var member = DbContext.Members.Find(Caller.MemberId());
            var searchSet = member.Profile.SearchSet.Split(',');

            var entityTypes =
                typeof(AuditedEntity).Assembly.GetTypes().Where(type => type.IsSubclassOf(typeof(AuditedEntity)));

            foreach (var entityType in entityTypes)
            {
                if (searchSet.Contains(entityType.Name.ToLower()))
                {
                    await DbContext.Set(entityType).ForEachAsync(entity => results.Add(CreateEntity((INamedEntity)entity, entityType)));
                }
            }

            if (Sort == "nameasc")
            {
                results.Sort(delegate(DashEntityModel dem1, DashEntityModel dem2)
                {
                    if (dem1.Name == null && dem2.Name == null) return 0;
                    if (dem1.Name == null) return -1;
                    if (dem2.Name == null) return 1;
                    return dem1.Name.CompareTo(dem2.Name);
                });
            }

            if (Sort == "namedesc")
            {
                results.Sort(delegate(DashEntityModel dem1, DashEntityModel dem2)
                {
                    if (dem1.Name == null && dem2.Name == null) return 0;
                    if (dem1.Name == null) return -1;
                    if (dem2.Name == null) return 1;
                    return -1*dem1.Name.CompareTo(dem2.Name);
                });
            }

            Result = results;
        }

        protected DashEntityModel CreateEntity(INamedEntity entity, Type entityType)
        {
            var formattedCreated = (((IAuditable)entity).Created ?? DateTime.Now).ToString("MM-dd-yy");
            var formattedModified = (((IAuditable)entity).LastUpdated ?? DateTime.Now).ToString("MM-dd-yy");

            return new DashEntityModel
            {
                Id = entity.Id,
                Name = entity.Name,
                Type = entityType.FullName,
                TypeLabel = "",
                Meta = new List<Meta>(),
                IsNew = entity.Id == -1,
                Created = formattedCreated,
                Modified = formattedModified
            };
        }

        public class DashEntityModel
        {
            public DashEntityModel()
            {
                Info = new List<DashEntityModelInfo>();
            }

            public int Id { get; set; }
            public string Name { get; set; }
            public List<DashEntityModelInfo> Info { get; set; }
            public string Type { get; set; }
            public string TypeLabel { get; set; }
            public List<Meta> Meta { get; set; }
            public bool IsNew { get; set; }
            public string Created { get; set; }
            public string Modified { get; set; }
        }

        public class DashEntityModelInfo
        {
            public string Name { get; set; }
            public string Value { get; set; }
        }

        public class Meta
        {
            public Meta(string name, string value)
            {
                Name = name;
                Value = value;
            }

            public string Name { get; set; }
            public string Value { get; set; }
        }
    }
}