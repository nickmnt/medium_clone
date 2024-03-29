﻿using Application.AppUsers;
using Application.Categories;
using Domain;

namespace Application.Articles;

public class ArticleDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Body { get; set; }
    public bool IsApproved { get; set; }
    public string Image { get; set; }
    public ProfileDto Author { get; set; }

    public List<ProfileDto> Likes { get; set; }
    // Might change to only use category name or Id instead
    public CategoryDto Category { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}