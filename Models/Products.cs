using System.ComponentModel.DataAnnotations.Schema;

namespace ProJect.Models
{
    public class Products
    {
        public int id { get; set; }
        public string name { get; set; }
        public int price { get; set; }
        public int count { get; set; }
        public int Cityid { get; set; }
        [ForeignKey("Cityid")]
        public City city { get; set; }
        public int Brandid { get; set; }
        [ForeignKey("Brandid")]
        public Brands brands { get; set; }
        public bool order { get; set; }
        public int Tagsid { get; set; }
        [ForeignKey("Tagsid")]
        public tags tags { get; set; }
        public ICollection<ProductsImages> Imageslist { get; set; }
        public string description { get; set; }
        public ICollection<Orders> orders { get; set; }

    }
}
