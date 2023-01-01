using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
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
    public class List
    {
        /// <summary>
        /// If Category is not null or empty, the list will be filtered to only include the articles in that category.
        /// Order by date orders the list by their createdAt property (decreasing).
        /// Order by likes orders the list by their number of their likes (decreasing)
        /// Order by date has a higher priority.
        /// </summary>
        public class Query : IRequest<Result<List<ArticleDto>>>
        {
            public string Category { get; set; }
            public bool OrderByLikes { get; set; }
            public bool OrderByDate { get; set; }
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
                    .Include(x => x.Likes)
                    .Include(x => x.Category)
                    .AsQueryable();

                if (request.OrderByLikes)
                {
                    initialQuery = initialQuery.OrderByDescending(d => d.Likes.Count);
                }
                
                if (request.OrderByDate)
                {
                    initialQuery = initialQuery.OrderByDescending(d => d.CreatedAt);
                }
                    
                var query = initialQuery.ProjectTo<ArticleDto>(_mapper.ConfigurationProvider);

                if (!String.IsNullOrEmpty(request.Category))
                {
                    query = query.Where(x =>
                        x.Category.Name == request.Category);
                }

                return Result<List<ArticleDto>>.Success(await query.ToListAsync(cancellationToken));
            }
        }
        
    }
}