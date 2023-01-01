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

namespace Application.AppUsers
{
    public class List
    {
        /// <summary>
        /// Sort by the number of likes the author has gathered through their articles (descending) if
        /// OrderByArticleLikes is true.
        /// </summary>
        public class Query : IRequest<Result<List<ProfileDto>>>
        {
            public bool OrderByArticleLikes { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<ProfileDto>>>
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
            
            public async Task<Result<List<ProfileDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var initialQuery = _context.Articles
                    .Include(x => x.Likes)
                    .Include(x => x.Category)
                    .AsQueryable();

                if (request.OrderByArticleLikes)
                {
                    initialQuery = initialQuery.OrderByDescending(d => d.Likes.Count);
                }
                
                var query = initialQuery.ProjectTo<ProfileDto>(_mapper.ConfigurationProvider);
                
                return Result<List<ProfileDto>>.Success(await query.ToListAsync(cancellationToken));
            }
        }
        
    }
}