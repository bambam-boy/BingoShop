using Microsoft.AspNetCore.Mvc;

namespace ProJect.Controllers
{
    public class AboutController : Controller
    {
        public IActionResult About()
        {
            return View();
        }
    }
}
