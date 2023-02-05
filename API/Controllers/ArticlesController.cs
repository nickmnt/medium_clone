using Application.Articles;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ArticlesController : BaseApiController
{
    /// <summary>
    /// Returns the list of all articles.
    /// </summary>
    /// <param name="category">When available, only articles of this category will be returned</param>
    /// <param name="orderByDate">Should the articles be ordered by date? (descending)</param>
    /// <param name="orderByLikes">Should the articles be ordered by # of likes? (descending)</param>
    /// <returns></returns>
    [AllowAnonymous]
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
    
    /// <summary>
    /// Returns the list of articles that satisfy the search query.
    /// </summary>
    /// <param name="bodySubstring">Articles should include this substring in their body. (optional)</param>
    /// <param name="titleSubstring">Articles should include this substring in their title. (optional)</param>
    /// <param name="authorNameSubstring">Articles should include this substring in their author's name (optional)</param>
    /// <returns></returns>
    [HttpGet("search")]
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
    
    /// <summary>
    /// Create a new article.
    /// </summary>
    /// <param name="title">Title of the article.</param>
    /// <param name="body">Body of the article.</param>
    /// <param name="categoryId">The Id of the article's category.</param>
    /// <returns></returns>
    [HttpPost]
    public async Task<ActionResult<Unit>> Create(string title, string body, int categoryId)
    {
        var result = await Mediator.Send(new Create.Command {Title = title, Body = body, 
            CategoryId = categoryId});
        return HandleResult(result);
    }
    
    /// <summary>
    /// Update the article. (Must be owner)
    /// </summary>
    /// <param name="title">The new title of the article.</param>
    /// <param name="body">The new body of the article.</param>
    /// <param name="categoryId">The new category of the article.</param>
    /// <param name="articleId">The id of the article being edited.</param>
    /// <returns></returns>
    [Authorize(Policy = "IsArticleOwner")]
    [HttpPut]
    public async Task<ActionResult<Unit>> Update(string title, string body, int categoryId, int articleId)
    {
        var result = await Mediator.Send(new Update.Command {
            ArticleId = articleId,
            Title = title,
            Body = body,
            CategoryId = categoryId
        });
        return HandleResult(result);
    }
    
    /// <summary>
    /// Add/Remove (Toggle) the article to the list of articles liked by the current user.
    /// </summary>
    /// <param name="articleId">Id of the article to be liked.</param>
    /// <returns></returns>
    [HttpPut("like")]
    public async Task<ActionResult<Unit>> Like(int articleId)
    {
        var result = await Mediator.Send(new Like.Command {ArticleId = articleId});
        return HandleResult(result);
    }
    
    /// <summary>
    /// Add/Remove (Toggle) the article to the list of articles liked by the current user.
    /// </summary>
    /// <param name="articleId">Id of the article to be saved.</param>
    /// <returns></returns>
    [HttpPut("save")]
    public async Task<ActionResult<Unit>> Save(int articleId)
    {
        var result = await Mediator.Send(new Save.Command {ArticleId = articleId});
        return HandleResult(result);
    }
    
    /// <summary>
    /// Change the isApproved property of an article. (Must be admin)
    /// </summary>
    /// <param name="articleId">Id of the article</param>
    /// <param name="newIsApproved">New value for isApproved</param>
    /// <returns></returns>
    [Authorize(Roles = "Admin")]
    [HttpPut("approve")]
    public async Task<ActionResult<Unit>> ToggleIsApproved(int articleId, bool newIsApproved)
    {
        var result = await Mediator.Send(new Approve.Command {ArticleId = articleId, NewIsApproved = newIsApproved});
        return HandleResult(result);
    }
}