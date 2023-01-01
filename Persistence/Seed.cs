using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context,
            UserManager<AppUser> userManager)
        {
            List<AppUser> testers = new List<AppUser>();

            if (userManager.Users.Any())
            {
                return;
            }

            var users = new List<AppUser>
            {
                new AppUser
                {
                    DisplayName = "Bob",
                    UserName = "bob",
                    Email = "bob@test.com",
                    Bio = "I am a test user #1",
                },
                new AppUser
                {
                    DisplayName = "Jane",
                    UserName = "jane",
                    Email = "jane@test.com",
                    Bio = "I am a test user #2",
                },
                new AppUser
                {
                    DisplayName = "Tom",
                    UserName = "tom",
                    Email = "tom@test.com",
                    Bio = "I am a test user #3",
                    IsActive = false
                },
            };

            foreach (var user in users)
            {
                await userManager.CreateAsync(user, "Pa$$w0rd");
            }

            for (int i = 1; i <= 10; ++i)
            {
                var user = new AppUser
                {
                    DisplayName = "Tester_" + i,
                    UserName = "tester" + i,
                    Email = "tester" + i + "@test.com",
                    Bio = "I am tester #" + i
                };
                testers.Add(user);
                await userManager.CreateAsync(user, $"Pa$$w0rd");
            }

            var admin = new AppUser
            {
                UserName = "admin",
                Email = "admin@test.com"
            };

            await userManager.CreateAsync(admin, "Pa$$w0rd");
            await userManager.AddToRolesAsync(admin, new[] { "Member", "Admin" });

            await context.SaveChangesAsync();
            
            if (context.Articles.Any())
                return;

            List<Category> categories = new List<Category>();
            // Create 10 categories
            for (int i = 1; i <= 10; ++i)
            {
                categories.Add(new Category
                {
                    Name = "testCategory_" + i
                });

                // Create 10 articles for each category
                for (int j = 1; j <= 10; ++j)
                {
                    var article = new Article
                    {
                        Author = testers[j - 1],
                        Body = "Please like and comment!",
                        Category = categories[i - 1],
                        Title = "Test Article " + i + "_" + j,
                        IsApproved = j % 2 == 0
                    };
                    if (article.IsApproved)
                    {
                        for (int k = 1; k <= 10; ++k)
                        {
                            var comment = new Comment
                            {
                                Article = article,
                                Author = testers[k - 1],
                                Body = "I like this article!"
                            };
                            article.Comments.Add(comment);
                            article.Likes.Add(testers[k - 1]);
                        }
                    }

                    categories[i - 1].Articles.Add(article);
                }
            }

            foreach (var category in categories)
            {
                context.Categories.Add(category);
            }

            await context.SaveChangesAsync();
        }
    }
}