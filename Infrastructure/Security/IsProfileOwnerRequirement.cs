using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Infrastructure.Security
{
    public class IsProfileOwnerRequirement : IAuthorizationRequirement
    {
        
    }

    public class IsProfileOwnerRequirementHandler : AuthorizationHandler<IsProfileOwnerRequirement>
    {
        private readonly DataContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public IsProfileOwnerRequirementHandler(DataContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            _dbContext = dbContext;
            _httpContextAccessor = httpContextAccessor;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsProfileOwnerRequirement requirement)
        {
            var username = context.User.FindFirstValue(ClaimTypes.Name);

            var user = _dbContext.Users.FirstOrDefault(x => x.UserName == username);

            if (user == null)
            {
                return Task.CompletedTask;
            }
            
            var targetUsername = _httpContextAccessor.HttpContext?.Request.RouteValues
                .SingleOrDefault(x => x.Key == "targetUsername").Value?.ToString();

            if(targetUsername == null)
                return Task.CompletedTask;
            
            if(targetUsername == username)
                context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}