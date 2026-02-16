using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.FlowAnalysis.DataFlow.PointsToAnalysis;
using Microsoft.EntityFrameworkCore;
using ProJect.Data;
using ProJect.Models;
using ProJect.ViewModels;

namespace ProJect.Controllers
{
    public class AdminController : Controller
    {
        public readonly ProJectDbContext db;
        public AdminController(ProJectDbContext _db) { db = _db; }

        [Authorize(Policy = "AdminPolicy")] 
        public IActionResult AdminDashboard() { return View(); }
        public IActionResult AdminProductsPanel() { return View(); }
        public IActionResult AdminOrdersPanel()
        {
            return View();
        }
    }
}
