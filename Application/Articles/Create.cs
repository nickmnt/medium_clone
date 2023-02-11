using System.Diagnostics;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
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
    public class Command : IRequest<Result<ArticleDto>>
    {
        public string Title { get; set; }
        public string Body { get; set; }
        public int CategoryId { get; set; }
    }
    
    public class CommandValidator : AbstractValidator<Command>
    {
        public CommandValidator()
        {
            RuleFor(x => x.Title).NotEmpty();
            RuleFor(x => x.Body).NotEmpty();
            RuleFor(x => x.CategoryId).GreaterThan(0);
        }
    }

    public class Handler : IRequestHandler<Command, Result<ArticleDto>>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;
        private readonly IMapper _mapper;

        public Handler(DataContext context, IUserAccessor userAccessor, IMapper mapper)
        {
            _context = context;
            _userAccessor = userAccessor;
            _mapper = mapper;
        }

        public async Task<Result<ArticleDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => 
                x.UserName == _userAccessor.GetUsername());
            var category = await _context.Categories.FirstOrDefaultAsync(x =>
                x.Id == request.CategoryId);
            
            var article = new Article
            {
                Title = request.Title,
                Body = request.Body,
                Author = user,
                Category = category
            };

            _context.Articles.Add(article);

            var result = await _context.SaveChangesAsync() > 0;

            if (!result)
                return Result<ArticleDto>.Failure("Failed to create article.");
            else
                return Result<ArticleDto>.Success(_mapper.Map<ArticleDto>(article));
        }
    }
}