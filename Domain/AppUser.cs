using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser<int>
    {
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public bool IsActive { get; set; } = true;
        public ProfilePhoto Photo { get; set; }
        [InverseProperty("Likes")]
        public ICollection<Article> LikedArticles { get; set; } = new List<Article>();
        [InverseProperty("Saves")]
        public ICollection<Article> SavedArticles { get; set; } = new List<Article>();
        [InverseProperty("Author")]
        public ICollection<Article> AuthoredArticles { get; set; } = new List<Article>();
    }
}