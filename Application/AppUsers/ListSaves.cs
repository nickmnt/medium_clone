using Application.Articles;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.AppUsers;

public class ListSaves
{
    public class Query : IRequest<Result<List<ArticleDto>>>
    {
    }

    public class Handler : IRequestHandler<Query, Result<List<ArticleDto>>>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
        {
            _context = context;
            _mapper = mapper;
            _userAccessor = userAccessor;
        }
            
        public async Task<Result<List<ArticleDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var articles = _context.Articles
                .Include(x => x.Saves)
                .Where(x => x.Saves.Any(x => x.UserName == _userAccessor.GetUsername()))
                .AsQueryable();

            var query = articles.ProjectTo<ArticleDto>(_mapper.ConfigurationProvider);
                
            return Result<List<ArticleDto>>.Success(await query.ToListAsync(cancellationToken));
        }
    }
}