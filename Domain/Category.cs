using System.ComponentModel.DataAnnotations;

namespace Domain;

public class Category
{
    public int Id { get; set; }
    public String Name { get; set; }
    public ICollection<Article> Articles { get; set; } = new List<Article>();
}