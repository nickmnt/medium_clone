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
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            var user = _dbContext.Users.FirstOrDefault(x => x.Id == userId);

            if (user == null)
            {
                return Task.CompletedTask;
            }
            
            var targetUsername = _httpContextAccessor.HttpContext?.Request.RouteValues
                .SingleOrDefault(x => x.Key == "targetUsername").Value?.ToString();

            if(targetUsername == null)
                return Task.CompletedTask;
            
            if(targetUsername == userId)
                context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}