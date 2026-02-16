namespace ProJect.Models
{
    public class City
    {
        public int id { get; set; }
        public string name { get; set; }
        public ICollection<Products> products { get; set; }
    }
}
