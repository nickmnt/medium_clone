using System;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Photos;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Net.Http.Headers;

namespace Infrastructure.Photos
{
    public class PhotoAccessor : IPhotoAccessor
    {
        public async Task<PhotoUploadResult> AddPhoto(IFormFile file)
        {
            try
            {
                var folderName = Path.Combine("wwwroot", "Resources", "Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                if (file.Length > 0)
                {
                    var extension = Path.GetExtension(file.FileName);
                    var fileName = Guid.NewGuid() + extension;
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(Path.Combine("Resources", "Images"), fileName);
                    await using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }

                    return new PhotoUploadResult
                    {
                        Url = dbPath.Replace(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar),
                        PublicId = fileName
                    };
                }

                return null;
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}