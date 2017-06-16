using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace MonadicComponents.Models{
  public partial class MonadicComponentsContext : DbContext {

      public MonadicComponentsContext(DbContextOptions<MonadicComponentsContext> options) : base(options){}
  }
}
