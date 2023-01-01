using System.ComponentModel.DataAnnotations;

namespace Domain;

public class Comment
{
    public int Id { get; set; }
    public string Body { get; set; }
    [Required]
    public AppUser Author { get; set; }
    [Required]
    public Article Article { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}