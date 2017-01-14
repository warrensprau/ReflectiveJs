using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ReflectiveJs.Server.Logic.Common.Execution;
using ReflectiveJs.Server.Logic.Common.Persistence;
using ReflectiveJs.Server.Model.Common;
using ReflectiveJs.Server.Model.Organizational;
using ReflectiveJs.Server.Utility;
using ReflectiveJs.Server.Utility.Common;

namespace ReflectiveJs.Server.Logic.Domain
{
    public class GetSearchSetAsync : BaseAsyncModelLogic
    {
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public String Sort { get; set; }

        public List<DashEntityModel> Result { get; internal set; }

        public static async Task<List<DashEntityModel>> With(DateTime from, DateTime to, String sort, ApplicationDbContext dbContext, ICaller caller)
        {
            var surveyOrgHealth = new GetSearchSetAsync()
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

            var member = DbContext.Members.Find(this.Caller.MemberId());
            var searchSet = member.Profile.SearchSet.Split(',');

            if (searchSet.Contains("org"))
            {
                var orgs = DbContext.SetOwnableOrgs(this.Caller.UserId()).ToList();
                foreach (var org in orgs)
                {
                    results.Add(CreateEntity(org.Id, org.Name, "Org", ResourceHelper.Message("EntityType_Org", typeof(CommonText)), null, org.Created, org.LastUpdated));
                }
            }

            if (Sort == "nameasc")
            {
                results.Sort(delegate (DashEntityModel dem1, DashEntityModel dem2)
                {
                    if (dem1.Name == null && dem2.Name == null) return 0;
                    else if (dem1.Name == null) return -1;
                    else if (dem2.Name == null) return 1;
                    else return dem1.Name.CompareTo(dem2.Name);
                });
            }

            if (Sort == "namedesc")
            {
                results.Sort(delegate (DashEntityModel dem1, DashEntityModel dem2)
                {
                    if (dem1.Name == null && dem2.Name == null) return 0;
                    else if (dem1.Name == null) return -1;
                    else if (dem2.Name == null) return 1;
                    else return -1 * dem1.Name.CompareTo(dem2.Name);
                });
            }

            Result = results;
        }

        protected DashEntityModel CreateEntity(int id, string name, string type, string typeLabel, List<Meta> meta, DateTime? created, DateTime? modified)
        {
            var formattedCreated = (created ?? DateTime.Now).ToString("MM-dd-yy");
            var formattedModified = (modified ?? DateTime.Now).ToString("MM-dd-yy");

            return new DashEntityModel() { Id = id, Name = name, Type = type, TypeLabel = typeLabel, Meta = meta ?? new List<Meta>(), IsNew = id == -1, Created = formattedCreated, Modified = formattedModified };
        }

        public class DashEntityModel
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public List<DashEntityModelInfo> Info { get; set; }
            public string Type { get; set; }
            public string TypeLabel { get; set; }
            public List<Meta> Meta { get; set; }
            public bool IsNew { get; set; }
            public string Created { get; set; }
            public string Modified { get; set; }

            public DashEntityModel()
            {
                Info = new List<DashEntityModelInfo>();
            }
        }

        public class DashEntityModelInfo
        {
            public string Name { get; set; }
            public string Value { get; set; }
        }

        public class Meta
        {
            public string Name { get; set; }
            public string Value { get; set; }

            public Meta(string name, string value)
            {
                Name = name;
                Value = value;
            }
        }
    }
}



