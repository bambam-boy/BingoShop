using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ProJect.Areas.Identity.Data;
using ProJect.Data;
var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("ProJectDbContextConnection") ?? throw new InvalidOperationException("Connection string 'ProJectDbContextConnection' not found."); ;

builder.Services.AddDbContext<ProJectDbContext>(options => options.UseSqlServer(connectionString));

builder.Services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true).AddRoles<IdentityRole>().AddEntityFrameworkStores<ProJectDbContext>();

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<ProJectDbContext>();
builder.Services.AddAuthorization(x =>
{
    x.AddPolicy("AdminPolicy", policy => policy.RequireRole("Admin"));
    x.AddPolicy("UserPlicy", policy => policy.RequireRole("Customer"));
});
var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var servic = scope.ServiceProvider;
    var userManager = servic.GetRequiredService<UserManager<ApplicationUser>>();
    var roleManager = servic.GetRequiredService<RoleManager<IdentityRole>>();
    var Admin = await userManager.FindByEmailAsync("vittokushankuhibosheri@gmail.com");
    if (Admin == null)
    {
        Admin = new ApplicationUser();
        Admin.Fullname = "kushankuhi";
        Admin.UserName = "vittokushankuhibosheri@gmail.com";
        Admin.Email = "vittokushankuhibosheri@gmail.com";
        Admin.PhoneNumber = "09379271912";
        Admin.EmailConfirmed = true;
        await userManager.CreateAsync(Admin, "Kushankuhi88kuhi@2");
    }
    if (await roleManager.RoleExistsAsync("Admin") == false)
    {
        await roleManager.CreateAsync(new IdentityRole("Admin"));
    }
    if (await roleManager.RoleExistsAsync("Customer") == false)
    {
        await roleManager.CreateAsync(new IdentityRole("Customer"));
    }
    if (await userManager.IsInRoleAsync(Admin, "Admin") == false)
    {
        await userManager.AddToRoleAsync(Admin, "Admin");
    }
    if (!app.Environment.IsDevelopment())
    {
        app.UseExceptionHandler("/Home/Error");
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
    }
}
app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();


app.Run();

