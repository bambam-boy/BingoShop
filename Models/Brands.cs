namespace ProJect.Models
{
    public class Brands
    {
        public int id { get; set; }
        public string name { get; set; }
        public ICollection<Products> products { get; set; }
    }
}
