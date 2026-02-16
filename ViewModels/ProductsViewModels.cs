namespace ProJect.ViewModels
{
    public class ProductsViewModels
    {
        public int id { get; set; }
        public string name { get; set; }
        public int price { get; set; }
        public int count { get; set; }
        public int Cityid { get; set; }
        public int Brandid { get; set; }
        public List<IFormFile> Image { get; set; }
        public List<ProductsImagesViewModels> Imageslistproductsviewmodels { get; set; }
        public List<int> Deleteimagesid { get; set; }
        public bool order { get; set; }
        public byte[] imgbyte { get; set; }
        public int Tagsid { get; set; }
        public string? Cityname { get; set; }
        public string? brandName { get; set; }
        public string? tagname { get; set; }
        public string description { get; set; }
    }
}
