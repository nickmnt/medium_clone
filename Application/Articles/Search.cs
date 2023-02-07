using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.AppUsers;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Articles
{
    public class Search
    {
        public class Query : IRequest<Result<List<ArticleDto>>>
        {
            public string TitleSubstring { get; set; }
            public string AuthorNameSubstring { get; set; }
            public string BodySubstring { get; set; }
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
                var initialQuery = _context.Articles
                    .Include(x => x.Author)
                    .Where(x => (!String.IsNullOrEmpty(request.TitleSubstring) && x.Title.Contains(request.TitleSubstring))
                    || (!String.IsNullOrEmpty(request.BodySubstring) && x.Body.Contains(request.BodySubstring))
                    || (!String.IsNullOrEmpty(request.AuthorNameSubstring) && x.Author.DisplayName.Contains(request.AuthorNameSubstring)))
                    .AsQueryable();

                var query = initialQuery.ProjectTo<ArticleDto>(_mapper.ConfigurationProvider);

                return Result<List<ArticleDto>>.Success(await query.ToListAsync(cancellationToken));
            }
        }
        
    }
}