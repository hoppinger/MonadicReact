using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using MonadicComponents;
using MonadicComponents.Models;
using MonadicComponents.Filters;

namespace MonadicComponents
{
  public interface IEntity {
    DateTime CreatedDate {get;}
    int Id {get;}
  }

  public class ItemWithEditable<T> {
    public T Item {get;set;}
    public bool Editable {get;set;}
    public bool JustCreated {get;set;}
  }

  public class Container<T> {
    public T Content {get;set;}
  }


  static public class QueryableExtensions {
    static public Page<T> Paginate<T, U>(this IQueryable<Tuple<U, bool>> self, bool can_create, bool can_delete, bool can_link, int page_index, int page_size, Func<U,U> g, Func<U,T> f) where U : IEntity {
      var count = self.Count();
      var num_pages = count / page_size + (count % page_size > 0 ? 1 : 0);
      var now = DateTime.Now;
      var just_created = self.OrderByDescending(u => u.Item1.CreatedDate).FirstOrDefault();
      var add_just_created = page_index == 0 && just_created != null && (now - just_created.Item1.CreatedDate).TotalSeconds <= 300;
      var other_items = !add_just_created ?
        self
        :
        self.Where(u => u.Item1.Id != just_created.Item1.Id);
      var items = other_items
        .Skip(page_index * page_size).Take(page_size).ToList().Select(u => Tuple.Create(g(u.Item1), u.Item2))
        .Select(u => new ItemWithEditable<T>(){ Item = f(u.Item1), Editable = u.Item2, JustCreated = false});
      items = !add_just_created ?
         items
         :
         items.Concat(
          new []{new ItemWithEditable<T>(){ Item = f(just_created.Item1), Editable = just_created.Item2, JustCreated = true}})
          //.Concat(items)
          ;
      items = items.ToList();
      // var items = self.Skip(page_index * page_size).Take(page_size).Select(u => Tuple.Create(g(u.Item1), u.Item2)).Select(u => new ItemWithEditable<T>(){ Item = f(u.Item1), Editable = u.Item2}).ToList();
      return new Page<T>() {
        Items = items,
        PageIndex = page_index,
        NumPages = num_pages,
        PageSize = page_size,
        TotalCount = self.Count(),
        CanCreate = can_create,
        CanDelete = can_delete,
        CanLink = can_link
      };
    }
  }

  public class Page<T> {
    public IEnumerable<ItemWithEditable<T>> Items {get;set;}
    public int PageIndex {get;set;}
    public int NumPages {get;set;}
    public int PageSize {get;set;}
    public int TotalCount {get;set;}
    public bool CanDelete {get;set;}
    public bool CanCreate {get;set;}
    public bool CanLink {get;set;}
  }
}
