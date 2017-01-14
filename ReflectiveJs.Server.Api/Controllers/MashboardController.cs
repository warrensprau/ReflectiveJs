using System;
using System.Threading.Tasks;
using System.Web.Http;
using ReflectiveJs.Server.Logic.Domain;

namespace ReflectiveJs.Server.Api.Controllers
{
    public class MashboardController : ResourceController
    {
        [Route("dash/simple")]
        [HttpGet]
        public async Task<IHttpActionResult> SimpleDash(string from = "", string to = "", string sort = "nameasc")
        {
            DateTime fromDate;
            DateTime toDate;

            if (!DateTime.TryParse(from, out fromDate))
            {
                fromDate = DateTime.Now.AddDays(-1);
            }

            if (!DateTime.TryParse(to, out toDate))
            {
                toDate = DateTime.Now;
            }

            var results = await GetSearchSetAsync.With(fromDate, toDate, sort, DbContext, await CallerAsync());

            return Ok(results);
        }

        [Route("performancesummary")]
        [HttpGet]
        public async Task<IHttpActionResult> PerformanceSummary(string metricFilter = "", string breakdownFilter = "", string from = "", string to = "")
        {
            DateTime fromDate;
            DateTime toDate;

            if (!DateTime.TryParse(from, out fromDate))
            {
                fromDate = DateTime.Today;
            }

            fromDate = fromDate.Date;

            if (!DateTime.TryParse(to, out toDate))
            {
                toDate = DateTime.Now;
            }

            toDate = toDate.Date;

            var results = await GetMashupMetrics.With(metricFilter, breakdownFilter, fromDate, toDate, DbContext, await CallerAsync());

            return Ok(results);
        }
    }
}