using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class CommentsController : BaseApiController
{
    /// <summary>
    /// Lists all the comments of an article.
    /// </summary>
    /// <param name="articleId">Id of an article.</param>
    /// <returns></returns>
    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<List<CommentDto>>> GetComments(int articleId)
    {
        var result = await Mediator.Send(new List.Query
        {
            ArticleId = articleId
        });
        return HandleResult(result);
    }
    
    /// <summary>
    /// Add a new comment to an article.
    /// </summary>
    /// <param name="command">The command.</param>
    /// <returns></returns>
    [HttpPost]
    public async Task<ActionResult<Unit>> Create(Create.Command command)
    {
        var result = await Mediator.Send(command);
        return HandleResult(result);
    }
}