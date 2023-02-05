using System.Net.Http.Headers;
using API.DTOs;
using Application.Photos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class PhotosController : BaseApiController
{
    /// <summary>
    /// Uploads a photo and gives back the URL and Id
    /// </summary>
    /// <param name="command">Include the photo as an IFormFile</param>
    /// <returns></returns>
    [HttpPost]
    public async Task<IActionResult> Upload([FromForm] Add.Command command)
    {
        return HandleResult(await Mediator.Send(command));
    }
    
    /// <summary>
    /// Uploads a photo as the user's profile picture
    /// </summary>
    /// <param name="command">Include the photo as an IFormFile</param>
    /// <returns></returns>
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromForm] AddProfilePhoto.Command command)
    {
        return HandleResult(await Mediator.Send(command));
    }
    
    /// <summary>
    /// Uploads a photo as the article's primary picture
    /// </summary>
    /// <param name="articleId">The Id of the article being changed.</param>
    /// <param name="command">Include the photo as an IFormFile</param>
    /// <returns></returns>
    [Authorize(Policy = "IsArticleOwner")]
    [HttpPut("article")]
    public async Task<IActionResult> UpdateArticle(int articleId, [FromForm] PhotoUploadDto command)
    {
        return HandleResult(await Mediator.Send(new AddArticlePhoto.Command {File = command.File, ArticleId=articleId}));
    }
}