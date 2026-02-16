using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using ProJect.Data;
using ProJect.Models;
using ProJect.ViewModels;
using System.Collections.Immutable;
using System.Globalization;
using System.Security.Claims;
using System.Security.Cryptography.Xml;
using System.Threading.Tasks;

namespace ProJect.Controllers
{
    public class ProductsController : Controller
    {
        public readonly ProJectDbContext db;
        public ProductsController(ProJectDbContext _db) { db = _db; }
        public IActionResult ProductsHomePage()
        {

            return View();
        }

        public IActionResult ProductsMoreDetailsPage(int id)
        {
            var finder = db.products.Include(x => x.city).Include(x => x.brands).Include(x => x.tags).Include(x => x.Imageslist).FirstOrDefault(x => x.id == id);
            Showinformationproducts inf = new Showinformationproducts();
            inf.id = id;
            inf.name = finder.name;
            inf.price = finder.price;
            inf.count = finder.count;
            inf.images = finder.Imageslist.Select(x => new ProductsImagesViewModels { id = x.id, Imagebyteviewmodel = x.Imagebyte }).ToList();
            inf.Cityname = finder.city.name;
            inf.brandName = finder.brands.name;
            inf.tagname = finder.tags.name;
            inf.description = finder.description;
            return View(inf);
        }

        public async Task<IActionResult> loadselectscity()
        {
            var data = await db.city.ToListAsync();
            return Json(data);
        }

        public async Task<IActionResult> loadselectsbrand()
        {
            var data = await db.brands.ToListAsync();
            return Json(data);
        }

        public async Task<IActionResult> loadselectstag()
        {
            var data = await db.tags.ToListAsync();
            return Json(data);
        }

        public async Task<IActionResult> InserItem(ProductsViewModels Item)
        {
            try
            {
                Products prd = new Products();
                prd.name = Item.name;
                prd.price = Item.price;
                prd.count = Item.count;
                prd.Cityid = Item.Cityid;
                prd.order = Item.order;
                prd.Tagsid = Item.Tagsid;
                prd.Brandid = Item.Brandid;
                prd.description = Item.description;
                List<ProductsImages> productsImages = new List<ProductsImages>();
                Item.Image.ForEach(x =>
                {
                    byte[] imagesbyte = new byte[x.Length];
                    x.OpenReadStream().Read(imagesbyte, 0, imagesbyte.Length);
                    ProductsImages prdimg = new ProductsImages();
                    prdimg.Imagebyte = imagesbyte;
                    productsImages.Add(prdimg);
                });
                prd.Imageslist = productsImages;
                await db.products.AddAsync(prd);
                await db.SaveChangesAsync();
                return Json("success");
            }
            catch (Exception ex)
            {
                return Json(ex.Message);
            }
        }

        public async Task<IActionResult> Insertcity(ProductsViewModels model)
        {
            try
            {
                if (model.Cityname != null)
                {
                    City city = new City();
                    city.name = model.Cityname;
                    await db.city.AddAsync(city);
                    await db.SaveChangesAsync();
                    return Json("successcity");
                }
                else
                {
                    return Json("null");
                }
            }
            catch (Exception ex)
            {
                return Json(ex.Message);
            }
        }

        public async Task<IActionResult> Insertbrand(ProductsViewModels model)
        {
            try
            {
                if (model.brandName != null)
                {

                    Brands brands = new Brands();
                    brands.name = model.brandName;
                    await db.brands.AddAsync(brands);
                    await db.SaveChangesAsync();
                    return Json("the brand inserted successfuly you can see it in the table list");
                }
                else
                {
                    return Json("null");
                }
            }
            catch (Exception ex)
            {
                return Json(ex.Message);
            }
        }

        public async Task<IActionResult> InsertTag(ProductsViewModels model)
        {
            try
            {
                if (model.tagname != null)
                {

                    tags tag = new tags();
                    tag.name = model.tagname;
                    await db.tags.AddAsync(tag);
                    await db.SaveChangesAsync();
                    return Json("the brand inserted successfuly you can see it in the table list");
                }
                else
                {
                    return Json("null");
                }
            }
            catch (Exception ex)
            {
                return Json(ex.Message);
            }
        }

        public async Task<IActionResult> CheckNamecity(string name)
        {
            var finder = await db.city.FirstOrDefaultAsync(x => x.name == name);
            if (finder != null)
            {
                return Json(false);
            }
            else
            {
                return Json(true);
            }
        }

        public async Task<IActionResult> CheckNamebrand(string name)
        {
            var finder = await db.brands.FirstOrDefaultAsync(x => x.name == name);
            if (finder != null)
            {
                return Json(false);
            }
            else
            {
                return Json(true);
            }
        }

        public async Task<IActionResult> Checknametag(string name)
        {
            var finder = await db.tags.FirstOrDefaultAsync(x => x.name == name);
            if (finder != null)
            {
                return Json(false);
            }
            else
            {
                return Json(true);
            }
        }

