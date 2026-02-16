using ProJect.Areas.Identity.Data;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProJect.Models
{
    public class Orders
    {
        public int id { get; set; }
        public int Ordercode { get; set; }
        public string Date { get; set; }
        public bool status { get; set; }
        public int Count { get; set; }
        public string Userid { get; set; }
        [ForeignKey("Userid")]
        public ApplicationUser User { get; set; }        
        public int Productid { get; set; }
        [ForeignKey("Productid")]
        public Products products { get; set; }
    }
}
