using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Linq.Expressions;

namespace ReflectiveJs.Server.Logic.Common.Persistence
{
    public class FilteredReflectiveDbSet : DbSet, IOrderedQueryable, IListSource
    {
        private readonly Expression<Func<bool>> _filter;
        private readonly Action _initializeEntity;
        private readonly DbSet _set;
        private readonly Type _type;

        public FilteredReflectiveDbSet(Type type, DbContext context, Expression<Func<bool>> filter, Action initializeEntity)
            : this(context.Set(type), filter, initializeEntity)
        {
        }

        private FilteredReflectiveDbSet(DbSet set, Expression<Func<bool>> filter, Action initializeEntity)
        {
            _set = set;
            _filter = filter;
            _initializeEntity = initializeEntity;
            _type = set.GetType();
        }

        public object Add(object entity)
        {
            //DoInitializeEntity(entity);
            return _set.Add(entity);
        }

        public object Attach(object entity)
        {
            //DoInitializeEntity(entity);
            return _set.Attach(entity);
        }

        public object Create()
        {
            var entity = _set.Create();
            //DoInitializeEntity(entity);
            return entity;
        }

        public object Find(params object[] keyValues)
        {
            var entity = _set.Find(keyValues);
            if (entity == null)
                return null;


            return entity;
        }

        public object Remove(object entity)
        {
            if (!_set.Local.Contains(entity))
            {
                _set.Attach(entity);
            }
            return _set.Remove(entity);
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return _set.AsQueryable().GetEnumerator();
        }

        IQueryProvider IQueryable.Provider
        {
            get { return _set.AsQueryable().Provider; }
        }

        bool IListSource.ContainsListCollection
        {
            get { return false; }
        }

        IList IListSource.GetList()
        {
            throw new InvalidOperationException();
        }
    }
}