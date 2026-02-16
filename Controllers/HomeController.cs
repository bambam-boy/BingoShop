using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProJect.Models;

namespace ProJect.Controllers
{
    public class HomeController : Controller
    {

        public IActionResult Index()
        {
            return View();
        }
    }
}
