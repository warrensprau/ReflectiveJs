using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ReflectiveJs.Server.Logic.Common.Execution;
using ReflectiveJs.Server.Logic.Common.Persistence;

namespace ReflectiveJs.Server.Logic.Domain
{
    public class GetMashupMetrics : BaseAsyncModelLogic
    {
        public string MetricFilter { get; set; }
        public string BreakdownFilter { get; set; }
        public DateTime From { get; set; }
        public DateTime To { get; set; }

        public List<SummaryMetric> Result { get; internal set; }

        public static async Task<List<SummaryMetric>> With(string metricFilter, string breakdownFilter, DateTime from,
            DateTime to, ApplicationDbContext dbContext, ICaller caller)
        {
            var getMashupMetrics = new GetMashupMetrics
            {
                MetricFilter = metricFilter,
                BreakdownFilter = breakdownFilter,
                From = from,
                To = to,
                DbContext = dbContext,
                Caller = caller
            };
            await getMashupMetrics.ExecuteAsync();

            return getMashupMetrics.Result;
        }

        protected override async Task BasicExecute()
        {
            var summaryMetrics = new List<SummaryMetric>();

            if (string.IsNullOrEmpty(MetricFilter) && string.IsNullOrEmpty(BreakdownFilter))
            {
                var getSummaryMetrics = new GetSummaryMetrics
                {
                    From = From,
                    To = To,
                    DbContext = DbContext,
                    Caller = Caller
                };

                await getSummaryMetrics.ExecuteAsync();
                summaryMetrics = getSummaryMetrics.Result;
            }

            Result = summaryMetrics;
        }
    }

    public class SummaryMetric
    {
        public string Type { get; set; }
        public string Label { get; set; }
        public int Actual { get; set; }
        public int Target { get; set; }
        public double Percent { get; set; }
        public string Display { get; set; }
    }
}