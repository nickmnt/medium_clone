using System.Diagnostics;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.AppUsers;

public class Update
{
    public class Command : IRequest<Result<Unit>>
    {
        public string Bio { get; set; }
        public string DisplayName { get; set; }
        public string TargetUsername { get; set; }
    }
    
    public class CommandValidator : AbstractValidator<Command>
    {
        public CommandValidator()
        {
            RuleFor(x => x.DisplayName).NotEmpty();
            RuleFor(x => x.TargetUsername).NotEmpty();
        }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context, IUserAccessor userAccessor)
        {
            _context = context;
            _userAccessor = userAccessor;
        }

        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => 
                x.UserName == request.TargetUsername);

            if (user == null)
            {
                return null;
            }

            user.Bio = request.Bio;
            user.DisplayName = request.DisplayName;
            
            var result = await _context.SaveChangesAsync() > 0;

            if (!result)
                return Result<Unit>.Failure("Failed to update user.");
            else
                return Result<Unit>.Success(Unit.Value);
        }
    }
}