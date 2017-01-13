using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ReflectiveJs.Server.Logic.Common.Execution;
using ReflectiveJs.Server.Logic.Common.Persistence;
using ReflectiveJs.Server.Model.Performance;
using ReflectiveJs.Server.Utility;
using ReflectiveJs.Server.Utility.Common;

namespace ReflectiveJs.Server.Logic.Domain
{
    public class GetSummaryMetrics : BaseAsyncModelLogic
    {
        public static async Task<List<SummaryMetric>> With(DateTime from, DateTime to, ApplicationDbContext dbContext, ICaller caller)
        {
            var getSummaryMetrics = new GetSummaryMetrics()
            {
                From = from,
                To = to,
                DbContext = dbContext,
                Caller = caller
            };
            await getSummaryMetrics.ExecuteAsync();

            return getSummaryMetrics.Result;
        }

        private static List<string> _goalTypes = new List<string>()
        {
            GoalType.Chargeback, GoalType.Order, GoalType.Return, GoalType.Revenue, GoalType.Rma, GoalType.Subscription
        };

        public int OrgId { get; set; }
        public DateTime From { get; set; }
        public DateTime To { get; set; }

        public List<SummaryMetric> Result { get; internal set; }

        protected override async Task BasicExecute()
        {
            var summaryMetrics = new List<SummaryMetric>();

            var metricsQuery = DbContext.DaySummaryMetrics.Where(
                dsm => dsm.Date >= From.Date && dsm.Date <= To.Date);

            var metrics = await metricsQuery.ToListAsync();

            var goals = await DbContext.OrgGoals.Where(og => og.OrgId == OrgId).ToListAsync();

            foreach (var goalType in _goalTypes)
            {
                summaryMetrics.Add(CreateSummaryMetric(metrics, goals, goalType));
            }

            Result = summaryMetrics;
        }

        protected SummaryMetric CreateSummaryMetric(List<DaySummaryMetric> daySummaryMetrics, List<OrgGoal> goals, string goalType)
        {
            var goalTypeDaySummaryMetrics = daySummaryMetrics.Where(dsm => dsm.GoalTypeId == goalType).ToList();
            var actual = goalTypeDaySummaryMetrics.Sum(dsm => dsm.Total);

            var target = 0;
            double percent = 0;

            var goalTypeGoal = goals.SingleOrDefault(cog => cog.GoalTypeId == goalType);

            if (goalTypeGoal != null)
            {
                var numDays = (To - From).Days;
                if (numDays <= 0)
                {
                    numDays = 1;
                }
                target = goalTypeGoal.Target * numDays;

                if (goalTypeGoal.GoalMetricTypeId == GoalMetricType.Quantity)
                {
                    percent = target == 0 ? 0 : ((double)actual / (double)target);
                }
                else
                {
                    percent = target == 0 ? 0 : ((double)actual / (double)target);
                }
            }

            var summaryMetric =
                new SummaryMetric()
                {
                    Type = goalType,
                    Label = ResourceHelper.EnumMessage(goalType, typeof(CommonText)),
                    Actual = actual,
                    Target = target,
                    Percent = percent * 100,
                    Display = target == 0 ? actual.ToString(CultureInfo.InvariantCulture) : percent.ToString("P1", CultureInfo.InvariantCulture)
                };

            return summaryMetric;
        }
    }
}