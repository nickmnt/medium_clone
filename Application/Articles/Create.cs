using System.Diagnostics;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Articles;

public class Create
{
    /// <summary>
    /// The article will be created using the Command and with the requesting user as the article author.
    /// </summary>
    public class Command : IRequest<Result<Unit>>
    {
        public Article Article { get; set; }
    }
    
    public class CommandValidator : AbstractValidator<Command>
    {
        public CommandValidator()
        {
            RuleFor(x => x.Article).SetValidator(new ArticleValidator());
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
                x.UserName == _userAccessor.GetUsername());

            request.Article.Author = user;

            _context.Articles.Add(request.Article);

            var result = await _context.SaveChangesAsync() > 0;

            if (!result)
                return Result<Unit>.Failure("Failed to create article.");
            else
                return Result<Unit>.Success(Unit.Value);
        }
    }
}