        public async Task<IActionResult> ShowProducts()
        {
            var data = await db.products.Include(x => x.city).Include(x => x.tags).Include(x => x.brands).ToListAsync();
            List<ShowProductsViewModels> product = new List<ShowProductsViewModels>();
            data.ForEach(x =>
            {
                ShowProductsViewModels prd = new ShowProductsViewModels();
                prd.id = x.id;
                prd.name = x.name;
                prd.price = x.price;
                prd.count = x.count;
                prd.order = x.order;
                prd.Cityname = x.city.name;
                prd.tagname = x.tags.name;
                prd.brandName = x.brands.name;
                product.Add(prd);
            });
            return Json(product);
        }

        public async Task<IActionResult> ShowCity()
        {
            var data = await db.city.ToListAsync();
            return Json(data);
        }

        public async Task<IActionResult> Showtags()
        {
            var data = await db.tags.ToListAsync();
            return Json(data);
        }

        public async Task<IActionResult> ShowBrand()
        {
            var data = await db.brands.ToListAsync();
            return Json(data);
        }

        public IActionResult GenCarads(int page = 1)
        {
            int PageSize = 8;
            int skipitems = (page - 1) * 8;
            var products = db.products.Skip(skipitems).Take(PageSize).Select(x => new ProductsViewModels
            {
                id = x.id,
                name = x.name,
                price = x.price,
                description = x.description,
                Imageslistproductsviewmodels = x.Imageslist.Select(x => new ProductsImagesViewModels { id = x.id, Imagebyteviewmodel = x.Imagebyte }).ToList()
            }).ToList();
            int total = db.products.Count();
            return Json(new { data = products, totalCount = total, pageSize = PageSize, });
        }

        public async Task<IActionResult> MoreInformation(int id)
        {
            var finder = await db.products.Include(x => x.city).Include(x => x.brands).Include(x => x.tags).Include(x => x.Imageslist).FirstOrDefaultAsync(x => x.id == id);
            return Json(finder);
        }

        public async Task<IActionResult> DeleteProducts(int id)
        {
            try
            {
                var finder = await db.products.FindAsync(id);
                db.products.Remove(finder);
                await db.SaveChangesAsync();
                return Json("delete");
            }
            catch (Exception ex)
            {
                return Json(ex.Message);
            }
        }

        public async Task<IActionResult> DeleteCity(int id)
        {
            try
            {
                var findercity = await db.city.FindAsync(id);
                db.city.Remove(findercity);
                await db.SaveChangesAsync();
                return Json("delete");
            }
            catch (Exception ex)
            {
                return Json(ex.Message);
            }
        }

        public async Task<IActionResult> Deletebrand(int id)
        {
            try
            {
                var findercity = await db.brands.FindAsync(id);
                db.brands.Remove(findercity);
                await db.SaveChangesAsync();
                return Json("delete");
            }
            catch (Exception ex)
            {
                return Json(ex.Message);
            }
        }

        public async Task<IActionResult> Deletetag(int id)
        {
            try
            {
                var finder = await db.tags.FindAsync(id);
                db.tags.Remove(finder);
                await db.SaveChangesAsync();
                return Json("delete");
            }
            catch (Exception ex)
            {
                return Json(ex.Message);
            }
        }

        public async Task<IActionResult> EditProducts(int id)
        {
            try
            {
                var finder = await db.products.Include(x => x.city).Include(x => x.brands).Include(x => x.tags).Include(x => x.Imageslist).FirstOrDefaultAsync(x => x.id == id);
                ProductsViewModels item = new ProductsViewModels();
                item.id = id;
                item.name = finder.name;
                item.price = finder.price;
                item.count = finder.count;
                item.order = finder.order;
                item.Imageslistproductsviewmodels = finder.Imageslist.Select(x => new ProductsImagesViewModels { id = x.id, Imagebyteviewmodel = x.Imagebyte }).ToList();
                item.Cityid = finder.Cityid;
                item.Tagsid = finder.Tagsid;
                item.Brandid = finder.Brandid;
                item.order = finder.order;
                item.description = finder.description;
                return Json(item);
            }
            catch (Exception ex)
            {
                return Json(ex.Message);
            }
        }

        public async Task<IActionResult> UpdateProducts(ProductsViewModels items)
        {
            try
            {
                var finder = await db.products.Include(x => x.Imageslist).FirstOrDefaultAsync(x => x.id == items.id);
                finder.name = items.name;
                finder.price = items.price;
                finder.count = items.count;
                finder.order = items.order;
                finder.Cityid = items.Cityid;
                finder.Tagsid = items.Tagsid;
                finder.Brandid = items.Brandid;
                finder.order = items.order;
                finder.description = items.description;
                items.Image?.ForEach(x =>
                {
                    byte[] imgbyte = new byte[x.Length];
                    x.OpenReadStream().Read(imgbyte, 0, imgbyte.Length);
                    ProductsImages prdimg = new ProductsImages();
                    prdimg.Imagebyte = imgbyte;
                    finder.Imageslist.Add(prdimg);
                });
                if (items.Deleteimagesid != null)
                {
                    var finderimage = db.productsImages.Where(x => items.Deleteimagesid.Contains(x.id)).ToList();
                    db.RemoveRange(finderimage);
                }
                db.Update(finder);
                await db.SaveChangesAsync();
                return Json(true);
            }
            catch (Exception ex)
            {
                return Json(ex.Message);
            }
        }

