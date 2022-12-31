using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Categories;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Categories
{
    public class List
    {
        public class Query : IRequest<Result<List<CategoryDto>>>
        {
            public bool OrderByArticleCount { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<CategoryDto>>>
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
            
            public async Task<Result<List<CategoryDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var initialQuery = _context.Categories
                    .Include(x => x.Articles)
                    .AsQueryable();

                if (request.OrderByArticleCount)
                {
                    initialQuery = initialQuery.OrderByDescending(d => d.Articles.Count);
                }
                    
                var query = initialQuery.ProjectTo<CategoryDto>(_mapper.ConfigurationProvider);

                return Result<List<CategoryDto>>.Success(await query.ToListAsync(cancellationToken));
            }
        }
        
    }
}