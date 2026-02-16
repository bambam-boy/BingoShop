using ProJect.Models;

namespace ProJect.ViewModels
{
    public class Showinformationproducts
    {
        public int id { get; set; }
        public string name { get; set; }
        public int price { get; set; }
        public int count { get; set; }
        public string Cityname { get; set; }
        public string brandName { get; set; }
        public string tagname { get; set; }
        public string description { get; set; }
        public List<ProductsImagesViewModels> images { get; set; }
    }
}
