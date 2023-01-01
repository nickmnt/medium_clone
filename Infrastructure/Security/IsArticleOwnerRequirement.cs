using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
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
            var username = context.User.FindFirstValue(ClaimTypes.Name);

            var user = _dbContext.Users.FirstOrDefault(x => x.UserName == username);

            if (user == null)
            {
                return Task.CompletedTask;
            }
            
            var articleId = Int32.Parse(_httpContextAccessor.HttpContext!.Request.Query["articleId"].ToString());

            var article = _dbContext.Articles
                .Include(x => x.Author)
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.Id == articleId && x.Author.UserName == username)
                .Result;
            

            if(article == null)
                return Task.CompletedTask;
            
            context.Succeed(requirement);
            return Task.CompletedTask;
        }
    }
}