using System.Diagnostics;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.AppUsers;

public class ToggleActivation
{
    public class Command : IRequest<Result<Unit>>
    {
        public bool newIsActive { get; set; }
        public string targetUsername { get; set; }
    }
    
    public class CommandValidator : AbstractValidator<Command>
    {
        public CommandValidator()
        {
            RuleFor(x => x.targetUsername).NotEmpty();
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
                x.UserName == request.targetUsername);

            if (user == null)
            {
                return null;
            }
            
            user.IsActive = request.newIsActive;
            var result = await _context.SaveChangesAsync() > 0;

            if (!result)
                return Result<Unit>.Failure("Failed to update isActive.");
            else
                return Result<Unit>.Success(Unit.Value);
        }
    }
}