using Microsoft.AspNetCore.Mvc;

namespace ProJect.Controllers
{
    public class BlogController : Controller
    {
        public IActionResult BlogPage()
        {
            return View();
        }
    }
}
