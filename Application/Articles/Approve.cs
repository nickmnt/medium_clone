using System.Diagnostics;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;
using Persistence;

namespace Application.Articles;

public class Approve
{
    public class Command : IRequest<Result<Unit>>
    {
        public int ArticleId { get; set; }
        public bool NewIsApproved { get; set; }
    }
    
    public class CommandValidator : AbstractValidator<Command>
    {
        public CommandValidator()
        {
            RuleFor(x => x.ArticleId).GreaterThanOrEqualTo(0);
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
            var article = await _context.Articles.FirstOrDefaultAsync(x =>
                x.Id == request.ArticleId);

            if (article == null)
            {
                return null;
            }

            article.IsApproved = request.NewIsApproved;
            
            var result = await _context.SaveChangesAsync() > 0;

            if (!result)
                return Result<Unit>.Failure("Failed to toggle the IsApproved of article.");
            else
                return Result<Unit>.Success(Unit.Value);
        }
    }
}