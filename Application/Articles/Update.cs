using System.Diagnostics;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Articles;

public class Update
{
    /// <summary>
    /// Only the properties Body, Category, Title would be updated.
    /// </summary>
    public class Command : IRequest<Result<Unit>>
    {
        public string Title { get; set; }
        public string Body { get; set; }
        public int CategoryId { get; set; }
        public int ArticleId { get; set; }
    }
    
    public class CommandValidator : AbstractValidator<Command>
    {
        public CommandValidator()
        {
            RuleFor(x => x.Title).NotEmpty();
            RuleFor(x => x.Body).NotEmpty();
            RuleFor(x => x.CategoryId).GreaterThan(0);
            RuleFor(x => x.ArticleId).GreaterThan(0);
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
            var category = await _context.Categories.FirstOrDefaultAsync(x =>
                x.Id == request.CategoryId);
            
            var article = await _context.Articles.FirstOrDefaultAsync(x =>
                x.Id == request.ArticleId);

            if (article == null)
            {
                return null;
            }

            article.Author = user;
            article.Body = request.Body;
            article.Category = category;
            article.Title = request.Title;

            var result = await _context.SaveChangesAsync() > 0;

            if (!result)
                return Result<Unit>.Failure("Failed to update article.");
            else
                return Result<Unit>.Success(Unit.Value);
        }
    }
}