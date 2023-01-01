using Application.Articles;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ArticlesController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<ArticleDto>>> GetArticles(string category, bool orderByDate, bool orderByLikes)
    {
        var result = await Mediator.Send(new List.Query
        {
            Category = category,
            OrderByDate = orderByDate,
            OrderByLikes = orderByLikes 
        });
        return HandleResult(result);
    }
    
    [HttpGet]
    public async Task<ActionResult<List<ArticleDto>>> SearchArticles(string bodySubstring, string titleSubstring,
        string authorNameSubstring)
    {
        var result = await Mediator.Send(new Search.Query
        {
            BodySubstring = bodySubstring,
            TitleSubstring = titleSubstring,
            AuthorNameSubstring = authorNameSubstring 
        });
        return HandleResult(result);
    }
    
    [HttpPost]
    public async Task<ActionResult<Unit>> Create([FromQuery] Article article)
    {
        var result = await Mediator.Send(new Create.Command {Article = article});
        return HandleResult(result);
    }
    
    [Authorize(Policy = "IsArticleOwner")]
    [HttpPut]
    public async Task<ActionResult<Unit>> Update([FromQuery] Article article, int articleId)
    {
        var result = await Mediator.Send(new Update.Command {Article = article});
        return HandleResult(result);
    }
    
    [HttpPut]
    public async Task<ActionResult<Unit>> Like(int articleId)
    {
        var result = await Mediator.Send(new Like.Command {ArticleId = articleId});
        return HandleResult(result);
    }
    
    [HttpPut]
    public async Task<ActionResult<Unit>> Save(int articleId)
    {
        var result = await Mediator.Send(new Save.Command {ArticleId = articleId});
        return HandleResult(result);
    }
    
    [Authorize(Roles = "Admin")]
    [HttpPut]
    public async Task<ActionResult<Unit>> ToggleIsApproved(int articleId, bool newIsApproved)
    {
        var result = await Mediator.Send(new Approve.Command {ArticleId = articleId, NewIsApproved = newIsApproved});
        return HandleResult(result);
    }
}