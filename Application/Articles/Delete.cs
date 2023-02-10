using Application.Core;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Articles;

public class Delete
{
    public class Command : IRequest<Result<Unit>>
    {
        public int ArticleId { get; set; }
    }
    
    public class CommandValidator : AbstractValidator<Command>
    {
        public CommandValidator()
        {
            RuleFor(x => x.ArticleId).GreaterThan(0);
        }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly DataContext _context;

        public Handler(DataContext context)
        {
            _context = context;
        }

        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var article = await _context.Articles.FirstOrDefaultAsync(x =>
                x.Id == request.ArticleId);

            if (article == null)
            {
                return null;
            }

            _context.Articles.Remove(article);

            var result = await _context.SaveChangesAsync() > 0;

            if (!result)
                return Result<Unit>.Failure("Failed to remove article.");
            else
                return Result<Unit>.Success(Unit.Value);
        }
    }
}