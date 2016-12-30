using System;
using Breeze.ContextProvider.EF6;
using Microsoft.Azure.SqlDatabase.ElasticScale.ShardManagement;
using ReflectiveJs.Server.Logic.Common.Persistence;

namespace ReflectiveJs.Server.Api.Providers
{
    public class ApplicationContextProvider : EFContextProvider<ApplicationDbContext>, IDisposable
    {
        //private readonly string _connStr;
        //private readonly int _shardKey;
        //private readonly ShardMap _shardMap;

        //// Bootstrap Elastic Scale by creating a new shard map manager and a shard map on  
        //// the shard map manager database if necessary. 
        //public ApplicationContextProvider(ShardMap shardMap, int shardKey, string connStr)
        //{
        //    _shardMap = shardMap;
        //    _shardKey = shardKey;
        //    _connStr = connStr;
        //}

        public ApplicationContextProvider(ApplicationDbContext applicationDbContext)
        {
            this._applicationDbContext = applicationDbContext;
        }

        private readonly ApplicationDbContext _applicationDbContext;

        protected virtual ApplicationDbContext CreateContext()
        {
            return _applicationDbContext;
        }

        public void Dispose()
        {
            this.Context.Dispose();
        }
    }
}