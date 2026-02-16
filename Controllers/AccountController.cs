using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ProJect.Areas.Identity.Data;
using ProJect.Data;
using ProJect.ViewModels;
using System.Security.Claims;

namespace ProJect.Controllers
{
    public class AccountController : Controller
    {
        public readonly ProJectDbContext db;
        public AccountController(ProJectDbContext _db)
        {
            db = _db;
        }
        public IActionResult loginandregisterpage()
        {
            return View();
        }

        [Authorize(Policy = "UserPlicy")]

        public IActionResult Accountpanel()
        {
            return View();
        }

        public IActionResult OrdersPanel()
        {
            return View();
        }

        public IActionResult BestProductsPage()
        {
            return View();
        }


        public async Task<IActionResult> RegisterConferm(PropsViewModels item, [FromServices] UserManager<ApplicationUser> userManager)
        {
            try
            {
                var user = await userManager.FindByEmailAsync(item.UserName);
                if (user == null)
                {
                    user = new ApplicationUser();
                    user.Fullname = item.FullName;
                    user.UserName = item.UserName;
                    user.Email = item.UserName;
                    user.PhoneNumber = item.PhoneNumber.ToString();
                    user.EmailConfirmed = true;
                    var success = await userManager.CreateAsync(user, item.Password);
                    if (success.Succeeded)
                    {
                        if (await userManager.IsInRoleAsync(user, "Customer") == false)
                        {
                            await userManager.AddToRoleAsync(user, "Customer");
                        }
                        return Json("success");
                    }
                    else
                    {
                        return Json("errorreg");
                    }
                }
                else
                {
                    return Json("haveaccount");
                }
            }
            catch (Exception)
            {
                return Json("catch");
            }
        }

        public async Task<IActionResult> Loginconfrem(PropsViewModels item, [FromServices] UserManager<ApplicationUser> userManager, [FromServices] SignInManager<ApplicationUser> signInManager)
        {
            try
            {
                var user = await userManager.FindByEmailAsync(item.UserName);
                if (user == null)
                {
                    return Json("mustreg");
                }
                else
                {
                    var success = await signInManager.PasswordSignInAsync(user, item.Password, item.keeplo, false);
                    if (success.Succeeded)
                    {
                        return Json("Fixed");
                    }
                    else
                    {
                        return Json("error");
                    }
                }
            }
            catch (Exception)
            {
                return Json("catch");
            }
        }

        public async Task<IActionResult> Signout([FromServices] SignInManager<ApplicationUser> signInManager)
        {
            signInManager.SignOutAsync();
            return RedirectToAction("Index", "Home");
        }

        public async Task<IActionResult> ShowDetails([FromServices] UserManager<ApplicationUser> userManager)
        {
            string userid = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await userManager.FindByIdAsync(userid);
            PropsViewModels userdet = new PropsViewModels();
            userdet.FullName = user.Fullname;
            userdet.UserName = user.Email;
            userdet.PhoneNumber = user.PhoneNumber;
            return Json(userdet);
        }

        public async Task<IActionResult> UpdateInformaiton(PropsViewModels item, [FromServices] UserManager<ApplicationUser> userManager)
        {
            try
            {
                var testunemail = await userManager.FindByEmailAsync(item.UserName);
                if (testunemail == null)
                {
                    var user = await userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));
                    user.PhoneNumber = item.PhoneNumber;
                    user.UserName = item.UserName;
                    user.Email = item.UserName;
                    user.Fullname = item.FullName;
                    IdentityResult result = await userManager.UpdateAsync(user);
                    return Json(true);
                }
                else
                {
                    return Json("emailnotnull");
                }
            }
            catch (Exception error)
            {
                return Json(error.Message);
            }

        }

        public async Task<IActionResult> Changepass(ChangepasswrodViewModels pass, [FromServices] UserManager<ApplicationUser> userManager)
        {
            var user = await userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var success = await userManager.ChangePasswordAsync(user, pass.Oldpass, pass.Newpass);
            if (success.Succeeded)
            {
                return Json("success");
            }
            else
            {
                return Json("error");
            }
        }
    }
}
