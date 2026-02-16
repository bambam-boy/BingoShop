using ProJect.Areas.Identity.Data;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProJect.Models
{
    public class BestProducts
    {
        public int id { get; set; }
        public string Userid { get; set; }
        [ForeignKey("Userid")]
        public ApplicationUser User { get; set; }
        public int Productid { get; set; }
        [ForeignKey("Productid")]
        public Products products { get; set; }
    }
}
