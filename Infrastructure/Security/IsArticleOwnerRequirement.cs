using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class IsArticleOwnerRequirement : IAuthorizationRequirement
    {
        
    }

    public class IsArticleOwnerRequirementHandler : AuthorizationHandler<IsArticleOwnerRequirement>
    {
        private readonly DataContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public IsArticleOwnerRequirementHandler(DataContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            _dbContext = dbContext;
            _httpContextAccessor = httpContextAccessor;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsArticleOwnerRequirement requirement)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            var user = _dbContext.Users.FirstOrDefault(x => x.Id == userId);

            if (user == null)
            {
                return Task.CompletedTask;
            }
            
            var articleId = Int32.Parse(_httpContextAccessor.HttpContext?.Request.RouteValues
                .SingleOrDefault(x => x.Key == "articleId").Value?.ToString()!);

            var article = _dbContext.Articles
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.Id == articleId && x.AuthorId == userId)
                .Result;
            

            if(article == null)
                return Task.CompletedTask;
            
            context.Succeed(requirement);
            return Task.CompletedTask;
        }
    }
}