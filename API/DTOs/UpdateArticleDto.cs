namespace API.DTOs;

public class UpdateArticleDto
{
    public string Body { get; set; }
    public string Title { get; set; }
    public int CategoryId { get; set; }
}