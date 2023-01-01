using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class CommentsController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<CommentDto>>> GetComments(int articleId)
    {
        var result = await Mediator.Send(new List.Query
        {
            ArticleId = articleId
        });
        return HandleResult(result);
    }
    
    [HttpPost]
    public async Task<ActionResult<Unit>> Create(int articleId, string body)
    {
        var result = await Mediator.Send(new Create.Command {ArticleId = articleId, Body = body});
        return HandleResult(result);
    }
}