using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos;

public class AddArticlePhoto
{
    public class Command : IRequest<Result<ArticlePhoto>>
    {
        public IFormFile File { get; set; }
        public int ArticleId { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<ArticlePhoto>>
    {
        private readonly DataContext _context;
        private readonly IPhotoAccessor _photoAccessor;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
        {
            _context = context;
            _photoAccessor = photoAccessor;
            _userAccessor = userAccessor;
        }
            
        public async Task<Result<ArticlePhoto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var article = await _context.Articles.Include(p => p.Photo)
                .SingleOrDefaultAsync(x => x.Id == request.ArticleId);

            if (article == null)
            {
                return null;
            }
            
            var photoUploadResult = await _photoAccessor.AddPhoto(request.File);

            var photo = new ArticlePhoto()
            {
                Url = photoUploadResult.Url,
                Id = photoUploadResult.PublicId,
            };

            article.Photo = photo;

            var result = await _context.SaveChangesAsync() > 0;

            if (result)
            {
                return Result<ArticlePhoto>.Success(photo);
            }

            return Result<ArticlePhoto>.Failure("Problem adding photo");
        }
    }
}