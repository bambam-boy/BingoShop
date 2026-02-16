using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProJect.Areas.Identity.Data;
using ProJect.Models;

namespace ProJect.Data;

public class ProJectDbContext : IdentityDbContext<ApplicationUser>
{
    public ProJectDbContext(DbContextOptions<ProJectDbContext> options)
        : base(options)
    {
    }

    public DbSet<Products> products { get; set; }
    public DbSet<City> city { get; set; }
    public DbSet<tags> tags { get; set; }
    public DbSet<Brands> brands { get; set; }
    public DbSet<ProductsImages> productsImages { get; set; }
    public DbSet<Orders> orders { get; set; }
    public DbSet<BestProducts> bestProducts { get; set; }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        // Customize the ASP.NET Identity model and override the defaults if needed.
        // For example, you can rename the ASP.NET Identity table names and more.
        // Add your customizations after calling base.OnModelCreating(builder);
    }
}