        public async Task<IActionResult> AddtoOrders(int id, int count)
        {
            try
            {

                Random ran = new Random();
                int randomgen = ran.Next(10000, 99999);
                var findergen = db.orders.FirstOrDefault(s => s.Ordercode == randomgen);
                if (findergen == null)
                {
                    Orders orders = new Orders();
                    orders.Productid = id;
                    orders.Userid = User.FindFirstValue(ClaimTypes.NameIdentifier);
                    orders.Date = DateTime.Now.ToString("yyyy-MM-dd");
                    orders.Count = count;
                    orders.status = false;
                    orders.Ordercode = randomgen;
                    await db.orders.AddAsync(orders);
                    await db.SaveChangesAsync();
                }
                return Json("addedorder");
            }
            catch (Exception ex)
            {
                return Json(ex.Message);
            }
        }

        public async Task<IActionResult> TotalCountOrder()
        {
            var total = db.orders.Where(x => x.Userid == User.FindFirstValue(ClaimTypes.NameIdentifier)).ToList().Count();
            return Json(total);
        }

        public async Task<IActionResult> AddtoBest(int id)
        {
            try
            {
                BestProducts addtobest = new BestProducts();
                addtobest.Productid = id;
                addtobest.Userid = User.FindFirstValue(ClaimTypes.NameIdentifier);
                await db.bestProducts.AddAsync(addtobest);
                await db.SaveChangesAsync();
                return Json("addtobest");
            }
            catch (Exception ex)
            {
                return Json(ex.Message);
            }
        }

        public async Task<IActionResult> RemoveFromBest(int id)
        {
            try
            {
                var finderuser = await db.bestProducts.FirstOrDefaultAsync(x => x.Userid == User.FindFirstValue(ClaimTypes.NameIdentifier) && x.Productid == id);
                if (finderuser != null)
                {
                    db.bestProducts.Remove(finderuser);
                    await db.SaveChangesAsync();
                    return Json("removeitem");
                }
                return Json("");
            }
            catch (Exception ex)
            {
                return Json(ex.Message);
            }
        }

        public async Task<IActionResult> Checklike(int id)
        {
            var finder = await db.bestProducts.FirstOrDefaultAsync(x => x.Userid == User.FindFirstValue(ClaimTypes.NameIdentifier) && x.Productid == id);
            bool itsav = false;
            if (finder == null)
            {
                itsav = true;
            }
            return Json(itsav);
        }

        public async Task<IActionResult> ProdcutsOrdersList(int id)
        {
            var finder = db.orders.Include(x => x.products).Where(x => x.Userid == User.FindFirstValue(ClaimTypes.NameIdentifier)).ToList();
            if (finder.Count == 0)
            {
                return Json("no-order");
            }
            else
            {
                List<ShowOrdersViewModels> showinformationproducts = new List<ShowOrdersViewModels>();
                finder.ForEach(x =>
                {
                    ShowOrdersViewModels orderprops = new ShowOrdersViewModels();
                    orderprops.id = x.id;
                    orderprops.productid = x.products.id;
                    orderprops.count = x.Count;
                    orderprops.date = x.Date;
                    orderprops.status = x.status;
                    orderprops.productname = x.products.name;
                    showinformationproducts.Add(orderprops);
                });
                return Json(showinformationproducts);
            }
        }

        public async Task<IActionResult> DeleteOrder(int id)
        {
            try
            {
                var finder = await db.orders.FindAsync(id);
                db.orders.Remove(finder);
                await db.SaveChangesAsync();
                return Json("delete");
            }
            catch (Exception ex)
            {
                return Json(ex.Message);
            }
        }

        public async Task<IActionResult> Pay(int id)
        {
            try
            {
                var finderorder = await db.orders.FindAsync(id);
                finderorder.status = true;
                db.orders.Update(finderorder);
                await db.SaveChangesAsync();
                return Json("payed");
            }
            catch (Exception e)
            {
                return Json(e.Message);
            }
        }

        public async Task<IActionResult> LoadBestProducts() 
        {
            List<ProductsViewModels> prdlst = new List<ProductsViewModels>();
            db.bestProducts.Where(x=>x.Userid==User.FindFirstValue(ClaimTypes.NameIdentifier)).ToList().ForEach(x =>
            {
                db.products.Include(x=>x.Imageslist).Where(y => y.id == x.Productid).ToList().ForEach(c => 
                {
                    ProductsViewModels prdf = new ProductsViewModels();
                    prdf.id = c.id;
                    prdf.Imageslistproductsviewmodels = c.Imageslist.Select(p => new ProductsImagesViewModels { id = p.id, Imagebyteviewmodel = p.Imagebyte }).ToList();
                    prdf.description = c.description;
                    prdf.name = c.name;
                    prdf.price = c.price;
                    prdlst.Add(prdf);
                });
            });
            return Json(prdlst);
        }
    }
}
