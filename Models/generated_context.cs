using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace MonadicComponents.Models{
  public partial class MonadicComponentsContext {
    public DbSet<HomePage> HomePage { get; set; }
    public DbSet<Course> Course { get; set; }
    public DbSet<Lecture> Lecture { get; set; }
    
    
    
    public DbSet<Course_Lecture> Course_Lecture { get; set; }
    public DbSet<Session> Session { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {



  
    
    

  
      modelBuilder.Entity<Session>()
        .HasIndex(b => b.CookieName);
      modelBuilder.Entity<Session>()
        .HasIndex(b => b.LoggedEntityName);
      modelBuilder.Entity<Session>()
        .HasIndex(b => b.LoggedEntityId);
      modelBuilder.Entity<Session>()
        .HasIndex(b => b.CreatedAt);
    }
  }
}
    