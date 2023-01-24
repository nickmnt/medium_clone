using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos;

public class AddProfilePhoto
{
    public class Command : IRequest<Result<ProfilePhoto>>
    {
        public IFormFile File { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<ProfilePhoto>>
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
            
        public async Task<Result<ProfilePhoto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.Include(p => p.Photo)
                .SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

            if (user == null)
            {
                return null;
            }
            
            var photoUploadResult = await _photoAccessor.AddPhoto(request.File);

            var photo = new ProfilePhoto
            {
                Url = photoUploadResult.Url,
                Id = photoUploadResult.PublicId,
            };

            user.Photo = photo;

            var result = await _context.SaveChangesAsync() > 0;

            if (result)
            {
                return Result<ProfilePhoto>.Success(photo);
            }

            return Result<ProfilePhoto>.Failure("Problem adding photo");
        }
    }
}